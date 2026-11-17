#!/usr/bin/env python3
"""
Multi-Course Compatibility Routes for Jekyll

Keep the original document and create small redirects at its former per-course
URLs. Never copy lesson bodies or modify author notebooks.

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
    """Create a redirect at a former course-specific output path."""
    # Generate new filename with appropriate extension
    original_name = original_path.stem
    file_extension = original_path.suffix
    course_filename = f"{original_name}_{course}{file_extension}"
    course_file_path = original_path.parent / course_filename
    
    original_permalink = front_matter.get('permalink')
    if not isinstance(original_permalink, str) or not original_permalink.startswith('/'):
        raise ValueError(f"{original_path}: shared documents need an explicit site-relative permalink")
    new_front_matter = {
        'layout': 'projects/courses/reader-redirect',
        'title': front_matter.get('title', ''),
        'permalink': f"{original_permalink.rstrip('/')}/{course}/",
        'reader_redirect_url': original_permalink,
        'reader_redirect_course': course,
        'search_exclude': True,
        'sitemap': False,
    }

    create_markdown_course_file(original_path, course_file_path, new_front_matter)
    # Older checkouts also converted generated *_<course>.ipynb notebooks.
    # Replace their published Markdown only; never edit those notebooks.
    if original_path.stem.endswith('_IPYNB_2_'):
        legacy_name = original_path.stem[:-len('_IPYNB_2_')] + f"_{course}_IPYNB_2_.md"
        legacy_path = original_path.with_name(legacy_name)
        if legacy_path.exists():
            legacy_front_matter, _ = parse_markdown_front_matter(legacy_path.read_text(encoding='utf-8'))
            if legacy_front_matter and legacy_front_matter.get('permalink') == new_front_matter['permalink']:
                create_markdown_course_file(original_path, legacy_path, new_front_matter)

    print(f"✓ Created compatibility route: {course_file_path}")
    return course_file_path

def create_markdown_course_file(original_path, course_file_path, new_front_matter):
    """Write a redirect's metadata, without lesson content or assignment fields."""
    yaml_content = yaml.dump(new_front_matter, default_flow_style=False, allow_unicode=True)
    course_content = f"---\n{yaml_content}---\n"
    
    if not course_file_path.exists() or course_file_path.read_text(encoding='utf-8') != course_content:
        course_file_path.write_text(course_content, encoding='utf-8')

def find_and_split_multi_course_files():
    """Publish legacy course URLs from Markdown outputs, leaving sources intact."""
    directories = []
    for dir_name in ['_posts']:
        dir_path = Path(dir_name)
        if dir_path.exists():
            directories.append(dir_path)
    
    if not directories:
        print("No _posts directory; build lesson outputs before creating compatibility routes")
        return
    
    processed_files = []
    failures = []
    
    # Find all markdown and notebook files
    for directory in directories:
        for file_pattern in ['*.md']:
            for file_path in directory.rglob(file_pattern):
                # Skip already split files
                if re.search(r'_(csp|csa|csse|csh)\.(md|ipynb)$', str(file_path)):
                    continue
                    
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    front_matter, body_content = parse_front_matter(content, file_path)
                    
                    if has_multiple_courses(front_matter):
                        print(f"\nProcessing multi-course file: {file_path}")
                        courses = front_matter['courses']
                        
                        # Replaces old generated wrappers in place; the author
                        # document and its original permalink stay untouched.
                        for course, course_data in courses.items():
                            create_course_specific_file(file_path, front_matter, body_content, course, course_data)
                        
                        processed_files.append(str(file_path))
                
                except Exception as e:
                    print(f"❌ Error processing {file_path}: {e}")
                    failures.append(str(file_path))

    if failures:
        raise RuntimeError(f"Could not create compatibility routes for: {', '.join(failures)}")
    
    if processed_files:
        print(f"\n✅ Successfully processed {len(processed_files)} multi-course files:")
        for file_path in processed_files:
            print(f"   - {file_path}")
    else:
        print("\n✅ No multi-course files found to split")

def clean_split_files():
    """Remove all generated course-specific and content files.

    Only _posts is cleaned here. The _notebooks/**/*_{csp,csa,csse,csh}.ipynb
    variants are left in place: the Makefile's NOTEBOOK_FILES/MARKDOWN_FILES
    are computed once at parse time (before `clean` runs), so if `clean-courses`
    deleted them mid-build, `convert` would still expect to produce posts from
    them and fail with "No rule to make target". Their published variants become
    compatibility redirects, so leaving the notebooks behind is safe.
    """
    directories = []
    for dir_name in ['_posts']:
        dir_path = Path(dir_name)
        if dir_path.exists():
            directories.append(dir_path)

    removed_files = []

    # Find and remove course-specific files and content files
    for directory in directories:
        for file_pattern in ['*.md', '*.ipynb']:
            for file_path in directory.rglob(file_pattern):
                if (re.search(r'_(csp|csa|csse|csh)\.(md|ipynb)$', str(file_path)) or
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
    print("Multi-Course Compatibility Routes")
    print("=" * 40)
    
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'clean':
        clean_split_files()
    else:
        find_and_split_multi_course_files()

if __name__ == '__main__':
    main()