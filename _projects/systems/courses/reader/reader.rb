require "json"

# Canonical-document navigation. The author's title, permalink, courses and
# assignment fields remain the source of truth; lesson bodies are not copied.
module DocumentReader
  LAYOUTS = %w[post notebook].freeze

  # Registers reader metadata and the client-side navigation index during a
  # Jekyll build. Runs before Topics so legacy course copies are not cataloged.
  class Generator < Jekyll::Generator
    safe true
    priority :normal

    # @param site [Jekyll::Site] loaded documents, schedules and published layouts
    # @return [void]
    # @note Changes in-memory rendering metadata only, never authored sources.
    def generate(site)
      return unless File.file?(site.in_source_dir("_includes/projects/courses/reader/start.html"))

      # Old checkouts can contain both converted notebook variants and Markdown
      # wrappers for one legacy course URL. They are redirects, never lessons.
      originals = (site.posts.docs + site.pages).select { |document| document.data["courses"].is_a?(Hash) && document.data["courses"].size > 1 }
      originals.each do |original|
        original.data["courses"].each_key do |course|
          url = "#{original.url.sub(%r{/\z}, '')}/#{course}/"
          (site.posts.docs + site.pages).select { |document| document.url == url }.each do |legacy|
            legacy.data.replace(
              "title" => original.data["title"], "permalink" => url,
              "layout" => "projects/courses/reader-redirect",
              "reader_redirect_url" => original.url, "reader_redirect_course" => course,
              "search_exclude" => true, "sitemap" => false
            )
            legacy.content = ""
          end
        end
      end
      seen = {}
      site.posts.docs.reject! do |document|
        next false unless document.data["reader_redirect_url"]
        duplicate = seen[document.url]
        seen[document.url] = true
        duplicate
      end
      schedules = site.data.filter_map do |code, data|
        next unless data.is_a?(Hash) && data["course"].is_a?(Hash)
        sprints = data.filter_map do |key, sprint|
          next unless key.to_s.match?(/\ASprint\d+\z/) && sprint.is_a?(Hash)
          info = sprint["shared"] ? site.data.dig("cs", sprint["shared"]) : sprint
          {
            "id" => key, "title" => info.to_h["title"].to_s,
            "start" => sprint["start"], "end" => sprint["end"],
            "weeks" => sprint.filter_map do |week, details|
              [week.to_s, details["theme"]] if week.to_s.match?(/\A\d+\z/) && details.is_a?(Hash)
            end.to_h
          }
        end
        [code, { "title" => data["course"]["title"] || code.upcase, "sprints" => sprints }] unless sprints.empty?
      end.to_h

      # A course placement lists the document in that course's navigation, as the
      # week overview does; search_exclude and hide only keep it out of Topics.
      placed = lambda do |data|
        data["courses"].is_a?(Hash) && data["courses"].any? do |course, placement|
          schedules.key?(course) && placement.is_a?(Hash) && placement.key?("week")
        end
      end
      documents = (site.posts.docs + site.pages).select do |document|
        data = document.data
        layout_ok = LAYOUTS.include?(data["layout"]) ||
          (data["layout"] == "opencs" && (!Array(data["categories"]).empty? || placed.call(data)))
        listed = topics_listed?(data) && (data["courses"].is_a?(Hash) || !Array(data["categories"]).empty?)
        layout_ok && !data["player_page"] && !data["reader_redirect_url"] &&
          data["lesson_status"] != "draft" && (placed.call(data) || listed)
      end.uniq(&:url)
      entries = documents.map do |document|
        data = document.data
        courses = data["courses"] || {}
        unless courses.is_a?(Hash)
          raise Jekyll::Errors::FatalException, "#{document.path}: courses must be a mapping"
        end
        placements = courses.select { |course, placement| schedules.key?(course) && placement.is_a?(Hash) && placement.key?("week") }
        default = %w[csp csa csse csh].find { |course| placements.key?(course) } || placements.keys.first
        data["document_reader"] = { "courses" => placements, "default_course" => default }
        data["layout"] = "projects/courses/reader-reference" if data["layout"] == "opencs"
        categories = data["categories"].is_a?(String) ? data["categories"].split : Array(data["categories"])
        unless categories.all? { |category| category.is_a?(String) && !category.strip.empty? }
          raise Jekyll::Errors::FatalException, "#{document.path}: categories must contain non-empty names"
        end
        {
          "url" => document.url, "title" => data["title"].to_s,
          "description" => data["description"].to_s,
          "categories" => categories.map { |category| category.strip.downcase }.uniq,
          "courses" => placements, "assignment" => data["assignment"] == true,
          "topics" => topics_listed?(data)
        }
      end.sort_by { |entry| entry["title"].downcase }
      payload = {
        "documents" => entries, "courses" => schedules,
        "primary" => Array(site.data.dig("projects", "topics", "topics_primary")).map(&:downcase)
      }
      page = Jekyll::PageWithoutAFile.new(site, site.source, "assets/js/projects/courses/reader", "data.json")
      page.data = { "layout" => nil, "search_exclude" => true }
      page.content = JSON.generate(payload)
      site.pages << page
    end

    private

    # Hidden and search-excluded documents stay out of Topics and search.
    def topics_listed?(data)
      data["hide"] != true && data["search_exclude"] != true
    end
  end
end
