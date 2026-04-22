source "https://rubygems.org"

# ============================================================================
# Ruby Standard Library Backports
# ============================================================================
# These gems provide Ruby standard library functionality that was removed or
# reorganized in Ruby 3.0+. Required for compatibility with Jekyll and other
# dependencies that may depend on these features.
#
# See: https://ruby-doc.org/stdlib-3.1.0/
gem "csv"
gem "bigdecimal"
gem "base64"

# ============================================================================
# Jekyll Core & Plugins
# ============================================================================
# Note: We do NOT use the `github-pages` metagem, which bundles Jekyll with
# pinned versions of all plugins and dependencies. Instead, we manage
# dependencies manually for the following reasons:
#
# 1. Ruby 4.0+ Compatibility
#    The `github-pages` gem uses older versions of Jekyll and Liquid that
#    have compatibility issues with Ruby 3.2+ (taint-tracking removal).
#    By pinning Jekyll 3.9.0 specifically and applying patches, we maintain
#    compatibility with modern Ruby versions.
#
# 2. Fine-Grained Control
#    Managing dependencies manually allows us to update Jekyll and plugins
#    independently without waiting for GitHub to release new versions of
#    the metagem.
#
# 3. Reduced Bloat
#    We include only the plugins and features we actually need, keeping
#    the bundle smaller and easier to maintain.
#
# See: https://www.ruby-lang.org/en/news/2022/12/25/ruby-3-2-0-released/#:~:text=Struct%3A%3APasswd-,Removed%20methods,-The%20following%20deprecated
#      https://github.com/github/pages-gem/releases
#
gem "jekyll", "~> 3.9.0"
gem "jekyll-theme-minima"
gem "jekyll-remote-theme"
gem "jekyll-include-cache"
gem "kramdown-parser-gfm"

# ============================================================================
# Web Server & JavaScript Runtime
# ============================================================================
# Required for local development and asset compilation.
#
gem "webrick", "~> 1.7"
gem "execjs", "~> 2.8"

# ============================================================================
# Ruby 3.2+ / Ruby 4.0+ Compatibility Patch
# ============================================================================
# Liquid 4.0.3 (required by Jekyll 3.9.0) uses Ruby's deprecated taint-tracking
# security model, which was removed in Ruby 3.2. This patch restores stub
# implementations to prevent runtime errors.
#
# See: ./liquid_ruby4_patch.rb
#      https://github.com/tzinfo/tzinfo/issues/145
#
require_relative "liquid_ruby4_patch"