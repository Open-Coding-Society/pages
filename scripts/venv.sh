#!/bin/bash

# Show the tools versions
python --version
bundle --version

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python -m venv venv
fi

# Set the virtual environment
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Install the required Ruby gems in the project directory
bundle config set --local path './.bundle'
bundle install