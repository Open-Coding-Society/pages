#!/usr/bin/env python3
"""
Simple diagnostic for real conversion warnings
Only checks for issues that would appear during normal Jekyll builds
"""

import os
import sys
import warnings
from pathlib import Path
import nbformat
from concurrent.futures import ProcessPoolExecutor, as_completed
import time

def check_notebook_for_real_warnings(notebook_path_str):
    """Check notebook for warnings that actually show up during builds"""
    notebook_path = Path(notebook_path_str)
    issues = []
    
    try:
        # Check for nbformat warnings (the main real issue we see)
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            
            with open(notebook_path, 'r', encoding='utf-8') as f:
                nb = nbformat.read(f, as_version=nbformat.NO_CONVERT)
            
            # Validate to trigger warnings
            nbformat.validate(nb)
            
            # Collect all warnings
            for warning in w:
                issues.append({
                    'type': 'warning',
                    'category': str(warning.category.__name__),
                    'message': str(warning.message),
                    'source': 'nbformat'
                })
        
        # Check for Unicode encoding issues that would break conversion
        try:
            # Try to simulate what the conversion script does - convert to string and encode
            nb_content = str(nb)
            nb_content.encode('utf-8')
            
            # Also check individual cell content for problematic characters
            for cell in nb.cells:
                if 'source' in cell:
                    cell_source = cell['source']
                    if isinstance(cell_source, list):
                        cell_source = ''.join(cell_source)
                    # Try to encode the cell content
                    cell_source.encode('utf-8')
                    
                    # Check for surrogate characters specifically
                    if any(0xD800 <= ord(char) <= 0xDFFF for char in cell_source):
                        issues.append({
                            'type': 'error',
                            'category': 'UnicodeEncodeError',
                            'message': 'Cell contains surrogate Unicode characters that cannot be encoded',
                            'source': 'conversion'
                        })
        except UnicodeEncodeError as e:
            issues.append({
                'type': 'error',
                'category': 'UnicodeEncodeError',
                'message': f'Unicode encoding error: {str(e)}',
                'source': 'conversion'
            })
        
        return {
            'path': notebook_path_str,
            'issues': issues,
            'error': None
        }
        
    except Exception as e:
        return {
            'path': notebook_path_str,
            'issues': [],
            'error': str(e)
        }

def fix_notebook_issues(notebook_path_str, issues):
    """Fix issues that can be automatically resolved"""
    notebook_path = Path(notebook_path_str)
    fixed_issues = []
    
    try:
        with open(notebook_path, 'r', encoding='utf-8') as f:
            nb = nbformat.read(f, as_version=nbformat.NO_CONVERT)
        
        needs_save = False
        
        # Fix MissingIDFieldWarning by normalizing
        for issue in issues:
            if 'MissingIDFieldWarning' in issue['message'] or 'missing an id field' in issue['message']:
                nb = nbformat.validator.normalize(nb)[1]
                needs_save = True
                fixed_issues.append('MissingIDFieldWarning')
                break
        
        # Fix Unicode encoding issues
        for issue in issues:
            if issue['category'] == 'UnicodeEncodeError':
                # Clean up problematic Unicode characters in cells
                for cell in nb.cells:
                    if 'source' in cell:
                        cell_source = cell['source']
                        if isinstance(cell_source, list):
                            cell_source = ''.join(cell_source)
                        
                        # Remove or replace surrogate characters
                        cleaned_source = ''
                        for char in cell_source:
                            if 0xD800 <= ord(char) <= 0xDFFF:
                                # Replace surrogate characters with a replacement character
                                cleaned_source += '\uFFFD'  # Unicode replacement character
                            else:
                                cleaned_source += char
                        
                        # Update the cell source if changes were made
                        if cleaned_source != cell_source:
                            if isinstance(cell['source'], list):
                                cell['source'] = [cleaned_source]
                            else:
                                cell['source'] = cleaned_source
                            needs_save = True
                
                if needs_save:
                    fixed_issues.append('UnicodeEncodeError')
                break
        
        # Save if changes were made
        if needs_save:
            with open(notebook_path, 'w', encoding='utf-8') as f:
                nbformat.write(nb, f)
        
        return {
            'path': notebook_path_str,
            'success': True,
            'fixed': fixed_issues,
            'error': None
        }
        
    except Exception as e:
        return {
            'path': notebook_path_str,
            'success': False,
            'fixed': [],
            'error': str(e)
        }

