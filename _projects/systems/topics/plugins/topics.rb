require "json"
require "cgi"

module Topics
  def self.categories(document)
    values = document.data["categories"]
    return [] if values.nil?

    values = values.split if values.is_a?(String)
    unless values.is_a?(Array) && values.all? { |value| value.is_a?(String) && !value.strip.empty? }
      raise Jekyll::Errors::FatalException, "#{document.path}: categories must contain non-empty names"
    end
    values.map(&:strip).uniq { |value| value.downcase }
  end

  def self.view_url(url)
    suffix = url.end_with?("/") || !File.extname(url).empty? ? "" : "/"
    "/topics/view#{url}#{suffix}"
  end

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

  class Generator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      primary = site.data["topics_primary"]
      unless primary.is_a?(Array) && primary.all? { |name| name.is_a?(String) && !name.strip.empty? } &&
             primary.map { |name| name.strip.downcase }.uniq.size == primary.size
        raise Jekyll::Errors::FatalException, "_data/topics_primary.yml must be a list of unique, non-empty category names"
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
        names.each { |name| labels[name.downcase] ||= name }
        {
          "title" => document.data["title"].to_s,
          "description" => document.data["description"].to_s,
          "categories" => names.map(&:downcase),
          "labels" => names,
          "path" => document.relative_path,
          "url" => document.url,
          "viewUrl" => Topics.view_url(document.url),
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
      site.pages << Topics.page(site, "/assets/js/topics/data.json",
                         { "layout" => nil, "search_exclude" => true }, JSON.generate(entries))
      documents.each do |document|
        data = document.data.dup.merge(
          "topics_context" => true, "topics_original_url" => document.url,
          "search_exclude" => true, "chat" => false,
          "path" => document.relative_path
        )
        # Posts rely on layout defaults that PageWithoutAFile does not inherit.
        data["layout"] ||= "post" if document.is_a?(Jekyll::Document)
        content = document.content
        unless %w[post notebook].include?(data["layout"])
          data["topics_nav_in_content"] = true
          content = "{% include topics-document-nav.html %}\n" \
                    "<script type=\"module\" src=\"{{ '/assets/js/topics/document.js' | relative_url }}\"></script>\n\n" + content
        end
        view = Topics.page(site, Topics.view_url(document.url), data, content)
        # The viewing route changes, but conversion and relative includes use the source.
        view.process("document#{document.extname}")
        site.pages << view
      end
    end

    private

    # scripts/convert_docx.py names its output after a date and folder, and
    # keeps the Word file's own name in a comment.
    def converted_source(content)
      name = content[/<!-- Converted from: (.+?) -->/, 1]
      name ? { "source" => name } : {}
    end

    def searchable_content(content)
      text = content.gsub(%r{<(script|style)\b[^>]*>.*?</\1>}mi, " ")
                    .gsub(/\{%.*?%\}|\{\{.*?\}\}/m, " ")
                    .gsub(/<[^>]*>/, " ")
      CGI.unescapeHTML(text).gsub(/\s+/, " ").strip
    end
  end
end
