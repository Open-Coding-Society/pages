#!/usr/bin/env python3
"""
Update root-color-map.scss based on local SCSS files

This script scans all SCSS files in the project, extracts color variables,
and generates a consolidated color map file along with supporting documentation.

Usage: 
    python3 scripts/update_color_map.py

Output Files:
    - _sass/root-color-map.scss: SCSS file with all color variables and CSS custom properties
    - colors.json: JSON manifest of all discovered colors
    - local-color-usage-report.md: Detailed markdown report of color usage

Author: Auto-generated color management system
"""

import json
import re
from pathlib import Path
from collections import OrderedDict


class ColorMapUpdater:
    """
    Main class for scanning SCSS files and generating color map documentation.
    
    This class handles the complete workflow of:
    1. Finding all SCSS files in the project
    2. Extracting color variable definitions
    3. Resolving variable references
    4. Generating consolidated color map files
    5. Creating usage reports
    
    Attributes:
        scss_dir (Path): Primary directory containing SCSS files (_sass)
        open_coding_dir (Path): Additional directory for SCSS files (open-coding)
        map_file (Path): Output path for the root color map SCSS file
        json_manifest (Path): Output path for the JSON color manifest
        all_colors (OrderedDict): Dictionary storing all discovered color variables
                                  Format: {var_name: {'value': str, 'files': [str]}}
    """
    
    def __init__(self):
        """
        Initialize the ColorMapUpdater with default paths.
        
        Sets up the directory structure and initializes the color storage.
        All paths are relative to the current working directory.
        """
        # Source directories to scan for SCSS files
        self.scss_dir = Path('_sass')
        self.open_coding_dir = Path('open-coding')
        
        # Output files
        self.map_file = Path('_sass/root-color-map.scss')
        self.json_manifest = Path('colors.json')
        
        # Storage for all discovered color variables
        # OrderedDict preserves insertion order for consistent output
        self.all_colors = OrderedDict()
    
    def find_all_scss_files(self):
        """
        Find all .scss files in the project directories.
        
        Recursively searches both the _sass and open-coding directories
        for SCSS files, excluding the root-color-map.scss file itself
        to prevent circular references.
        
        Returns:
            list[Path]: Sorted list of Path objects for all discovered SCSS files
        
        Note:
            Uses rglob for recursive search, which follows subdirectories
        """
        scss_files = []
        
        # Search the primary _sass directory
        if self.scss_dir.exists():
            scss_files.extend([f for f in self.scss_dir.rglob('*.scss') 
                              if f.name != 'root-color-map.scss'])
        
        # Search the open-coding directory for additional SCSS files
        if self.open_coding_dir.exists():
            scss_files.extend([f for f in self.open_coding_dir.rglob('*.scss')])
        
        # Return sorted list for consistent processing order
        return sorted(scss_files)
    
    def extract_variable_value(self, scss_content, variable_name):
        """
        Extract the value of a specific SCSS variable from content.
        
        This method handles multiple SCSS variable syntax patterns:
        - Standard: $var: value;
        - With !default: $var: value !default;
        - Alternative assignment: $var := value;
        
        Args:
            scss_content (str): The SCSS file content to search
            variable_name (str): The variable name to find (e.g., '$primary-color')
        
        Returns:
            str: The variable's value (without !default flag), or None if not found
        
        Note:
            - Comments are stripped before searching to avoid false matches
            - Returns the LAST definition if multiple exist (last wins in SCSS)
            - Removes !default flag from returned value
        """
        # Remove single-line comments (// ...) to avoid false matches
        scss_content = re.sub(r'//.*$', '', scss_content, flags=re.MULTILINE)
        
        # Remove multi-line comments (/* ... */) to avoid false matches
        scss_content = re.sub(r'/\*.*?\*/', '', scss_content, flags=re.DOTALL)
        
        # Match variable definition with either : or := assignment
        # Pattern explanation: $var-name : value ;
        #   - Escaped variable name (could contain special regex chars)
        #   - Optional whitespace
        #   - Either : or := for assignment
        #   - Optional whitespace
        #   - Capture group for value (everything up to semicolon)
        #   - Semicolon terminator
        pattern = rf'{re.escape(variable_name)}\s*:=?\s*([^;]+);'
        matches = re.findall(pattern, scss_content)
        
        if matches:
            # Return the last definition (SCSS uses last-wins for variable redefinition)
            value = matches[-1].strip()
            
            # Remove !default flag if present (used for the default values that can be overridden)
            value = re.sub(r'\s*!default\s*$', '', value)
            return value
        
        return None
    
    def extract_all_color_variables(self, scss_content, file_path):
        """
        Extract all SCSS color variables from file content.
        
        Scans the entire SCSS content for variable definitions and filters
        for those that appear to be color-related based on their values.
        
        Args:
            scss_content (str): The complete SCSS file content
            file_path (Path): Path object for the source file (used for tracking)
        
        Returns:
            dict: Dictionary of color variables with structure:
                  {
                      'var_name': {
                          'value': 'color_value',
                          'files': ['relative/path/to/file.scss']
                      }
                  }
        
        Note:
            - Only variables with color-like values are included
            - Tracks all files where each variable is defined
            - Handles variable redefinition by using the last value
        """
        colors = {}
        
        # Strip comments to avoid extracting variables from commented code
        scss_content = re.sub(r'//.*$', '', scss_content, flags=re.MULTILINE)
        scss_content = re.sub(r'/\*.*?\*/', '', scss_content, flags=re.DOTALL)
        
        # Find all variable definitions in the content
        # Pattern matches: $variable-name: value;
        #   - $ literal
        #   - Variable name (alphanumeric, underscore, hyphen; must start with letter/underscore)
        #   - Optional whitespace
        #   - : or := for assignment
        #   - Optional whitespace
        #   - Capture group for value
        #   - Semicolon terminator
        pattern = r'\$([a-zA-Z_][a-zA-Z0-9_-]*)\s*:=?\s*([^;]+);'
        matches = re.findall(pattern, scss_content)
        
        # Get relative path for tracking where variables are defined
        # Use try-except to handle cases where file might be outside CWD
        try:
            rel_path = str(file_path.relative_to(Path.cwd()))
        except ValueError:
            # Fall back to absolute path if relative path fails
            rel_path = str(file_path)
        
        # Process each variable definition found
        for var_name, value in matches:
            value = value.strip()
            
            # Remove !default flag if present
            value = re.sub(r'\s*!default\s*$', '', value)
            
            # Only keep variables that look like color values
            # This filters out non-color variables (dimensions, fonts, etc.)
            if self.is_color_value(value):
                if var_name not in colors:
                    # First occurrence of this variable
                    colors[var_name] = {
                        'value': value,
                        'files': [rel_path]
                    }
                else:
                    # Variable redefined - update value and add file to tracking
                    colors[var_name]['value'] = value
                    colors[var_name]['files'].append(rel_path)
        
        return colors
    
    def is_color_value(self, value):
        """
        Determine if a value represents a color.
        
        Checks if the given value matches common color formats used in CSS/SCSS:
        - Hex colors (#RGB, #RRGGBB, #RRGGBBAA)
        - RGB/RGBA functions
        - HSL/HSLA functions
        - CSS gradients
        - Variable references (may resolve to colors)
        - Named colors
        
        Args:
            value (str): The value to check (e.g., '#ff0000', 'rgb(255,0,0)', '$primary')
        
        Returns:
            bool: True if the value appears to be a color, False otherwise
        
        Note:
            This is a heuristic check and may have false positives/negatives.
            Variable references are included because they may resolve to colors.
        """
        # Hex color codes: #RGB, #RRGGBB, #RRGGBBAA
        # Examples: #f00, #ff0000, #ff0000ff
        if re.match(r'^#[0-9a-fA-F]{3,8}$', value):
            return True
        
        # RGB/RGBA color functions
        # Examples: rgb(255, 0, 0), rgba(255, 0, 0, 0.5)
        if re.match(r'^rgba?\(', value):
            return True
        
        # HSL/HSLA color functions
        # Examples: hsl(0, 100%, 50%), hsla(0, 100%, 50%, 0.5)
        if re.match(r'^hsla?\(', value):
            return True
        
        # CSS gradients (contain colors)
        # Examples: linear-gradient(red, blue), radial-gradient(circle, #f00, #00f)
        if 'linear-gradient' in value or 'radial-gradient' in value:
            return True
        
        # Variable references that may point to colors
        # Examples: $primary-color, $base-bg
        if re.match(r'^\$[a-zA-Z_]', value):
            return True
        
        # Named CSS colors
        # This is a partial list of common color names
        # Full list would include: red, green, blue, yellow, etc.
        color_names = ['white', 'black', 'red', 'green', 'blue', 'transparent']
        if any(name in value.lower() for name in color_names):
            return True
        
        # If none of the above patterns match, likely not a color
        return False
    
    def resolve_variable_references(self, value, scss_content, depth=0):
        """
        Recursively resolve SCSS variable references to their final values.
        
        If a variable value contains references to other variables (e.g., $other-var),
        this method attempts to resolve those references by looking them up in the
        same SCSS content. Recursion continues until no more references are found
        or the depth limit is reached.
        
        Args:
            value (str): The value potentially containing variable references
            scss_content (str): The SCSS content to search for variable definitions
            depth (int): Current recursion depth (prevents infinite loops)
        
        Returns:
            str: The value with all possible variable references resolved
        
        Example:
            Input:  "$base-color" where $base-color: $primary; and $primary: #ff0000
            Output: "#ff0000"
        
        Note:
            - Maximum recursion depth is 10 to prevent infinite loops
            - Circular references will be partially resolved up to the depth limit
            - If a referenced variable isn't found, the reference remains in the value
        """
        # Prevent infinite recursion from circular variable references
        # Example: $a: $b; $b: $a; would cause infinite loop
        if depth > 10:
            return value
        
        # Early return if no variable references present
        if not value or '$' not in value:
            return value
        
        # Extract all variable references from the value
        # Matches: $variable-name, $another_var, etc.
        var_refs = re.findall(r'\$[\w-]+', value)
        
        # Attempt to resolve each variable reference
        for var_ref in var_refs:
            # Look up the variable's value in the SCSS content
            resolved = self.extract_variable_value(scss_content, var_ref)
            
            # Only replace if we found a definition and it's different
            if resolved and resolved != var_ref:
                # Recursively resolve in case the value contains more variables
                # Example: $primary: $base; where $base: $root; where $root: #fff
                resolved = self.resolve_variable_references(resolved, scss_content, depth + 1)
                
                # Replace the variable reference with its resolved value
                value = value.replace(var_ref, resolved)
        
        return value
    
    def sanitize_variable_name(self, name):
        """
        Convert a variable name to a valid SCSS identifier.
        
        SCSS variable names must follow specific rules:
        - Can contain letters, numbers, hyphens, and underscores
        - Cannot start with a number
        - Cannot contain spaces or special characters
        
        This method cleans up variable names that may come from various sources
        to ensure they're valid SCSS identifiers.
        
        Args:
            name (str): The variable name to sanitize
        
        Returns:
            str: A valid SCSS variable name, or 'color' if the input becomes empty
        
        Example:
            Input:  "primary color (light)"
            Output: "primary-color-light"
        
        Note:
            - Spaces and special characters become hyphens
            - Leading numbers and hyphens are removed
            - If the result is empty, returns 'color' as a fallback
        """
        # Replace spaces and grouping characters with hyphens
        # Example: "text (dark)" -> "text--dark-"
        name = re.sub(r'[\s/\\()]+', '-', name)
        
        # Remove any remaining invalid characters
        # Keep only: letters (a-z, A-Z), numbers (0-9), hyphens (-), underscores (_)
        name = re.sub(r'[^a-zA-Z0-9_-]', '', name)
        
        # Remove leading numbers and hyphens (SCSS variables can't start with these)
        # Example: "123-color" -> "color", "-primary" -> "primary"
        name = re.sub(r'^[0-9-]+', '', name)
        
        # Return sanitized name, or 'color' if nothing remains
        return name if name else 'color'
    
    def update_map(self):
        """
        Main workflow: Scan local SCSS files and update the root color map.
        
        This method orchestrates the entire color extraction and generation process:
        1. Find all SCSS files in the project
        2. Extract color variables from each file
        3. Consolidate all colors into the all_colors dictionary
        4. Generate output files (SCSS map, JSON manifest, usage report)
        
        The method provides console output to show progress and results.
        
        Raises:
            Exception: Logs errors for individual file processing but continues
        """
        print(f"\nUpdating color map from local SCSS files\n")
        
        # Step 1: Discover all SCSS files
        scss_files = self.find_all_scss_files()
        print(f"Found {len(scss_files)} SCSS file(s)")
        
        print(f"\nExtracting color variables:")
        
        # Step 2: Extract variables from each file
        for scss_file in scss_files:
            try:
                # Read file content with UTF-8 encoding, ignoring errors
                content = scss_file.read_text(encoding='utf-8', errors='ignore')
                
                # Extract all color variables from this file
                colors = self.extract_all_color_variables(content, scss_file)
                
                # Step 3: Consolidate into master color dictionary
                for var_name, info in colors.items():
                    if var_name not in self.all_colors:
                        # New variable - add it
                        self.all_colors[var_name] = info
                    else:
                        # Variable exists - update value and merge file lists
                        # Last definition wins (SCSS behavior)
                        self.all_colors[var_name]['value'] = info['value']
                        self.all_colors[var_name]['files'].extend(info['files'])
                        
            except Exception as e:
                # Log error but continue processing other files
                print(f"   Error reading {scss_file}: {e}")
        
        print(f"   ✓ Found {len(self.all_colors)} unique color variable(s)\n")
        
        # Step 4: Generate all output files
        self.write_map_file()
        self.write_json_manifest()
        self.write_usage_report()
    
    def write_map_file(self):
        """
        Write the updated root-color-map.scss file.
        
        Generates a complete SCSS file containing:
        1. Header with generation info and warnings
        2. All color variables, organized by source file
        3. CSS custom properties (:root block) for modern CSS usage
        
        The output file structure:
        - Header comments explaining the file's purpose
        - Variables grouped by source file for organization
        - CSS custom properties at the end for browser compatibility
        
        Output Format:
            // AUTO-GENERATED ROOT COLOR MAP
            
            // FILENAME.SCSS
            // -----------------------------------------------
            $variable-name: #value;
            
            :root {
              --variable-name: #{$variable-name};
            }
        
        Note:
            - Creates parent directories if they don't exist
            - Overwrites existing file completely
            - CSS custom properties use #{} interpolation for SCSS variables
        """
        # Generate file header with warnings and metadata
        output = """// AUTO-GENERATED ROOT COLOR MAP FOR LOCAL STYLING
// This file contains all color variables used across the local repository
// Generated by scripts/update_color_map.py
//
// DO NOT EDIT MANUALLY - Run the script to regenerate

"""
        
        # Group variables by source file for better organization
        # This creates sections in the output file for each source SCSS file
        files_dict = {}
        for var_name, info in self.all_colors.items():
            for file in info['files']:
                if file not in files_dict:
                    files_dict[file] = []
                # Store tuple of (variable_name, variable_info)
                files_dict[file].append((var_name, info))
        
        # Write variables grouped by source file
        for file in sorted(files_dict.keys()):
            # Create a readable header for each source file section
            file_name = Path(file).name.upper()
            output += f"\n// {file_name}\n"
            output += "// " + "-" * 77 + "\n\n"
            
            # Write each variable from this file
            for var_name, info in sorted(files_dict[file], key=lambda x: x[0]):
                # Ensure variable name is valid SCSS
                sanitized = self.sanitize_variable_name(var_name)
                output += f"${sanitized}: {info['value']};\n"
        
        # Add CSS custom properties section
        # These allow the colors to be used in modern CSS without SCSS
        output += """
// =============================================================================
// CSS CUSTOM PROPERTIES
// =============================================================================

:root {
"""
        
        # Convert all SCSS variables to CSS custom properties
        for var_name in sorted(self.all_colors.keys()):
            sanitized = self.sanitize_variable_name(var_name)
            # Convert underscores to hyphens for CSS custom property convention
            css_var = sanitized.replace('_', '-')
            # Use #{} interpolation to insert SCSS variable value into CSS
            output += f"  --{css_var}: #{{${sanitized}}};\n"
        
        output += "}\n"
        
        # Ensure output directory exists
        self.map_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Write the complete file
        self.map_file.write_text(output)
        print(f"Successfully updated: {self.map_file}")
    
    def write_json_manifest(self):
        """
        Write JSON manifest of all colors.
        
        Creates a machine-readable JSON file containing all discovered color
        variables, their values, and source files. This is useful for:
        - Integration with build tools
        - Documentation generation
        - Color analysis tools
        - Version control diffs
        
        Output Format:
            {
              "generated_by": "scripts/update_color_map.py",
              "total_colors": 42,
              "colors": {
                "variable-name": {
                  "value": "#ff0000",
                  "source_files": ["path/to/file.scss"]
                }
              }
            }
        
        Note:
            - Uses 2-space indentation for readability
            - Overwrites existing file completely
        """
        # Build the manifest structure
        manifest = {
            'generated_by': 'scripts/update_color_map.py',
            'total_colors': len(self.all_colors),
            'colors': {}
        }
        
        # Add all color variables to the manifest
        for var_name, info in self.all_colors.items():
            manifest['colors'][var_name] = {
                'value': info['value'],
                'source_files': info['files']
            }
        
        # Write formatted JSON to file
        self.json_manifest.write_text(json.dumps(manifest, indent=2))
        print(f"Successfully updated: {self.json_manifest}")
    
    def write_usage_report(self):
        """
        Create a detailed markdown report of color usage.
        
        Generates a comprehensive report documenting:
        1. Summary statistics (total colors, files)
        2. Colors organized by source file
        3. Colors used in multiple files (potential for consolidation)
        4. Complete alphabetical listing of all colors
        
        This report helps developers:
        - Understand color distribution across the project
        - Identify duplicate or redundant color definitions
        - Plan color consolidation and refactoring
        - Document the color system
        
        Output Sections:
        - Summary: High-level statistics
        - Colors by File: Organized view of where each color is defined
        - Colors Used in Multiple Files: Highlights shared colors
        - All Colors (Alphabetical): Complete reference list
        
        Note:
            - Limits "multiple files" section to top 20 most-used colors
            - Uses markdown formatting for readability
            - Output file: local-color-usage-report.md in project root
        """
        # Initialize report with title
        report = "# Local Color Usage Report\n\n"
        
        # SECTION 1: Summary Statistics
        report += f"## Summary\n\n"
        report += f"- Total unique colors found: {len(self.all_colors)}\n"
        
        # Count unique files that contain colors
        all_files = set()
        for info in self.all_colors.values():
            all_files.update(info['files'])
        report += f"- Files with colors: {len(all_files)}\n\n"
        
        # SECTION 2: Colors organized by file
        report += "## Colors by File\n\n"
        
        # Group colors by their source files
        files_dict = {}
        for var_name, info in self.all_colors.items():
            for file in info['files']:
                if file not in files_dict:
                    files_dict[file] = []
                files_dict[file].append((var_name, info))
        
        # Write a subsection for each file
        for file in sorted(files_dict.keys()):
            file_name = Path(file).name
            report += f"### {file_name} ({len(files_dict[file])} colors)\n\n"
            
            # List each color in this file
            for var_name, info in sorted(files_dict[file], key=lambda x: x[0]):
                report += f"- `${var_name}`: `{info['value']}`\n"
            
            report += "\n"
        
        # SECTION 3: Colors used in multiple files
        # These are candidates for consolidation into a shared color palette
        report += "## Colors Used in Multiple Files\n\n"
        
        # Filter for colors that appear in more than one file
        multi_file_colors = [(var_name, info) for var_name, info in self.all_colors.items() 
                             if len(info['files']) > 1]
        
        # Sort by frequency (most files first)
        multi_file_colors.sort(key=lambda x: len(x[1]['files']), reverse=True)
        
        if multi_file_colors:
            # Show top 20 most-used colors
            for var_name, info in multi_file_colors[:20]:
                report += f"### `${var_name}` ({len(info['files'])} files)\n\n"
                report += f"**Value**: `{info['value']}`\n\n"
                
                # List all files using this color
                file_names = [Path(f).name for f in sorted(info['files'])]
                report += f"**Files**: {', '.join(file_names)}\n\n"
        else:
            report += "No colors are used in multiple files.\n\n"
        
        # SECTION 4: Complete alphabetical listing
        report += "## All Colors (Alphabetical)\n\n"
        
        for var_name in sorted(self.all_colors.keys()):
            info = self.all_colors[var_name]
            report += f"- **${var_name}**: `{info['value']}`\n"
        
        # Write report to file
        report_path = Path('local-color-usage-report.md')
        report_path.write_text(report)
        print(f"Successfully updated: {report_path}")


def main():
    """
    Main entry point for the color map updater script.
    
    Creates a ColorMapUpdater instance and runs the update process.
    Provides helpful output about what was done and next steps for the user.
    
    This function is called when the script is run directly from the command line.
    """
    # Create updater instance and run the update process
    updater = ColorMapUpdater()
    updater.update_map()
    
    # Provide success message and next steps
    print(f"\nColor map updated!")
    print(f"\nNext steps:")
    print(f"   1. Edit _sass/user-colors.scss to customize colors")
    print(f"   2. Run: make update-colors")
    print(f"   3. Rebuild your site")


# Script entry point
# This ensures main() only runs when the script is executed directly,
# not when it's imported as a module
if __name__ == "__main__":
    main()