def main():
    base_dir = Path.cwd()
    notebook_files = list(base_dir.glob("**/*.ipynb"))
    
    # Filter out notebooks in excluded directories
    excluded_dirs = {'_site', '.git', 'venv', '__pycache__', '.ipynb_checkpoints', 'node_modules'}
    notebook_files = [
        nb for nb in notebook_files 
        if not any(part in excluded_dirs for part in nb.parts)
    ]
    
    total_notebooks = len(notebook_files)
    print(f"🔍 Checking {total_notebooks} notebooks for real build warnings...")
    
    problematic_notebooks = []
    all_issues = {}
    processed = 0
    start_time = time.time()
    
    # Use parallel processing for speed
    max_workers = min(8, os.cpu_count() or 1)
    
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_notebook = {
            executor.submit(check_notebook_for_real_warnings, str(nb)): nb 
            for nb in notebook_files
        }
        
        # Process results as they complete
        for future in as_completed(future_to_notebook):
            result = future.result()
            processed += 1
            
            # Progress reporting
            elapsed = time.time() - start_time
            rate = processed / elapsed if elapsed > 0 else 0
            eta = (total_notebooks - processed) / rate if rate > 0 else 0
            
            current_file = Path(result['path']).name
            print(f"\r🔍 {processed}/{total_notebooks} ({processed/total_notebooks*100:.1f}%) "
                  f"| {rate:.1f}/s | ETA: {eta:.0f}s | {current_file[:40]}", 
                  end='', flush=True)
            
            if result['issues']:
                rel_path = Path(result['path']).relative_to(base_dir)
                issue_count = len(result['issues'])
                
                print(f"\n📝 {len(problematic_notebooks) + 1}. {rel_path} ({issue_count} warnings)")
                
                # Group issues by category and count them
                issue_counts = {}
                for issue in result['issues']:
                    category = issue['category']
                    if category not in issue_counts:
                        issue_counts[category] = []
                    issue_counts[category].append(issue['message'])
                
                # Show counts per category for this notebook
                for category, messages in issue_counts.items():
                    print(f"    🔸 {category}: {len(messages)} occurrence(s)")
                    # Show first message as example
                    if messages:
                        first_msg = messages[0]
                        if len(first_msg) > 80:
                            first_msg = first_msg[:77] + "..."
                        print(f"       Example: {first_msg}")
                
                problematic_notebooks.append(result['path'])
                all_issues[result['path']] = result['issues']
                
            elif result['error']:
                rel_path = Path(result['path']).relative_to(base_dir)
                print(f"\n❌ Error checking {rel_path}: {result['error']}")
    
    print("\n")  # New line after progress
    
    elapsed_total = time.time() - start_time
    
    if problematic_notebooks:
        total_issues = sum(len(issues) for issues in all_issues.values())
        print(f"⚠️ Found {len(problematic_notebooks)} notebooks with {total_issues} total warnings:")
        
        # Summarize issue types across all notebooks
        issue_summary = {}
        notebooks_per_issue = {}
        for notebook_path, issues_list in all_issues.items():
            rel_path = Path(notebook_path).relative_to(base_dir)
            for issue in issues_list:
                issue_key = issue['category']
                issue_summary[issue_key] = issue_summary.get(issue_key, 0) + 1
                
                if issue_key not in notebooks_per_issue:
                    notebooks_per_issue[issue_key] = set()
                notebooks_per_issue[issue_key].add(str(rel_path))
        
        print(f"\n📊 Overall Warning Summary:")
        for issue_type in sorted(issue_summary.keys()):
            count = issue_summary[issue_type]
            affected_notebooks = len(notebooks_per_issue[issue_type])
            print(f"  🔹 {issue_type}: {count} issues across {affected_notebooks} notebook(s)")
        
        # Show fix recommendations for different issue types
        fixable_issues = []
        if 'MissingIDFieldWarning' in issue_summary:
            fixable_issues.append(f"{issue_summary['MissingIDFieldWarning']} MissingIDFieldWarning")
        if 'UnicodeEncodeError' in issue_summary:
            fixable_issues.append(f"{issue_summary['UnicodeEncodeError']} UnicodeEncodeError")
        
        if fixable_issues:
            print(f"\n💡 Run 'make convert-fix' to fix {', '.join(fixable_issues)} issues")
        
        # Add detailed notebook list at the end
        if len(issue_summary) == 1:
            issue_type_name = list(issue_summary.keys())[0]
            print(f"\n📝 Notebooks with {issue_type_name} Issues:")
        else:
            print(f"\n📝 Notebooks with Issues:")
        notebook_list = []
        for notebook_path, issues_list in all_issues.items():
            rel_path = Path(notebook_path).relative_to(base_dir)
            warning_count = len(issues_list)
            
            # Get breakdown by issue type for this notebook
            issue_breakdown = {}
            for issue in issues_list:
                issue_type = issue['category']
                issue_breakdown[issue_type] = issue_breakdown.get(issue_type, 0) + 1
            
            notebook_list.append((str(rel_path), warning_count, issue_breakdown))
        
        # Sort by warning count (highest first) for priority
        notebook_list.sort(key=lambda x: x[1], reverse=True)
        
        total_warnings = 0
        for i, (notebook_path, warning_count, issue_breakdown) in enumerate(notebook_list, 1):
            print(f"{i:2d}. **`{notebook_path}`**")
            print(f"    - **{warning_count} issue{'s' if warning_count != 1 else ''}**")
            
            # Show breakdown by issue type if multiple types exist
            if len(issue_breakdown) > 1:
                for issue_type, count in sorted(issue_breakdown.items()):
                    print(f"      - {issue_type}: {count}")
            
            total_warnings += warning_count
        
        print(f"\n📊 Summary:")
        print(f"- **Total notebooks with issues**: {len(notebook_list)}")
        print(f"- **Total issues**: {total_warnings}")
        if notebook_list:
            highest_priority = notebook_list[0]
            print(f"- **Highest priority**: `{Path(highest_priority[0]).name}` with {highest_priority[1]} issues")
        
        # Show what types of issues can be fixed
        all_issue_types = list(issue_summary.keys())
        if all(issue_type in ['MissingIDFieldWarning', 'UnicodeEncodeError'] for issue_type in all_issue_types):
            print(f"- **All issues can be automatically fixed** with `make convert-fix`")
        else:
            fixable_types = [t for t in all_issue_types if t in ['MissingIDFieldWarning', 'UnicodeEncodeError']]
            if fixable_types:
                print(f"- **Fixable issue types**: {', '.join(fixable_types)} can be automatically fixed with `make convert-fix`")
    else:
        print("✅ No build warnings found")
    
    print(f"⏱️  Completed in {elapsed_total:.1f}s ({rate:.1f} notebooks/sec)")
    
    # If --fix argument provided, fix the issues
    if len(sys.argv) > 1 and sys.argv[1] == "--fix" and problematic_notebooks:
        print(f"\n🔧 Attempting to fix issues in {len(problematic_notebooks)} notebooks...")
        
        fixed_count = 0
        total_fixes = 0
        
        for nb_path in problematic_notebooks:
            issues = all_issues[nb_path]
            fix_result = fix_notebook_issues(nb_path, issues)
            
            if fix_result['success'] and fix_result['fixed']:
                rel_path = Path(fix_result['path']).relative_to(base_dir)
                print(f"✅ Fixed {rel_path}: {', '.join(fix_result['fixed'])}")
                fixed_count += 1
                total_fixes += len(fix_result['fixed'])
            elif fix_result['error']:
                rel_path = Path(fix_result['path']).relative_to(base_dir)
                print(f"❌ Error fixing {rel_path}: {fix_result['error']}")
        
        print(f"\n🎉 Successfully applied {total_fixes} fixes to {fixed_count} notebooks")
        if fixed_count < len(problematic_notebooks):
            print(f"ℹ️  {len(problematic_notebooks) - fixed_count} notebooks had issues that couldn't be automatically fixed")

if __name__ == "__main__":
    main()