#!/usr/bin/env python3
"""
Front Matter Management for Content Conversion
Handles intelligent front matter generation with Jekyll-native YAML configuration
"""

import os
from pathlib import Path
import datetime
import yaml
import re

class FrontMatterManager:
    def __init__(self, source_dir):
        """
        Initialize FrontMatterManager
        
        Args:
            source_dir: Path to source directory (e.g., _docx, _notebooks, _md)
        """
        self.source_dir = Path(source_dir)
        self.config_cache = {}
        self.config_timestamps = {}  # Track file modification times
        
    def load_directory_config(self, directory_path):
        """Load Jekyll-style YAML configuration for a specific directory"""
        # Check if cached config is still valid
        cache_key = str(directory_path)
        
        # Collect all config files that could affect this directory
        config_files = []
        current = directory_path
        while current != current.parent and current.parts:
            if '_docx' in current.parts:  # Only look within _docx
                config_file = current / "_config.yml"
                if config_file.exists():
                    config_files.append(config_file)
            current = current.parent
            if current == self.source_dir:
                break
        
        # Check if any config file has been modified since last cache
        cache_valid = cache_key in self.config_cache
        if cache_valid:
            for config_file in config_files:
                file_mtime = config_file.stat().st_mtime
                cached_mtime = self.config_timestamps.get(str(config_file), 0)
                if file_mtime > cached_mtime:
                    cache_valid = False
                    break
        
        if cache_valid:
            return self.config_cache[cache_key]
            
        # Cache is invalid or doesn't exist, reload config
        config = {}
        
        # Update timestamps for all config files
        for config_file in config_files:
            self.config_timestamps[str(config_file)] = config_file.stat().st_mtime
        
        # Try to load _config.yml from current directory
        config_file = directory_path / "_config.yml"
        if config_file.exists():
            with open(config_file, 'r') as f:
                dir_config = yaml.safe_load(f) or {}
                config.update(dir_config)
        
        # Try to load from parent directories up to source_dir
        current = directory_path
        while current != self.source_dir and current != current.parent:
            parent_config = current.parent / "_config.yml"
            if parent_config.exists():
                with open(parent_config, 'r') as f:
                    parent_cfg = yaml.safe_load(f) or {}
                    # Merge parent config (parent values as defaults)
                    # Child configs override parent configs
                    for key, value in parent_cfg.items():
                        if key not in config:
                            config[key] = value
            current = current.parent
            
        self.config_cache[cache_key] = config
        return config
        
    def get_file_metadata(self, file_path, doc_name=None):
        """Get metadata configuration for a specific file"""
        file_path = Path(file_path)
        directory = file_path.parent
        
        config = self.load_directory_config(directory)
        
        # Use provided doc_name or extract from file
        if doc_name is None:
            doc_name = file_path.stem
            
        metadata = {}
        
        # Start with defaults section
        if 'defaults' in config:
            metadata.update(config['defaults'])
            
        # Apply directory-specific config (folder name)
        folder_name = directory.name
        if folder_name in config:
            metadata.update(config[folder_name])
            
        # Apply file-specific config
        if 'files' in config and doc_name in config['files']:
            metadata.update(config['files'][doc_name])
            
        return metadata
        
    def parse_existing_frontmatter(self, content):
        """Parse existing front matter from content"""
        if not content.startswith('---\n'):
            return None, content
            
        # Find the end of front matter
        end_match = re.search(r'\n---\n', content[4:])
        if not end_match:
            return None, content
            
        end_pos = end_match.start() + 4
        frontmatter_text = content[4:end_pos]
        remaining_content = content[end_pos + 5:]  # Skip past closing ---
        
        try:
            frontmatter = yaml.safe_load(frontmatter_text)
            return frontmatter, remaining_content
        except yaml.YAMLError:
            return None, content
            
    def should_preserve_frontmatter(self, file_path, content):
        """Check if we should preserve existing front matter"""
        file_path = Path(file_path)
        
        # For .md and .ipynb files, preserve existing front matter
        if file_path.suffix in ['.md', '.ipynb']:
            existing_fm, _ = self.parse_existing_frontmatter(content)
            return existing_fm is not None
            
        return False
        
    def generate_frontmatter(self, file_path, doc_name=None, file_date=None, 
                           images_count=0, existing_content=""):
        """
        Generate front matter for a file
        
        Args:
            file_path: Path to the source file
            doc_name: Document name (defaults to file stem)
            file_date: File creation/modification date
            images_count: Number of images extracted
            existing_content: Existing file content (to check for front matter)
        """
        file_path = Path(file_path)
        
        # Check if we should preserve existing front matter
        if self.should_preserve_frontmatter(file_path, existing_content):
            existing_fm, content = self.parse_existing_frontmatter(existing_content)
            return existing_fm, content
            
        # Generate new front matter
        if doc_name is None:
            doc_name = file_path.stem
            
        if file_date is None:
            file_date = datetime.datetime.now()
            
        # Get metadata from configuration
        metadata = self.get_file_metadata(file_path, doc_name)
        
        # Build front matter with smart defaults
        frontmatter = {
            'layout': metadata.get('layout', 'post'),
            'title': metadata.get('title', self._generate_title(doc_name)),
            'date': file_date.strftime("%Y-%m-%d %H:%M:%S +0000"),
            'categories': metadata.get('categories', ["Documents"]),
            'tags': metadata.get('tags', ["converted"]),
            'author': metadata.get('author', 'Generated Content'),
            'description': metadata.get('description', f'Converted from {file_path.name}'),
            'permalink': metadata.get('permalink', f'/{file_path.suffix[1:]}/{doc_name}/'),
        }
        
        # Add image metadata if images were extracted
        if images_count > 0:
            frontmatter['image'] = {
                'path': f'/images/{file_path.suffix[1:]}/',
                'alt': f'{doc_name} document images'
            }
            
        return frontmatter, existing_content
        
    def _generate_title(self, doc_name):
        """Generate a readable title from document name"""
        # Replace common separators with spaces
        title = doc_name.replace('-', ' ').replace('_', ' ')
        
        # Convert to title case
        title = title.title()
        
        # Handle common abbreviations
        abbreviations = ['WGU', 'SGM', 'AI', 'PDF', 'HTML', 'CSS', 'JS']
        for abbr in abbreviations:
            title = title.replace(abbr.title(), abbr)
            
        return title
        
    def format_frontmatter(self, frontmatter_dict):
        """Format front matter dictionary as YAML"""
        yaml_content = yaml.dump(frontmatter_dict, 
                                default_flow_style=False, 
                                allow_unicode=True,
                                sort_keys=False)
        
        return f"---\n{yaml_content}---\n\n"

# Example usage and testing
if __name__ == "__main__":
    # Test the front matter manager
    fm_manager = FrontMatterManager("_docx")
    
    # Example: Generate front matter for a DOCX file
    file_path = Path("_docx/D292/Plagiarism-WGU-SGM2-Task1-Ideation-Higher-Level-Education.docx")
    file_date = datetime.datetime(2025, 10, 18, 8, 24, 0)
    
    frontmatter, content = fm_manager.generate_frontmatter(
        file_path=file_path,
        file_date=file_date,
        images_count=0
    )
    
    formatted = fm_manager.format_frontmatter(frontmatter)
    print("Generated Front Matter:")
    print(formatted)