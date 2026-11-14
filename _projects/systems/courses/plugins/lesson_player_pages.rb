# Builds course overview pages, not lesson documents:
#
#   /<course>/sprint-<n>/      the sprint's intro: what it is about and its weeks
#   /<course>/week-<w>/        the week's intro: its learning goals and lessons
#   /<course>/blogs/           searchable catalog of this course's documents
#
# A course is a data file with a `course:` block and Sprint1, Sprint2, ... keys,
# like _data/csa.yml, so a new sprint or week gets its pages from the data alone.
# The pages are made in memory while the site builds; edit the course data or
# player-pages includes, not generated HTML. Week pages require a lesson in that
# course/week; sprint and Blogs pages do not.
#
# Each page carries generated `player_page` metadata. Blogs' post layout routes
# it through Courses' course-document-player.html and player-pages/<kind>.html.
# Course home pages are authored separately under Courses' navigation/.
#
# Courses still own classroom cadence. The canonical document reader
# (reader/reader.rb) handles individual lessons with Course or Topics navigation.
# A shared lesson has one original permalink and can belong to multiple courses;
# this generator creates their overview pages, never copies of the lesson body.
#
# Test: bundle exec ruby scripts/test_player_pages.rb
module LessonPlayerPages
  # Publishes course overview routes after canonical-document metadata is ready.
  class Generator < Jekyll::Generator
    safe true
    priority :low

    SPRINT_KEY = /\ASprint(\d+)\z/

    # @param site [Jekyll::Site] loaded course schedules and document placements
    # @return [void]
    # @note Appends generated overview pages to site.pages; source files are unchanged.
    def generate(site)
      site.data.each do |course, data|
        next unless course_data?(data)

        lesson_weeks = weeks_with_lessons(site, course)
        sprints(data).each do |number, sprint|
          weeks = week_range(course, number, sprint)
          site.pages << page(site, course, "sprint", number, nil, sprint_title(site, number, sprint))
          weeks.each do |week|
            next unless lesson_weeks.include?(week)

            site.pages << page(site, course, "week", number, week, week_title(sprint, week))
          end
        end
        site.pages << page(site, course, "blogs", nil, nil, "Blogs")
      end
    end

    private

    # Shared documents appear in each declared course without copied lessons.
    # to_i reads the week the way the sidebar's `| plus: 0` does.
    def weeks_with_lessons(site, course)
      (site.posts.docs + site.pages).filter_map do |doc|
        courses = doc.data["courses"]
        next unless courses.is_a?(Hash) && courses[course] && !doc.data["reader_redirect_url"]

        entry = courses[course]
        (entry.is_a?(Hash) ? entry["week"] : nil).to_i
      end.uniq
    end

    # Course files have a `course:` block and sprints; _data/cs.yml and the
    # infographic files do not.
    def course_data?(data)
      data.is_a?(Hash) && data["course"].is_a?(Hash) && data.keys.any? { |key| SPRINT_KEY.match?(key.to_s) }
    end

    # [[1, Sprint1 data], [2, Sprint2 data], ...] in sprint order.
    def sprints(data)
      data.map { |key, sprint| [key.to_s[SPRINT_KEY, 1], sprint] }
          .select { |number, sprint| number && sprint.is_a?(Hash) }
          .map { |number, sprint| [number.to_i, sprint] }
          .sort_by(&:first)
    end

    # The sidebar loops over the same start..end weeks, so a sprint without them
    # cannot be shown anywhere; say which one instead of building a broken page.
    def week_range(course, number, sprint)
      first = Integer(sprint["start"], exception: false)
      last = Integer(sprint["end"], exception: false)
      return (first..last) if first && last

      raise Jekyll::Errors::FatalException,
            "_data/#{course}.yml Sprint#{number} needs start and end week numbers to build its pages"
    end

    # A shared sprint keeps its title in _data/cs.yml, the way _layouts/sprint.html reads it.
    def sprint_title(site, number, sprint)
      info = sprint["shared"] ? site.data.dig("cs", sprint["shared"]) : sprint
      title = info.is_a?(Hash) ? info["title"].to_s.strip : ""
      title.empty? ? "Sprint #{number}" : "Sprint #{number}: #{title}"
    end

    def week_title(sprint, week)
      theme = sprint[week].is_a?(Hash) ? sprint[week]["theme"].to_s.strip : ""
      theme.empty? ? "Week #{week}" : "Week #{week}: #{theme}"
    end

    def page(site, course, kind, sprint, week, title)
      url = case kind
            when "sprint" then "/#{course}/sprint-#{sprint}/"
            when "week" then "/#{course}/week-#{week}/"
            when "blogs" then "/#{course}/blogs/"
            end

      Jekyll::PageWithoutAFile.new(site, site.source, url, "index.html").tap do |page|
        page.content = ""
        page.data.merge!(
          "layout" => "post",
          "title" => title,
          "permalink" => url,
          "player_page" => { "course" => course, "kind" => kind, "sprint" => sprint, "week" => week },
          "show_reading_time" => false,
          "search_exclude" => true
        )
      end
    end
  end
end
