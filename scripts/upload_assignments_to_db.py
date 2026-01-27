import os
import re
import sys

import yaml


assignments_dir = "_posts"

if __name__ == "__main__":
    print(os.listdir(f"./{assignments_dir}"))

class Assignment:
    def __init__(self, file_path):
        self.file_path = file_path
        self.frontmatter = self.extract_frontmatter()
        self.permalink = self.frontmatter.get('permalink', None)

    def extract_frontmatter(self):
        with open(self.file_path, 'r') as f:
            content = f.read()
        
        if not content.startswith('---\n'):
            return {}
        
        end_match = re.search(r'\n---\n', content[4:])
        if not end_match:
            return {}
        
        frontmatter_content = content[4:end_match.start() + 4]
        try:
            frontmatter = yaml.safe_load(frontmatter_content)
            return frontmatter if isinstance(frontmatter, dict) else {}
        except yaml.YAMLError:
            return {}

file_paths = []

for root, dirs, files in os.walk(f"./{assignments_dir}"):
    for file in files:
        if file.endswith(".md"):
            full_path = os.path.join(root, file)
            print(f"Processing file: {full_path}")
            Assignment_obj = Assignment(full_path)
            print(f"Frontmatter: {Assignment_obj.frontmatter}")
            print(f"Permalink: {Assignment_obj.permalink}")
            file_paths.append(full_path)

# Once things are uploaded, audit the entries (make sure that the directories are matching the permalinks and all that)