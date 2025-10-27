#!/usr/bin/env python3

import sys
from pathlib import Path

print("Starting minimal test...")

try:
    # Test 1: Basic imports
    print("Testing basic imports...")
    import os, datetime, zipfile
    print("✅ Basic imports successful")
    
    # Test 2: Mammoth import
    print("Testing mammoth import...")
    import mammoth
    print("✅ Mammoth import successful")
    
    # Test 3: FrontMatterManager import
    print("Testing FrontMatterManager import...")
    sys.path.append('scripts')
    from frontmatter_manager import FrontMatterManager
    print("✅ FrontMatterManager import successful")
    
    # Test 4: FrontMatterManager initialization
    print("Testing FrontMatterManager initialization...")
    fm = FrontMatterManager("_docx")
    print("✅ FrontMatterManager initialization successful")
    
    # Test 5: DocxConverter import
    print("Testing DocxConverter import...")
    from convert_docx import DocxConverter
    print("✅ DocxConverter import successful")
    
    print("All tests passed!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()