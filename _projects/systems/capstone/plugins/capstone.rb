# Builds the Capstone catalog from document front matter during the Jekyll build.
#
# This module validates which documents can appear in the catalog and prepares
# data for the Liquid browser include. It does not handle button clicks or live
# search: js/browser.js and js/model.js apply course, year, and search selections
# in the visitor's browser after the page loads.
#
# Methods declared with `self.` belong to the module (like Java static methods).
# String-keyed Ruby hashes below represent named fields consumed by Liquid.
module Capstone
  # Allowed course codes. %w[...] creates an array of strings; freeze prevents edits.
  COURSES = %w[CSA CSP CSH CSSE].freeze

  # Supported front-matter link keys and their user-facing labels.
  LINKS = {
    "frontend" => "Frontend repository",
    "backend" => "Backend repository",
    "repository" => "Project repository",
    "demo" => "Live demo"
  }.freeze

  # Collects explicitly opted-in posts/pages, validates their metadata, and sorts
  # them by school year (newest first), then title (case-insensitive).
  #
  # Hidden, draft, and search-excluded documents are omitted. Each included
  # document must declare a capstone_project mapping with a supported course.
  # Its title, description, image, and team may fall back to document metadata.
  #
  # @param site [Jekyll::Site] Site whose posts and pages have already been read.
  # @return [Array<Hash{String => Object}>] One hash per project, with title,
  #   description, course, school_year, image, team, links, url, and source path.
  #   Team is an array of names; links is an array of label/url hashes. Missing
  #   description/year become empty strings; missing image remains nil.
  # @raise [Jekyll::Errors::FatalException] If project metadata is invalid or
  #   two included documents share a URL. Metadata errors identify the source.
  def self.catalog(site)
    # filter_map collects each block's result, omitting nil returned by `next`.
    documents = (site.posts.docs + site.pages).filter_map do |document|
      next if document.data["hide"] == true || document.data["lesson_status"] == "draft" ||
              document.data["search_exclude"] == true

      project = document.data["capstone_project"]
      next if project.nil? || project == false
      unless project.is_a?(Hash)
        raise Jekyll::Errors::FatalException, "#{document.relative_path}: capstone_project must be a mapping"
      end

      course = project["course"].to_s.upcase
      unless COURSES.include?(course)
        raise Jekyll::Errors::FatalException,
              "#{document.relative_path}: capstone_project.course must be one of #{COURSES.join(', ')}"
      end

      year = project["school_year"].to_s
      unless year.empty? || year.match?(/\A\d{4}-\d{4}\z/)
        raise Jekyll::Errors::FatalException,
              "#{document.relative_path}: capstone_project.school_year must use YYYY-YYYY"
      end

      title = project["title"] || document.data["title"]
      unless title.is_a?(String) && !title.strip.empty?
        raise Jekyll::Errors::FatalException, "#{document.relative_path}: capstone project requires a title"
      end
      description = project["description"] || document.data["description"]
      unless description.nil? || description.is_a?(String)
        raise Jekyll::Errors::FatalException, "#{document.relative_path}: capstone project description must be text"
      end
      image = project["image"] || document.data["image"]
      image_path = image.is_a?(String) && image.start_with?("/") && !image.start_with?("//")
      image_url = image.is_a?(String) && image.match?(%r{\Ahttps?://}i)
      unless image.nil? || image_path || image_url
        raise Jekyll::Errors::FatalException, "#{document.relative_path}: capstone project image must be a site path or HTTP(S) URL"
      end

      {
        "title" => title.to_s.strip,
        "description" => description.to_s.strip,
        "course" => course,
        "school_year" => year,
        "image" => image,
        "team" => team(project["team"] || document.data["team"] || document.data["author"], document),
        "links" => links(project["links"], document),
        "url" => document.url,
        "path" => document.relative_path
      }
    end

    urls = documents.map { |project| project["url"] }
    duplicates = urls.tally.select { |_url, count| count > 1 }.keys
    unless duplicates.empty?
      raise Jekyll::Errors::FatalException, "Capstone projects must have unique URLs: #{duplicates.join(', ')}"
    end

    # to_i reads the starting year; an unspecified year becomes 0 and sorts last.
    documents.sort_by { |project| [-project["school_year"].to_i, project["title"].downcase] }
  end

  # Normalizes optional team metadata into trimmed, non-empty member names.
  #
  # @param value [Array<String>, String, nil] Names as a list, comma-separated
  #   text, or no value. A list entry is kept as one name, even if it has commas.
  # @param document [Jekyll::Document, Jekyll::Page] Source used in error messages.
  # @return [Array<String>] Member names in their original order, or an empty
  #   array when no names were provided.
  # @raise [Jekyll::Errors::FatalException] If value is neither text nor a list
  #   of strings.
  def self.team(value, document)
    return [] if value.nil?
    if value.is_a?(Array)
      unless value.all? { |member| member.is_a?(String) }
        raise Jekyll::Errors::FatalException, "#{document.relative_path}: capstone_project.team entries must be text"
      end
      return value.map(&:strip).reject(&:empty?)
    end
    return value.split(",").map(&:strip).reject(&:empty?) if value.is_a?(String)

    raise Jekyll::Errors::FatalException, "#{document.relative_path}: capstone_project.team must be a list or string"
  end

  # Converts optional repository/demo metadata into labeled links for the cards.
  #
  # @param value [Hash{String => String}, nil] Supported LINKS keys mapped to
  #   HTTP(S) URLs, or no value.
  # @param document [Jekyll::Document, Jekyll::Page] Source used in error messages.
  # @return [Array<Hash{String => String}>] Hashes with "label" and "url" keys,
  #   in mapping order; an empty array when no mapping was provided.
  # @raise [Jekyll::Errors::FatalException] If value is not a mapping, a key is
  #   unsupported, or a URL is not HTTP(S) text.
  def self.links(value, document)
    return [] if value.nil?
    unless value.is_a?(Hash)
      raise Jekyll::Errors::FatalException, "#{document.relative_path}: capstone_project.links must be a mapping"
    end

    value.filter_map do |key, url|
      label = LINKS[key.to_s]
      unless label && url.is_a?(String) && url.match?(%r{\Ahttps?://}i)
        raise Jekyll::Errors::FatalException,
              "#{document.relative_path}: capstone_project.links supports frontend, backend, repository, or demo HTTP(S) URLs"
      end
      { "label" => label, "url" => url.strip }
    end
  end

  # Jekyll integration: publishes catalog data and the available year choices.
  #
  # Jekyll instantiates and calls this generator during its build lifecycle.
  # Inheriting from Jekyll::Generator registers that integration.
  class Generator < Jekyll::Generator
    # Eligible to run in safe mode; run late, after higher-priority generators.
    safe true
    priority :lowest

    # Populates the data read by the Capstone browser's Liquid template.
    #
    # Project cards come from Capstone.catalog. Game cards are rendered by the
    # shared capstone-games.html include; this method only adds their declared
    # years to the selector. Games without a year do not add a selector option.
    #
    # @param site [Jekyll::Site] Site being generated.
    # @return [Array<String>] Assigned year choices; Jekyll ignores this return.
    # @note Mutates site.data["capstone_catalog"] with the project hashes and
    #   site.data["capstone_years"] with unique, non-empty years, newest first.
    # @raise [Jekyll::Errors::FatalException] If catalog validation fails.
    def generate(site)
      projects = Capstone.catalog(site)
      site.data["capstone_catalog"] = projects
      game_years = site.posts.docs.filter_map do |document|
        year = document.data["school_year"].to_s
        year if document.data["game_directory"] == true &&
                document.data["exclude_from_games"] != true && !year.empty?
      end
      site.data["capstone_years"] = (projects.map { |project| project["school_year"] } + game_years)
        .reject(&:empty?).uniq.sort.reverse
    end
  end
end
