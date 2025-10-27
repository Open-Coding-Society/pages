#!/usr/bin/env python3
"""
DOCX to Markdown Converter for Jekyll
Converts Word documents to Jekyll-compatible markdown with image extraction
Supports folder organization within _docx directory and intelligent front matter generation
"""

import os
import sys
import shutil
import zipfile
import datetime
import glob
import argparse
from pathlib import Path
import xml.etree.ElementTree as ET
from urllib.parse import unquote
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Import the FrontMatterManager
try:
    from frontmatter_manager import FrontMatterManager
except ImportError:
    try:
        # Try importing from the scripts directory
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from frontmatter_manager import FrontMatterManager
    except ImportError:
        print("❌ FrontMatterManager not found. Please ensure frontmatter_manager.py is in the scripts directory.")
        FrontMatterManager = None

try:
    import mammoth
    from PIL import Image
except ImportError:
    print("❌ Required packages not found.")
    print("Please install dependencies:")
    print("   pip install mammoth pillow python-docx")
    print("   or run: pip install -r requirements.txt")
    sys.exit(1)

class DocxConverter:
    def __init__(self, docx_dir="_docx", posts_dir="_posts", images_dir="images/docx"):
        """
        Initialize DocxConverter
        
        Args:
            docx_dir: Directory containing DOCX files (supports subdirectories)
            posts_dir: Jekyll posts directory  
            images_dir: Directory for extracted images
        """
        self.base_dir = Path.cwd()
        self.docx_dir = self.base_dir / docx_dir
        self.posts_dir = self.base_dir / posts_dir
        self.images_dir = self.base_dir / images_dir
        
        # Initialize FrontMatterManager
        if FrontMatterManager:
            try:
                self.fm_manager = FrontMatterManager(self.docx_dir)
                # print(f"  FrontMatterManager initialized for {self.docx_dir}")
            except Exception as e:
                print(f"  ⚠️ FrontMatterManager failed to initialize: {e}")
                self.fm_manager = None
        else:
            self.fm_manager = None
        
        # Create directories if they don't exist
        self.posts_dir.mkdir(exist_ok=True)
        self.images_dir.mkdir(parents=True, exist_ok=True)
    
    def get_relative_output_path(self, input_path):
        """
        Get the relative path for output file based on input path structure
        
        Args:
            input_path: Path to the input DOCX file
            
        Returns:
            Path: Relative path for the output markdown file
        """
        # Get path relative to docx_dir
        try:
            relative_path = Path(input_path).relative_to(self.docx_dir)
        except ValueError:
            # If not relative to docx_dir, just use the filename
            relative_path = Path(input_path).name
        
        # Change extension to .md
        output_relative_path = relative_path.with_suffix('.md')
        
        return output_relative_path
    
    def ensure_directory_exists(self, file_path):
        """Ensure the directory for a file path exists"""
        file_path.parent.mkdir(parents=True, exist_ok=True)

    def extract_images_from_docx(self, docx_path, doc_name, subfolder=""):
        """
        Extract images from DOCX file
        
        Args:
            docx_path: Path to the DOCX file
            doc_name: Base name for the document
            subfolder: Subfolder context for unique naming
        """
        images_found = []
        
        # Include subfolder in doc_name if present
        if subfolder:
            # Replace path separators with underscores for safe filenames
            folder_prefix = subfolder.replace(os.sep, "_").replace("/", "_")
            full_doc_name = f"{folder_prefix}_{doc_name}"
        else:
            full_doc_name = doc_name
        
        try:
            with zipfile.ZipFile(docx_path, 'r') as zip_ref:
                # List all files in the DOCX
                for file_info in zip_ref.filelist:
                    # Check for images in media directory (both word/media/ and media/)
                    if (file_info.filename.startswith('word/media/') or 
                        file_info.filename.startswith('media/')):
                        
                        # Skip directories
                        if file_info.filename.endswith('/'):
                            continue
                            
                        # Extract image
                        image_data = zip_ref.read(file_info.filename)
                        
                        # Get file extension
                        original_name = Path(file_info.filename).name
                        ext = Path(original_name).suffix.lower()
                        
                        # Verify it's actually an image file
                        image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.tif', '.webp'}
                        if ext not in image_extensions:
                            print(f"  Skipping non-image file: {original_name}")
                            continue
                        
                        # Create new filename with document prefix (including folder context)
                        image_name = f"{full_doc_name}_{original_name}"
                        image_path = self.images_dir / image_name
                        
                        # Write image file
                        with open(image_path, 'wb') as img_file:
                            img_file.write(image_data)
                        
                        # Verify the image was written correctly
                        if image_path.exists() and image_path.stat().st_size > 0:
                            images_found.append({
                                'original': original_name,
                                'new_name': image_name,
                                'path': image_path,
                                'relative_path': f"/images/docx/{image_name}",
                                'size': len(image_data)
                            })
                            
                            print(f"  Extracted: {image_name} ({len(image_data):,} bytes)")
                        else:
                            print(f"  ❌ Failed to write: {image_name}")
                        
        except Exception as e:
            print(f"  ⚠️ Warning: Could not extract images from {docx_path}: {e}")
            
        return images_found

    def clean_markdown(self, markdown_text):
        """Clean and format markdown text"""
        # Remove extra whitespace
        markdown_text = re.sub(r'\n\s*\n\s*\n', '\n\n', markdown_text)
        
        # Fix heading spacing
        markdown_text = re.sub(r'\n(#{1,6})', r'\n\n\1', markdown_text)
        markdown_text = re.sub(r'(#{1,6}.*?)\n([^\n#])', r'\1\n\n\2', markdown_text)
        
        # Clean up list formatting
        markdown_text = re.sub(r'\n(\*|\d+\.)', r'\n\n\1', markdown_text)
        
        # Remove excessive newlines at start and end
        markdown_text = markdown_text.strip()
        
        return markdown_text

    def extract_tables_from_docx(self, docx_path):
        """Simplified table handling - let mammoth handle table conversion"""
        # Tables are now handled directly by mammoth during conversion
        # This avoids complex custom table parsing that was causing issues
        return []



    def convert_docx_to_markdown(self, docx_path):
        """Convert a single DOCX file to markdown"""
        doc_name = docx_path.stem
        print(f"\nConverting: {docx_path.name}")
        
        # Get subfolder context for unique naming
        try:
            relative_to_docx = docx_path.relative_to(self.docx_dir)
            subfolder = str(relative_to_docx.parent) if relative_to_docx.parent != Path('.') else ""
        except ValueError:
            subfolder = ""
        
        # Extract images first (with subfolder context)
        images = self.extract_images_from_docx(docx_path, doc_name, subfolder)
        
        # Tables will be handled directly by mammoth conversion
        
        try:
            # Convert DOCX to markdown using mammoth
            with open(docx_path, "rb") as docx_file:
                # Create a counter for sequential image mapping
                image_counter = 0
                
                # Custom image converter to use our extracted images
                def convert_image(image):
                    nonlocal image_counter
                    
                    # Use sequential mapping if we have extracted images
                    if images and image_counter < len(images):
                        current_image = images[image_counter]
                        print(f"   🔗 Image {image_counter + 1}: {current_image['original']} -> {current_image['relative_path']}")
                        
                        image_counter += 1
                        return {
                            "src": current_image['relative_path'],
                            "alt": image.alt_text or current_image['original'].replace('.png', '').replace('.jpg', '').replace('image', 'Image ')
                        }
                    
                    # Try filename matching as backup
                    if hasattr(image, 'src') and image.src:
                        src_filename = Path(image.src).name
                        for img_info in images:
                            if img_info['original'] == src_filename:
                                print(f"    Filename match: {src_filename} -> {img_info['relative_path']}")
                                return {
                                    "src": img_info['relative_path'],
                                    "alt": image.alt_text or img_info['original']
                                }
                    
                    # If we still have images available, cycle through them
                    if images:
                        cycle_index = image_counter % len(images)
                        current_image = images[cycle_index]
                        image_counter += 1
                        print(f"    Cycling to image {cycle_index + 1}: {current_image['relative_path']}")
                        return {
                            "src": current_image['relative_path'],
                            "alt": image.alt_text or f"Document Image {cycle_index + 1}"
                        }
                    
                    # No images available - create placeholder
                    print(f"    ⚠️ No images available, using placeholder")
                    return {
                        "src": f"/images/docx/{doc_name}_placeholder.png",
                        "alt": image.alt_text or "Image not found"
                    }
                
                # Configure mammoth to convert to HTML first (better table handling)
                result = mammoth.convert_to_html(
                    docx_file,
                    convert_image=mammoth.images.img_element(convert_image)
                )
                
                # Convert HTML to markdown using markdownify for better table support
                try:
                    from markdownify import markdownify as md
                    markdown_content = md(result.value, heading_style="ATX")
                except ImportError:
                    print("  ⚠️ markdownify not available, falling back to direct conversion")
                    # Fallback to direct markdown conversion
                    result_md = mammoth.convert_to_markdown(
                        docx_file,
                        convert_image=mammoth.images.img_element(convert_image)
                    )
                    markdown_content = result_md.value
                
                if result.messages:
                    print(f"  Conversion messages: {len(result.messages)} items")
                    for msg in result.messages:
                        print(f"    {msg.message}")
                        
                # Count images in the converted content
                import re
                image_count = len(re.findall(r'!\[.*?\]\(.*?\)', markdown_content))
                print(f"  Images in markdown: {image_count}")
                
        except Exception as e:
            print(f"  ❌ Error converting {docx_path}: {e}")
            return None
        
        # Clean up the markdown
        markdown_content = self.clean_markdown(markdown_content)
        
        # Get relative output path (preserves folder structure)
        relative_output_path = self.get_relative_output_path(docx_path)
        
        # Get file creation time for more meaningful dates
        file_stat = docx_path.stat()
        # Use creation time (birth time) if available, otherwise use modification time
        try:
            creation_time = file_stat.st_birthtime  # macOS/BSD specific
        except AttributeError:
            creation_time = file_stat.st_mtime  # Fallback to modification time
        
        file_date = datetime.datetime.fromtimestamp(creation_time)
        date_str = file_date.strftime("%Y-%m-%d")
        date_time_str = file_date.strftime("%Y-%m-%d %H:%M:%S")
        
        # Create Jekyll front matter with DOCX suffix for safe cleanup
        filename = f"{date_str}-{doc_name}_DOCX_.md"
        
        # If in subfolder, create subfolder-aware filename
        if subfolder:
            folder_prefix = subfolder.replace(os.sep, "_").replace("/", "_")
            filename = f"{date_str}-{folder_prefix}_{doc_name}_DOCX_.md"
        
        # Determine final output path
        output_path = self.posts_dir / filename
        
        # Ensure the output directory exists
        self.ensure_directory_exists(output_path)
        
        # Generate front matter using FrontMatterManager
        if self.fm_manager:
            try:
                frontmatter_dict, _ = self.fm_manager.generate_frontmatter(
                    file_path=docx_path,
                    doc_name=doc_name,
                    file_date=file_date,
                    images_count=len(images),
                    existing_content=""  # DOCX files don't have existing front matter
                )
                
                # Format front matter manually instead of using YAML
                front_matter = f"""---
layout: {frontmatter_dict.get('layout', 'post')}
title: "{frontmatter_dict.get('title', doc_name)}"
date: {frontmatter_dict.get('date', date_time_str)}
categories: {frontmatter_dict.get('categories', ['DOCX'])}
tags: {frontmatter_dict.get('tags', ['docx', 'converted'])}
author: {frontmatter_dict.get('author', 'Generated from DOCX')}
description: "{frontmatter_dict.get('description', f'Converted from {docx_path.name}')}"
permalink: {frontmatter_dict.get('permalink', f'/docx/{doc_name}/')}
---

"""
                print(f"  Using enhanced front matter from config")
                
            except Exception as e:
                print(f"  ⚠️ Front matter generation failed: {e}")
                self.fm_manager = None  # Disable for subsequent files
        
        if not self.fm_manager:
            # Fallback to simple front matter
            front_matter = f"""---
layout: post
title: "{doc_name.replace('-', ' ').replace('_', ' ').title()}"
date: {date_time_str} +0000
categories: [DOCX]
tags: [docx, converted]
author: Generated from DOCX
description: "Converted from {docx_path.name}"
permalink: /docx/{doc_name}/
---

"""
            print(f"  Using fallback front matter")
        
        # Add conversion metadata as comments
        conversion_comments = f"""<!-- Converted from: {docx_path.name} -->
<!-- File creation date: {date_time_str} -->
<!-- Conversion date: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")} -->
<!-- Images extracted: {len(images)} -->

"""
        
        # Combine front matter with content
        full_content = front_matter + conversion_comments + markdown_content
        
        # Write markdown file
        with open(output_path, 'w', encoding='utf-8') as md_file:
            md_file.write(full_content)
        
        print(f"  Created: {filename}")
        if subfolder:
            print(f"  Subfolder: {subfolder}")
        print(f"  Images: {len(images)} extracted")
        
        return {
            'docx_path': docx_path,
            'markdown_path': output_path,
            'images': images,
            'filename': filename
        }

    def convert_all_docx(self, target_dir=None, force_regeneration=False):
        """Convert all DOCX files in the _docx directory (including subdirectories)
        
        Args:
            target_dir (str, optional): Specific subdirectory to target for conversion.
                                      If provided, only converts files in that directory.
            force_regeneration (bool, optional): If True, regenerate files even if they appear up-to-date.
                                               Used when config files change.
        """
        if not self.docx_dir.exists():
            print(f"❌ DOCX directory not found: {self.docx_dir}")
            return []
        
        # Use recursive glob to find all DOCX files
        if target_dir:
            # Convert relative path to absolute and verify it's within _docx
            target_path = self.docx_dir / target_dir
            if not target_path.exists():
                print(f"❌ Target directory not found: {target_path}")
                return []
            if not str(target_path).startswith(str(self.docx_dir)):
                print(f"❌ Target directory must be within {self.docx_dir}")
                return []
            
            print(f"Targeting directory: {target_path}")
            docx_files = sorted(list(target_path.glob("**/*.docx")))
        else:
            docx_files = sorted(list(self.docx_dir.glob("**/*.docx")))
        
        if not docx_files:
            search_location = target_path if target_dir else self.docx_dir
            print(f"No DOCX files found in {search_location} (including subdirectories)")
            return []
        
        search_location = target_path if target_dir else self.docx_dir
        #print(f"Found {len(docx_files)} DOCX file(s) in {search_location} (including subdirectories)")
        
        results = []
        skipped_count = 0
        converted_count = 0
        
        # Separate files that need conversion from those that can be skipped
        files_to_convert = []
        for docx_file in docx_files:
            # Skip temporary files (start with ~$)
            if docx_file.name.startswith('~$'):
                continue
                
            # Get subfolder context for filename generation
            try:
                relative_to_docx = docx_file.relative_to(self.docx_dir)
                subfolder = str(relative_to_docx.parent) if relative_to_docx.parent != Path('.') else ""
            except ValueError:
                subfolder = ""
            
            # Check if conversion is needed based on file timestamps
            doc_name = docx_file.stem
            
            # Get file creation time for consistent filename generation
            file_stat = docx_file.stat()
            try:
                creation_time = file_stat.st_birthtime  # macOS/BSD specific
            except AttributeError:
                creation_time = file_stat.st_mtime  # Fallback to modification time
            
            file_date = datetime.datetime.fromtimestamp(creation_time)
            date_str = file_date.strftime("%Y-%m-%d")
            
            # Generate expected filename with subfolder context
            if subfolder:
                folder_prefix = subfolder.replace(os.sep, "_").replace("/", "_")
                expected_filename = f"{date_str}-{folder_prefix}_{doc_name}_DOCX_.md"
            else:
                expected_filename = f"{date_str}-{doc_name}_DOCX_.md"
                
            expected_output = self.posts_dir / expected_filename
            
            if expected_output.exists() and not force_regeneration:
                docx_mtime = docx_file.stat().st_mtime
                output_mtime = expected_output.stat().st_mtime
                
                if docx_mtime <= output_mtime:
                    skipped_count += 1
                    # Still add to results for index page generation, but mark as skipped
                    results.append({
                        'docx_path': docx_file,
                        'markdown_path': expected_output,
                        'images': None,  # Mark as skipped with None
                        'filename': expected_output.name,
                        'skipped': True
                    })
                    continue
            
            files_to_convert.append(docx_file)
        
        # Convert files in parallel if there are multiple files
        if len(files_to_convert) > 1:
            print(f"Converting {len(files_to_convert)} files in parallel...")
            with ThreadPoolExecutor(max_workers=min(4, len(files_to_convert))) as executor:
                # Submit all conversion tasks
                future_to_file = {
                    executor.submit(self.convert_docx_to_markdown, docx_file): docx_file 
                    for docx_file in files_to_convert
                }
                
                # Collect results as they complete
                for future in as_completed(future_to_file):
                    docx_file = future_to_file[future]
                    try:
                        result = future.result()
                        if result:
                            results.append(result)
                            converted_count += 1
                            print(f"✅ Completed: {docx_file.name}")
                    except Exception as exc:
                        print(f"❌ Error converting {docx_file.name}: {exc}")
        else:
            # Single file or no files - use sequential processing
            for docx_file in files_to_convert:
                result = self.convert_docx_to_markdown(docx_file)
                if result:
                    results.append(result)
                    converted_count += 1
        
        return results

    def create_index_page(self, results):
        """Create an index page for all converted documents"""
        if not results:
            return
        
        index_content = f"""---
layout: page
title: "DOCX Documents"
permalink: /docx/
description: "Converted documents from DOCX files"
---

# DOCX Documents

This page contains documents converted from DOCX files.

*Last updated: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}*

## Available Documents

"""
        
        # Sort results by filename for consistent ordering
        sorted_results = sorted(results, key=lambda x: x['docx_path'].name)
        
        for result in sorted_results:
            doc_title = result['docx_path'].stem.replace('-', ' ').replace('_', ' ').title()
            doc_name = result['docx_path'].stem
            post_url = f"/docx/{doc_name}/"
            
            index_content += f"""
### [{doc_title}]({post_url})

- **Source**: `{result['docx_path'].name}`
- **Images**: {len(result.get('images') or [])} extracted
- **Generated**: {datetime.datetime.now().strftime("%Y-%m-%d")}

"""
        
        index_content += f"""
## Image Gallery

All extracted images are available in the [images/docx](/images/docx/) directory.

## Conversion Process

These documents were automatically converted from DOCX format using a two-step process:
- **mammoth** converts DOCX to HTML (better table handling)
- **markdownify** converts HTML to Markdown (with fallback to direct conversion)
- **PIL** for image processing and extraction
- Custom scripts for Jekyll integration and timestamp checking

---

*Note: Original DOCX files are maintained in the `_docx` directory and excluded from the published site.*
"""
        
        # Write index page
        index_path = self.base_dir / "docx-index.md"
        with open(index_path, 'w', encoding='utf-8') as index_file:
            index_file.write(index_content)

