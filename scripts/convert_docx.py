#!/usr/bin/env python3
"""
DOCX to Markdown Converter for Jekyll
Converts Word documents to Jekyll-compatible markdown with image extraction
"""

import os
import sys
import shutil
import zipfile
import datetime
from pathlib import Path
import xml.etree.ElementTree as ET
from urllib.parse import unquote
import re

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
    def __init__(self):
        self.base_dir = Path.cwd()
        self.docx_dir = self.base_dir / "_docx"
        self.posts_dir = self.base_dir / "_posts"
        self.images_dir = self.base_dir / "images" / "docx"
        
        # Create directories if they don't exist
        self.posts_dir.mkdir(exist_ok=True)
        self.images_dir.mkdir(parents=True, exist_ok=True)

    def extract_images_from_docx(self, docx_path, doc_name):
        """Extract images from DOCX file"""
        images_found = []
        
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
                        
                        # Create new filename with document prefix
                        image_name = f"{doc_name}_{original_name}"
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
        
        # Extract images first
        images = self.extract_images_from_docx(docx_path, doc_name)
        
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
        
        # Create Jekyll front matter with DOCX suffix for safe cleanup
        date_str = datetime.datetime.now().strftime("%Y-%m-%d")
        filename = f"{date_str}-{doc_name}_DOCX_.md"
        
        # Generate Jekyll-compatible front matter
        front_matter = f"""---
layout: post
title: "{doc_name.replace('-', ' ').replace('_', ' ').title()}"
date: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")} +0000
categories: [DOCX]
tags: [docx, converted]
author: Generated from DOCX
description: "Converted from {docx_path.name}"
permalink: /docx/{doc_name}/
image:
  path: /images/docx/
  alt: "{doc_name} document images"
---

<!-- Converted from: {docx_path.name} -->
<!-- Conversion date: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")} -->
<!-- Images extracted: {len(images)} -->

"""
        
        # Combine front matter with content
        full_content = front_matter + markdown_content
        
        # Write markdown file
        output_path = self.posts_dir / filename
        with open(output_path, 'w', encoding='utf-8') as md_file:
            md_file.write(full_content)
        
        print(f"  Created: {filename}")
        print(f"  Images: {len(images)} extracted")
        
        return {
            'docx_path': docx_path,
            'markdown_path': output_path,
            'images': images,
            'filename': filename
        }

    def convert_all_docx(self):
        """Convert all DOCX files in the _docx directory"""
        if not self.docx_dir.exists():
            print(f"❌ DOCX directory not found: {self.docx_dir}")
            return []
        
        docx_files = sorted(list(self.docx_dir.glob("*.docx")))
        
        if not docx_files:
            return []
        
        results = []
        skipped_count = 0
        converted_count = 0
        for docx_file in docx_files:
            # Skip temporary files (start with ~$)
            if docx_file.name.startswith('~$'):
                continue
            
            # Check if conversion is needed based on file timestamps
            doc_name = docx_file.stem
            date_str = datetime.datetime.now().strftime("%Y-%m-%d")
            expected_output = self.posts_dir / f"{date_str}-{doc_name}_DOCX_.md"
            
            if expected_output.exists():
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
    converter = DocxConverter()
    results = converter.convert_all_docx()
    
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