module Capstone
  COURSES = %w[CSA CSP CSH CSSE].freeze
  LINKS = {
    "frontend" => "Frontend repository",
    "backend" => "Backend repository",
    "repository" => "Project repository",
    "demo" => "Live demo"
  }.freeze

  def self.catalog(site)
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

    documents.sort_by { |project| [-project["school_year"].to_i, project["title"].downcase] }
  end

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

  class Generator < Jekyll::Generator
    safe true
    priority :lowest

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
