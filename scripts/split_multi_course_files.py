#!/usr/bin/env python3
"""
Automated Multi-Course File Splitter for Jekyll

This script automatically detects markdown files with multiple course assignments
and splits them into separate course-specific files with unique permalinks.

Usage:
    python3 scripts/split_multi_course_files.py
"""

import os
import re
import yaml
import json
from pathlib import Path

def parse_front_matter(content, file_path):
    """Parse Jekyll front matter from markdown or notebook content."""
    if file_path.suffix == '.ipynb':
        return parse_notebook_front_matter(content)
    else:
        return parse_markdown_front_matter(content)

def parse_markdown_front_matter(content):
    """Parse Jekyll front matter from markdown content."""
    if not content.startswith('---'):
        return None, content
    
    # Find the end of front matter
    end_match = re.search(r'\n---\n', content[3:])
    if not end_match:
        return None, content
    
    front_matter_text = content[3:end_match.start() + 3]
    # The end_match.end() already includes the \n after ---, so we only need to add 3 for the original offset
    body_content = content[end_match.end() + 3:]
    
    try:
        front_matter = yaml.safe_load(front_matter_text)
        return front_matter, body_content
    except yaml.YAMLError as e:
        print(f"Error parsing YAML: {e}")
        return None, content

def parse_notebook_front_matter(content):
    """Parse Jekyll front matter from notebook content."""
    try:
        notebook = json.loads(content)
        if 'cells' not in notebook or len(notebook['cells']) == 0:
            return None, content
        
        # Check if first cell is raw and contains front matter
        first_cell = notebook['cells'][0]
        if first_cell.get('cell_type') != 'raw':
            return None, content
            
        # Join all source lines (notebook stores as array of strings)
        cell_source = ''.join(first_cell.get('source', []))
        if not cell_source.startswith('---'):
            return None, content
            
        # Find the end of front matter  
        end_match = re.search(r'\n---(\n|$)', cell_source[3:])
        if not end_match:
            # Try without newline after --- (some notebooks may not have trailing newline)
            if cell_source.endswith('---'):
                front_matter_text = cell_source[3:-3]
            else:
                return None, content
        else:
            front_matter_text = cell_source[3:end_match.start() + 3]
        
        try:
            front_matter = yaml.safe_load(front_matter_text)
            return front_matter, content  # Return full notebook content
        except yaml.YAMLError as e:
            print(f"Error parsing YAML: {e}")
            return None, content
            
    except json.JSONDecodeError as e:
        print(f"Error parsing notebook JSON: {e}")
        return None, content

def has_multiple_courses(front_matter):
    """Check if a file has multiple course assignments."""
    if not front_matter or 'courses' not in front_matter:
        return False
    
    courses = front_matter['courses']
    if isinstance(courses, dict):
        return len(courses) > 1
    return False

def create_course_specific_file(original_path, front_matter, body_content, course, course_data):
    """Create a course-specific file with modified front matter and include."""
    # Generate new filename with appropriate extension
    original_name = original_path.stem
    file_extension = original_path.suffix
    course_filename = f"{original_name}_{course}{file_extension}"
    course_file_path = original_path.parent / course_filename
    
    # Create new front matter for this course
    new_front_matter = front_matter.copy()
    new_front_matter['courses'] = {course: course_data}
    
    # Generate unique permalink
    if 'permalink' in new_front_matter:
        original_permalink = new_front_matter['permalink'].rstrip('/')
        new_front_matter['permalink'] = f"{original_permalink}/{course}/"
    
    if original_path.suffix == '.ipynb':
        create_notebook_course_file(original_path, course_file_path, new_front_matter, body_content)
    else:
        create_markdown_course_file(original_path, course_file_path, new_front_matter)
    
    print(f"✓ Created course-specific file: {course_file_path}")
    return course_file_path

def create_markdown_course_file(original_path, course_file_path, new_front_matter):
    """Create a markdown course-specific file."""
    yaml_content = yaml.dump(new_front_matter, default_flow_style=False, allow_unicode=True)
    content_filename = f"{original_path.stem}_content.md"
    
    course_content = f"""---
{yaml_content}---

{{% include_relative {content_filename} %}}"""
    
    with open(course_file_path, 'w', encoding='utf-8') as f:
        f.write(course_content)

