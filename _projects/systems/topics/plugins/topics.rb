require "json"
require "cgi"

# Builds Topics' category catalog and search data at Jekyll build time.
# Former reference-view routes redirect to the original document and context.
#
# JavaScript in js/browser.js and js/model.js handles live search and filter
# controls; Courses' reader preserves navigation context on original documents.
# This Ruby code prepares their data and HTML, not visitor interactions.
#
# Methods declared with `self.` belong to the module (like Java static methods).
module Topics
  # Reads category names while preserving display spelling and original order.
  #
  # @param document [Jekyll::Document, Jekyll::Page] Document with front matter.
  # @return [Array<String>] Trimmed, case-insensitively unique names. A string
  #   is split on whitespace; absent categories produce an empty array.
  # @raise [Jekyll::Errors::FatalException] If categories is not text or a list
  #   of non-empty strings. The error identifies the source document.
  def self.categories(document)
    values = document.data["categories"]
    return [] if values.nil?

    values = values.split if values.is_a?(String)
    unless values.is_a?(Array) && values.all? { |value| value.is_a?(String) && !value.strip.empty? }
      raise Jekyll::Errors::FatalException, "#{document.path}: categories must contain non-empty names"
    end
    values.map(&:strip).uniq { |value| value.downcase }
  end

  # Builds a legacy reference-view route for its compatibility redirect.
  #
  # @param url [String] Original URL beginning with "/", without query/fragment.
  # @return [String] URL prefixed with "/topics/view". Extensionless routes get
  #   a trailing slash; existing slashes and file extensions are preserved.
  # @example
  #   Topics.view_url("/java/loops") # => "/topics/view/java/loops/"
  def self.view_url(url)
    suffix = url.end_with?("/") || !File.extname(url).empty? ? "" : "/"
    "/topics/view#{url}#{suffix}"
  end

  # Creates an in-memory Jekyll page without writing a source file to disk.
  #
  # Slash-terminated routes use index.html; file routes retain their filename.
  # The caller must append the returned page to site.pages for it to be built.
  #
  # @param site [Jekyll::Site] Site that will own the generated page.
  # @param url [String] Site-relative output route, beginning with "/".
  # @param data [Hash{String => Object}] Page metadata, such as layout/context.
  # @param content [String] Page body, rendered later by Jekyll.
  # @return [Jekyll::PageWithoutAFile] Page with content and an explicit permalink
  #   overriding any permalink supplied in data. The input hash is not modified.
  def self.page(site, url, data, content)
    directory, name = if url.end_with?("/")
                        [url.sub(%r{\A/}, ""), "index.html"]
                      else
                        [File.dirname(url).sub(%r{\A/}, ""), File.basename(url)]
                      end
    result = Jekyll::PageWithoutAFile.new(site, site.source, directory, name)
    result.data = data.merge("permalink" => url)
    result.content = content
    result
  end

  # Jekyll integration that discovers documents and adds compatibility routes.
  #
  # Jekyll instantiates this subclass and calls generate during its build.
  class Generator < Jekyll::Generator
    # Eligible to run in safe mode; run after higher-priority page generators.
    safe true
    priority :lowest

    # Publishes category data, a JSON search catalog, and legacy redirects.
    #
    # Includes categorized posts/pages, excluding hidden, draft, search-excluded,
    # and generated course-player pages. Duplicate original URLs keep the first
    # document; results sort by title without regard to case. Course weeks are
    # display metadata only, never criteria for category membership.
    #
    # @param site [Jekyll::Site] Site whose documents and project YAML are loaded.
    # @return [Array<Jekyll::Document, Jekyll::Page>] Discovered source documents;
    #   this is Ruby's implicit final-expression return, ignored by Jekyll.
    # @note Mutates site.data with topics_catalog and the category mappings:
    #   topics_categories, topics_primary_categories, topics_secondary_categories.
    #   Catalog entries include title, description, category keys/display labels,
    #   source path, original/view URLs, searchable text, weeks, and an optional
    #   converted source filename. Adds site.pages for the JSON catalog and each
    #   legacy redirect; no duplicate lesson bodies are generated.
    # @raise [Jekyll::Errors::FatalException] If primary-topic YAML or a document's
    #   category metadata is invalid.
    def generate(site)
      # dig follows nested hash keys: YAML folders become site.data namespaces.
      primary = site.data.dig("projects", "topics", "topics_primary")
      unless primary.is_a?(Array) && primary.all? { |name| name.is_a?(String) && !name.strip.empty? } &&
             primary.map { |name| name.strip.downcase }.uniq.size == primary.size
        raise Jekyll::Errors::FatalException, "_data/projects/topics/topics_primary.yml must be a list of unique, non-empty category names"
      end
      primary = primary.map(&:strip)
      documents = (site.posts.docs + site.pages).select do |document|
        !Topics.categories(document).empty? && document.data["hide"] != true &&
          document.data["lesson_status"] != "draft" && document.data["search_exclude"] != true &&
          !document.data["player_page"]
      end
      documents = documents.uniq(&:url).sort_by { |document| document.data["title"].to_s.downcase }
      labels = {}
      entries = documents.map do |document|
        names = Topics.categories(document)
        # ||= keeps the first display spelling seen for each lowercase key.
        names.each { |name| labels[name.downcase] ||= name }
        {
          "title" => document.data["title"].to_s,
          "description" => document.data["description"].to_s,
          "categories" => names.map(&:downcase),
          "labels" => names,
          "path" => document.relative_path,
          "url" => document.url,
          "viewUrl" => "#{document.url}?context=topics",
          "content" => searchable_content(document.content),
          "weeks" => (document.data["courses"] || {}).to_h.filter_map do |course, value|
            "#{course.upcase} week #{value['week']}" if value.is_a?(Hash) && value["week"]
          end
        }.merge(converted_source(document.content))
      end
      site.data["topics_catalog"] = entries
      site.data["topics_categories"] = labels.sort.to_h
      site.data["topics_primary_categories"] = primary.map { |name| [name.downcase, name] }.to_h
      site.data["topics_secondary_categories"] = labels.reject { |key, _| primary.any? { |name| name.downcase == key } }.sort.to_h
      site.pages << Topics.page(site, "/assets/js/projects/topics/data.json",
                         { "layout" => nil, "search_exclude" => true }, JSON.generate(entries))
      documents.each do |document|
        data = {
          "layout" => "projects/courses/reader-redirect", "title" => document.data["title"],
          "reader_redirect_url" => document.url, "search_exclude" => true, "sitemap" => false
        }
        view = Topics.page(site, Topics.view_url(document.url), data, "")
        site.pages << view
        # Older catalogs also indexed each course-specific copy of shared
        # lessons. Keep those reference links without re-indexing the copies.
        courses = document.data["courses"]
        if courses.is_a?(Hash) && courses.size > 1
          courses.each_key do |course|
            legacy = "#{document.url.sub(%r{/\z}, '')}/#{course}/"
            site.pages << Topics.page(site, Topics.view_url(legacy), data, "")
          end
        end
      end
    end

    private

    # Extracts the original Word filename recorded by scripts/convert_docx.py.
    # Converted Markdown filenames use a date/folder, not the Word file's name.
    #
    # @param content [String] Source body, possibly containing a conversion comment.
    # @return [Hash{String => String}] A "source" filename entry, or an empty hash
    #   when the comment is absent; merged into the search catalog entry.
    def converted_source(content)
      name = content[/<!-- Converted from: (.+?) -->/, 1]
      name ? { "source" => name } : {}
    end

    # Produces plain text for search without executing Liquid or rendering HTML.
    #
    # Removes script/style blocks, Liquid tags/expressions, and HTML tags, then
    # decodes HTML entities and collapses whitespace. This is search extraction,
    # not an HTML sanitizer; browser highlights are built separately as text.
    #
    # @param content [String] Original document body before Jekyll rendering.
    # @return [String] Trimmed, single-spaced searchable text.
    def searchable_content(content)
      text = content.gsub(%r{<(script|style)\b[^>]*>.*?</\1>}mi, " ")
                    .gsub(/\{%.*?%\}|\{\{.*?\}\}/m, " ")
                    .gsub(/<[^>]*>/, " ")
      CGI.unescapeHTML(text).gsub(/\s+/, " ").strip
    end
  end
end
