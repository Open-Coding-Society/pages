require "jekyll"
require "json"
require "tmpdir"
require "fileutils"
require "date"

ROOT = File.expand_path("../..", __dir__)

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

def curriculum_sources(group)
  Dir.glob(File.join(ROOT, "_projects/lessons/*/{notebooks,docs}/*.{ipynb,md}")).filter_map do |filename|
    text = File.read(filename)
    if filename.end_with?(".ipynb")
      cell = JSON.parse(text).fetch("cells").first.fetch("source")
      text = cell.is_a?(Array) ? cell.join : cell
    end
    metadata = text.split(/^---\s*$\n?/, 3)[1]
    next unless metadata&.match?(/^lesson_group:\s*["']?#{Regexp.escape(group)}["']?\s*$/)
    YAML.safe_load(metadata, permitted_classes: [Date, Time], aliases: true)
  end
end

def render_report(sections, lessons, group = "cs112")
  Dir.mktmpdir("curriculum-report-") do |source|
    includes = File.join(source, "_includes/projects/lessons")
    FileUtils.mkdir_p(includes)
    %w[csa-curriculum.html csa-curriculum-lesson.html curriculum-outline-report.html cs112-report.html cs113-report.html].each do |name|
      FileUtils.cp(File.join(ROOT, "_projects/lessons/_includes", name), includes)
    end
    FileUtils.mkdir_p(File.join(source, "_data"))
    File.write(File.join(source, "_data/#{group}_topics.json"), JSON.generate(sections))
    FileUtils.mkdir_p(File.join(source, "_posts"))
    lessons.each_with_index do |lesson, index|
      File.write(File.join(source, "_posts/2025-01-01-lesson-#{index}.md"),
                 YAML.dump(lesson.merge("layout" => nil)) + "---\n")
    end
    File.write(File.join(source, "index.html"),
               YAML.dump("curriculum_group" => group, "title" => "Curriculum report") +
               "---\n{% include projects/lessons/csa-curriculum.html %}")
    site = Jekyll::Site.new(Jekyll.configuration(
      "source" => source, "destination" => File.join(source, "_site"),
      "config" => [], "plugins" => [], "future" => true, "quiet" => true
    ))
    site.process
    File.read(File.join(source, "_site/index.html"))
  end
end
