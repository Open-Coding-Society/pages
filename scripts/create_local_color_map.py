#!/usr/bin/env python3
"""
Local Color Map Generator
Scans all local SCSS files and creates a comprehensive color variable map
For use with the pages repository - maps colors from local styling only
"""

import re
from pathlib import Path
from collections import defaultdict
import json

class LocalColorMapper:
    def __init__(self, scss_dir='_sass'):
        self.scss_dir = Path(scss_dir)
        self.colors = defaultdict(list)  # color value -> list of usages
        self.existing_vars = {}  # existing variable -> value
        self.component_colors = defaultdict(lambda: defaultdict(set))  # component -> context -> colors
        
        # Color patterns to match
        self.color_patterns = {
            'hex': r'#[0-9a-fA-F]{3,8}\b',
            'rgb': r'rgba?\([^)]+\)',
            'hsl': r'hsla?\([^)]+\)',
            'named': r'\b(black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|transparent|inherit)\b'
        }
    
    def extract_existing_variables(self):
        """Extract already defined SCSS variables from colors.scss and user-colors.scss"""
        # Files to check for existing variables
        color_files = [
            self.scss_dir / 'open-coding' / 'materials' / 'colors.scss',
            self.scss_dir / 'user-colors.scss'
        ]
        
        total_vars = 0
        for colors_file in color_files:
            if colors_file.exists():
                print(f"📋 Found existing colors file: {colors_file}")
                content = colors_file.read_text()
                # Match $variable: value;
                pattern = r'\$([a-zA-Z0-9_-]+)\s*:\s*([^;]+);'
                vars_in_file = 0
                for match in re.finditer(pattern, content):
                    var_name, value = match.groups()
                    self.existing_vars[f'${var_name}'] = value.strip()
                    vars_in_file += 1
                print(f"   Found {vars_in_file} variables in this file")
                total_vars += vars_in_file
        
        print(f"✅ Total existing color variables: {total_vars}")
    
    def normalize_color(self, color):
        """Normalize color values for comparison"""
        color = color.strip().lower()
        # Remove whitespace in rgba/rgb
        color = re.sub(r'\s+', '', color)
        return color
    
    def get_component_from_path(self, file_path):
        """Determine component name from file path"""
        parts = file_path.parts
        
        # Map specific paths to component names
        if 'materials' in parts:
            return 'materials'
        elif 'elements' in parts:
            idx = parts.index('elements')
            if idx + 1 < len(parts):
                return f"elements-{parts[idx + 1]}"
        elif 'open-coding' in parts:
            idx = parts.index('open-coding')
            if idx + 1 < len(parts):
                name = parts[idx + 1]
                if name not in ['elements', 'materials']:
                    return name
        
        return file_path.stem
    
    def get_color_context(self, line, color):
        """Determine what the color is used for based on context"""
        line_lower = line.lower()
        
        contexts = {
            'background': ['background', 'bg-', 'bg:'],
            'text': ['color:', 'text-', 'font-color'],
            'border': ['border'],
            'hover': [':hover', 'hover-', 'hover:'],
            'active': [':active', 'active-'],
            'focus': [':focus', 'focus-'],
            'disabled': ['disabled', ':disabled'],
            'error': ['error', 'danger', 'invalid'],
            'success': ['success', 'valid', 'ok', 'correct'],
            'warning': ['warning', 'warn', 'caution'],
            'info': ['info', 'primary'],
            'shadow': ['shadow', 'box-shadow'],
            'gradient': ['gradient'],
            'link': ['link', 'anchor'],
        }
        
        for context, keywords in contexts.items():
            if any(kw in line_lower for kw in keywords):
                return context
        
        return 'general'
    
    def scan_scss_files(self):
        """Scan all local SCSS files for color values"""
        print("\n🔍 Scanning local SCSS files for colors...")
        
        scss_files = list(self.scss_dir.rglob('*.scss'))
        
        # CRITICAL: Exclude the auto-generated root-color-map.scss to avoid circular references
        scss_files = [f for f in scss_files if f.name != 'root-color-map.scss']
        
        print(f"   Found {len(scss_files)} SCSS files to scan (excluding root-color-map.scss)")
        
        for scss_file in scss_files:
            relative_path = scss_file.relative_to(self.scss_dir)
            component = self.get_component_from_path(relative_path)
            
            try:
                content = scss_file.read_text()
                lines = content.split('\n')
                
                for line_num, line in enumerate(lines, 1):
                    # Skip comments
                    if line.strip().startswith('//') or line.strip().startswith('/*'):
                        continue
                    
                    # Find all colors in this line
                    for pattern_type, pattern in self.color_patterns.items():
                        for match in re.finditer(pattern, line):
                            color = match.group(0)
                            
                            # Skip if it's already a variable reference
                            if color.startswith('$'):
                                continue
                            
                            # Skip CSS keywords that aren't really colors
                            if color in ['inherit', 'transparent']:
                                continue
                            
                            normalized_color = self.normalize_color(color)
                            context = self.get_color_context(line, color)
                            
                            self.colors[normalized_color].append({
                                'file': str(relative_path),
                                'line': line_num,
                                'original': color,
                                'context': context,
                                'component': component
                            })
                            
                            # Track by component
                            self.component_colors[component][context].add(normalized_color)
            
            except Exception as e:
                print(f"  ⚠️ Error reading {relative_path}: {e}")
        
        print(f"✅ Found {len(self.colors)} unique colors across all files")
    
    def generate_variable_name(self, color, component, context, usage_count):
        """Generate semantic variable name for a color"""
        # Check if this color matches an existing variable value
        for var_name, var_value in self.existing_vars.items():
            if self.normalize_color(var_value) == color:
                return var_name
        
        # Generate new variable name
        # Clean component name
        component = component.replace('elements-', '').replace('_', '-')
        prefix = f"${component}"
        
        if context != 'general':
            prefix += f"-{context}"
        
        # Try to describe the color
        color_desc = self.describe_color(color)
        if color_desc:
            prefix += f"-{color_desc}"
        
        # Clean up the name
        prefix = re.sub(r'[^a-zA-Z0-9_-]+', '-', prefix)
        prefix = re.sub(r'-+', '-', prefix)
        prefix = prefix.strip('-')
        
        return prefix
    
    def describe_color(self, color):
        """Try to describe a color (light/dark, shade, etc.)"""
        # For hex colors, determine if light or dark
        if color.startswith('#'):
            hex_color = color.lstrip('#')
            if len(hex_color) == 3:
                hex_color = ''.join([c*2 for c in hex_color])
            
            try:
                r = int(hex_color[0:2], 16)
                g = int(hex_color[2:4], 16)
                b = int(hex_color[4:6], 16)
                
                # Calculate brightness
                brightness = (r + g + b) / 3
                
                if brightness > 200:
                    return 'light'
                elif brightness < 50:
                    return 'dark'
                elif brightness < 128:
                    return 'dim'
                
                # Determine dominant color
                if r > g and r > b and r > 150:
                    return 'red'
                elif g > r and g > b and g > 150:
                    return 'green'
                elif b > r and b > g and b > 150:
                    return 'blue'
            except:
                pass
        
        return None
    
    def generate_color_map(self):
        """Generate the root color map"""
        print("\n📝 Generating unified color map...")
        
        output = """// AUTO-GENERATED ROOT COLOR MAP FOR LOCAL STYLING
// This file contains all color variables used across the local repository
// Generated by scripts/create_local_color_map.py
//
// DO NOT EDIT MANUALLY - Run the script to regenerate

// =============================================================================
// EXISTING COLOR VARIABLES (from colors.scss and user-colors.scss)
// =============================================================================

"""
        
        # First, list existing variables
        if self.existing_vars:
            for var_name, value in sorted(self.existing_vars.items()):
                output += f"{var_name}: {value};\n"
        else:
            output += "// No existing variables found\n"
        
        output += """
// =============================================================================
// COMPONENT-SPECIFIC COLORS (extracted from all SCSS files)
// =============================================================================

"""
        
        # Group colors by component
        component_vars = defaultdict(list)
        seen_colors = set()
        
        for color, usages in sorted(self.colors.items()):
            # Skip if we've already mapped this color or it exists in variables
            if color in seen_colors:
                continue
            
            # Check if this color is already defined in existing vars
            already_defined = False
            for var_name, var_value in self.existing_vars.items():
                if self.normalize_color(var_value) == color:
                    already_defined = True
                    break
            
            if already_defined:
                continue
                
            seen_colors.add(color)
            
            # Get primary component and context
            primary_usage = usages[0]
            component = primary_usage['component']
            context = primary_usage['context']
            
            # Generate variable name
            var_name = self.generate_variable_name(
                color, 
                component, 
                context, 
                len([u for u in usages if u['component'] == component])
            )
            
            # Track the variable
            component_vars[component].append({
                'var_name': var_name,
                'value': primary_usage['original'],
                'context': context,
                'usages': len(usages),
                'files': set(u['file'] for u in usages)
            })
        
        # Write component sections
        for component in sorted(component_vars.keys()):
            output += f"// {component.upper().replace('-', ' ')}\n"
            output += f"// {'-' * 77}\n\n"
            
            for var_info in sorted(component_vars[component], key=lambda x: (x['context'], x['var_name'])):
                output += f"{var_info['var_name']}: {var_info['value']};\n"
                output += f"// Context: {var_info['context']}\n"
                output += f"// Used {var_info['usages']} time(s) in {len(var_info['files'])} file(s)\n"
                output += f"// Files: {', '.join(sorted(list(var_info['files'])[:3]))}\n\n"
        
        output += """// =============================================================================
// CSS CUSTOM PROPERTIES (for JavaScript/dynamic access)
// =============================================================================

:root {
"""
        
        # Create CSS custom properties for all variables
        all_vars = list(self.existing_vars.keys())
        for component, vars_list in sorted(component_vars.items()):
            for var_info in vars_list:
                all_vars.append(var_info['var_name'])
        
        for var_name in sorted(set(all_vars)):
            css_name = var_name.replace('$', '--').replace('_', '-')
            output += f"  {css_name}: #{{{var_name}}};\n"
        
        output += "}\n"
        
        return output
    
    def create_usage_report(self):
        """Create a detailed report of color usage"""
        report = "# Local Color Usage Report\n\n"
        
        report += f"## Summary\n\n"
        report += f"- Total unique colors found: {len(self.colors)}\n"
        report += f"- Existing variables: {len(self.existing_vars)}\n"
        report += f"- Components with colors: {len(self.component_colors)}\n\n"
        
        report += "## Colors by Component\n\n"
        
        for component in sorted(self.component_colors.keys()):
            contexts = self.component_colors[component]
            total_colors = sum(len(colors) for colors in contexts.values())
            
            report += f"### {component} ({total_colors} unique colors)\n\n"
            
            for context in sorted(contexts.keys()):
                colors = contexts[context]
                report += f"- **{context}**: {len(colors)} colors\n"
            
            report += "\n"
        
        report += "## Most Used Colors\n\n"
        
        sorted_colors = sorted(self.colors.items(), key=lambda x: len(x[1]), reverse=True)
        
        for color, usages in sorted_colors[:30]:
            report += f"### `{usages[0]['original']}` ({len(usages)} usages)\n\n"
            components = set(u['component'] for u in usages)
            report += f"**Components**: {', '.join(sorted(components))}\n\n"
            contexts = set(u['context'] for u in usages)
            report += f"**Contexts**: {', '.join(sorted(contexts))}\n\n"
            
            # Show first few file locations
            files = sorted(set(u['file'] for u in usages))[:5]
            report += f"**Files**: {', '.join(files)}\n\n"
        
        return report
    
    def run(self, output_file='_sass/root-color-map.scss'):
        """Run the full color extraction and map generation"""
        print("🎨 Creating Local Root Color Map\n")
        print("=" * 50)
        
        # Step 1: Extract existing variables
        print("\n📋 Step 1: Extracting existing color variables...")
        self.extract_existing_variables()
        
        # Step 2: Scan all SCSS files
        print("\n🔍 Step 2: Scanning all local SCSS files...")
        self.scan_scss_files()
        
        # Step 3: Generate the color map
        print("\n📝 Step 3: Generating color map...")
        color_map_content = self.generate_color_map()
        
        # Step 4: Write the file
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(color_map_content)
        
        print(f"✅ Color map written to: {output_file}")
        
        # Step 5: Create usage report
        print("\n📊 Step 4: Creating usage report...")
        report_content = self.create_usage_report()
        report_path = Path('local-color-usage-report.md')
        report_path.write_text(report_content)
        
        print(f"✅ Usage report written to: {report_path}")
        
        print("\n" + "=" * 50)
        print("🎉 Done! Next steps:")
        print("   1. Review the generated color map: _sass/root-color-map.scss")
        print("   2. Check the usage report: local-color-usage-report.md")
        print("   3. Optionally refactor SCSS files to use the new variables")
        print("   4. Test your site to ensure colors are correct")

def main():
    import sys
    
    # Allow custom scss directory
    scss_dir = sys.argv[1] if len(sys.argv) > 1 else '_sass'
    
    mapper = LocalColorMapper(scss_dir=scss_dir)
    mapper.run()

if __name__ == "__main__":
    main()