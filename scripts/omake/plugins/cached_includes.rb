# Loaded only by ./omake via scripts/omake/jekyll_config.yml.
# Renders each include listed in `omake_cached_includes` once per build and
# reuses the output, instead of re-rendering it on every page.

module Omake
  module CachedIncludes
    @cache = {}

    class << self
      attr_reader :cache
    end

    def render(context)
      site = context.registers[:site]
      file = render_variable(context) || @file
      cacheable = site.config.fetch("omake_cached_includes", [])
      # Parameterized includes can render differently per call, so never cache them.
      return super unless @params.nil? && cacheable.include?(file)

      path = locate_include_file(context, file, site.safe)
      # Keep the dependency so `jekyll build --incremental` still notices header edits.
      add_include_to_dependency(site, path, context)
      CachedIncludes.cache[path] ||= super
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do
  Omake::CachedIncludes.cache.clear
end

Jekyll::Tags::IncludeTag.prepend(Omake::CachedIncludes)
