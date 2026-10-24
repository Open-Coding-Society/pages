#!/usr/bin/env python3
"""Windows/WSL entry point for the Toolchain Trail setup agent."""
import sys

from linux_setup_agent import is_wsl, main


if __name__ == '__main__':
    if not is_wsl():
        print('Windows setup agent must run inside a WSL Ubuntu terminal. Open Ubuntu from Windows Terminal, cd to blueprints_pages, and run this command again.')
        sys.exit(2)
    sys.exit(main())