def create_notebook_course_file(original_path, course_file_path, new_front_matter, notebook_content):
    """Create a notebook course-specific file."""
    try:
        notebook = json.loads(notebook_content)
        
        # Update front matter in first cell
        if notebook['cells'] and notebook['cells'][0].get('cell_type') == 'raw':
            yaml_content = yaml.dump(new_front_matter, default_flow_style=False, allow_unicode=True)
            new_front_matter_content = f"---\n{yaml_content}---\n"
            notebook['cells'][0]['source'] = [new_front_matter_content]
        
        # Write the modified notebook
        with open(course_file_path, 'w', encoding='utf-8') as f:
            json.dump(notebook, f, indent=2)
            
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Error creating notebook course file: {e}")

def create_content_only_file(original_path, body_content):
    """Create a content-only version for includes (without modifying original)."""
    # Only create content files for markdown (notebooks don't use includes)
    if original_path.suffix == '.md':
        content_filename = f"{original_path.stem}_content.md"
        content_file_path = original_path.parent / content_filename
        
        # Write content-only file
        with open(content_file_path, 'w', encoding='utf-8') as f:
            f.write(body_content)
        
        print(f"✓ Created content file: {content_file_path}")
        return content_file_path
    return None

def find_and_split_multi_course_files():
    """Find all markdown and notebook files with multiple courses and split them."""
    # Check both _posts and _notebooks directories
    directories = []
    for dir_name in ['_posts', '_notebooks']:
        dir_path = Path(dir_name)
        if dir_path.exists():
            directories.append(dir_path)
    
    if not directories:
        print("❌ Neither _posts nor _notebooks directory found")
        return
    
    processed_files = []
    
    # Find all markdown and notebook files
    for directory in directories:
        for file_pattern in ['*.md', '*.ipynb']:
            for file_path in directory.rglob(file_pattern):
                # Skip already split files
                if re.search(r'_(csp|csa|csse|cwgu)\.(md|ipynb)$', str(file_path)):
                    continue
                    
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    front_matter, body_content = parse_front_matter(content, file_path)
                    
                    if has_multiple_courses(front_matter):
                        print(f"\nProcessing multi-course file: {file_path}")
                        courses = front_matter['courses']
                        
                        # Create content-only file (for markdown includes only)
                        create_content_only_file(file_path, body_content)
                        
                        # Create course-specific files  
                        for course, course_data in courses.items():
                            create_course_specific_file(file_path, front_matter, body_content, course, course_data)
                        
                        processed_files.append(str(file_path))
                
                except Exception as e:
                    print(f"❌ Error processing {file_path}: {e}")
    
    if processed_files:
        print(f"\n✅ Successfully processed {len(processed_files)} multi-course files:")
        for file_path in processed_files:
            print(f"   - {file_path}")
    else:
        print("\n✅ No multi-course files found to split")

def clean_split_files():
    """Remove all generated course-specific and content files."""
    directories = []
    for dir_name in ['_posts', '_notebooks']:
        dir_path = Path(dir_name)
        if dir_path.exists():
            directories.append(dir_path)
    
    removed_files = []
    
    # Find and remove course-specific files and content files
    for directory in directories:
        for file_pattern in ['*.md', '*.ipynb']:
            for file_path in directory.rglob(file_pattern):
                if (re.search(r'_(csp|csa|csse|cwgu)\.(md|ipynb)$', str(file_path)) or 
                    re.search(r'_content\.md$', str(file_path))):
                    file_path.unlink()
                    removed_files.append(str(file_path))
    
    if removed_files:
        print(f"✅ Cleaned {len(removed_files)} generated files")
        for file_path in removed_files:
            print(f"   - {file_path}")
    else:
        print("✅ No generated files to clean")

def main():
    """Main function to run the multi-course file splitter."""
    print("Multi-Course File Splitter")
    print("=" * 40)
    
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'clean':
        clean_split_files()
    else:
        find_and_split_multi_course_files()

if __name__ == '__main__':
    main()