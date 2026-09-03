#!/bin/bash

# Theme Switch Script for Jekyll Site
# Usage: ./switch-theme.sh [minima|text|cayman]

THEME=${1:-minima}
CONFIG_FILE="_config.yml"
BACKUP_CONFIG="_config.backup.yml"
GEMFILE="Gemfile"
BACKUP_GEMFILE="Gemfile.backup"

# Create backup of current config and Gemfile
cp $CONFIG_FILE $BACKUP_CONFIG
cp $GEMFILE $BACKUP_GEMFILE

case $THEME in
  "minima")
    echo "Switching to Minima theme..."
    if [ -f "_config.minima.yml" ]; then
      cp _config.minima.yml $CONFIG_FILE
      echo "Copied _config.minima.yml to _config.yml"
    else
      echo "Error: _config.minima.yml not found!"
      exit 1
    fi
    if [ -f "Gemfile.minima" ]; then
      cp Gemfile.minima $GEMFILE
      echo "Copied Gemfile.minima to Gemfile"
    else
      echo "Error: Gemfile.minima not found!"
      exit 1
    fi
    ;;
  "text")
    echo "Switching to TeXt theme..."
    if [ -f "_config.text.yml" ]; then
      cp _config.text.yml $CONFIG_FILE
      echo "Copied _config.text.yml to _config.yml"
    else
      echo "Error: _config.text.yml not found!"
      exit 1
    fi
    if [ -f "Gemfile.text" ]; then
      cp Gemfile.text $GEMFILE
      echo "Copied Gemfile.text to Gemfile"
    else
      echo "Error: Gemfile.text not found!"
      exit 1
    fi
    ;;
  "cayman")
    echo "Switching to Cayman theme..."
    if [ -f "_config.cayman.yml" ]; then
      cp _config.cayman.yml $CONFIG_FILE
      echo "Copied _config.cayman.yml to _config.yml"
    else
      echo "Error: _config.cayman.yml not found!"
      exit 1
    fi
    if [ -f "Gemfile.cayman" ]; then
      cp Gemfile.cayman $GEMFILE
      echo "Copied Gemfile.cayman to Gemfile"
    else
      echo "Error: Gemfile.cayman not found!"
      exit 1
    fi
    ;;
  *)
    echo "Usage: $0 [minima|text|cayman]"
    echo "Available themes:"
    echo "  minima - Minimal, clean theme"
    echo "  text   - Feature-rich theme with cards and modern UI"
    echo "  cayman - Modern, project/landing theme"
    exit 1
    ;;
esac

echo "Theme switched to $THEME"
echo "Run 'make clean && make' to rebuild the site"
echo "Backup saved as $BACKUP_CONFIG and $BACKUP_GEMFILE"