def main():
    parser = argparse.ArgumentParser(description='Convert DOCX files to Jekyll markdown')
    parser.add_argument('--target-dir', '-t', type=str, 
                       help='Specific subdirectory within _docx to target for conversion')
    parser.add_argument('--config-changed', '-c', type=str,
                       help='Config file that changed (automatically determines target directory)')
    
    args = parser.parse_args()
    
    target_dir = None
    force_regeneration = False
    
    if args.config_changed:
        # Extract directory from config file path
        config_path = Path(args.config_changed)
        if config_path.name == '_config.yml' and '_docx' in str(config_path):
            # Config file changed, force regeneration
            force_regeneration = True
            # Get the directory containing the config file, relative to _docx
            parts = config_path.parts
            try:
                docx_index = parts.index('_docx')
                if docx_index + 1 < len(parts) - 1:  # There's a subdirectory
                    target_dir = '/'.join(parts[docx_index + 1:-1])
                    print(f"Config file changed: {config_path}")
                    print(f"Targeting affected directory: {target_dir}")
            except ValueError:
                pass
    elif args.target_dir:
        target_dir = args.target_dir
    
    converter = DocxConverter()
    results = converter.convert_all_docx(target_dir, force_regeneration)
    
    # Only count files that were actually converted (not skipped)
    converted_files = [r for r in results if not r.get('skipped', False)]
    
    if converted_files:
        converter.create_index_page(results)
        print(f"Converted: {len(converted_files)} documents")
        print(f"Images: {sum(len(r.get('images', [])) for r in converted_files)} extracted")
    elif not results:
        # Only show this if no DOCX files exist at all
        if not converter.docx_dir.exists() or not list(converter.docx_dir.glob("*.docx")):
            print("No DOCX files found to convert")
    # Otherwise, all files were up-to-date, so stay completely silent

if __name__ == "__main__":
    main()