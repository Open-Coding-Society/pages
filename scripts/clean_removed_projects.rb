require "fileutils"
require "json"
require "open3"
require "set"
require_relative "publish_project"

# Removes what the build published for projects whose source folder is gone from _projects/.
# A project's own `make clean` removes its outputs, but the root Makefile runs it only for the
# projects listed in _projects/.makeprojects. Without this, a deleted project's git-ignored posts
# keep building, and fail once a file they include is deleted too.
module RemovedProjectCleaner
  # The template Makefile publishes into one folder per project name under each of these.
  OUTPUT_ROOTS = %w[
    _posts/projects _includes/projects _notebooks/projects _sass/projects
    assets/js/projects assets/css/projects images/projects
  ].freeze
  # The template's index target copies index.md to _posts/projects/<date>-<project>.md.
  INDEX_POST = /\A\d{4}-\d{2}-\d{2}-(.+)\.md\z/
  CACHE_ROOT = ".project-distribution-cache"

  def self.run(workspace, out: $stdout)
    workspace = File.expand_path(workspace)
    unless git_checkout?(workspace)
      out.puts "⚠ Not a git checkout, so files left by deleted projects stay: #{workspace}"
      return
    end

    current = current_projects(workspace)
    caches = stale_caches(workspace, current)
    paths = stale_paths(workspace, current)
    return if caches.empty? && paths.empty?

    # With no source at all, every project would look deleted: a wrong folder or a broken checkout.
    if current.empty?
      out.puts "⚠ git lists no source under _projects/, so files left by deleted projects stay: #{workspace}"
      return
    end

    tracked = git_files(workspace).to_set
    owned = owned_outputs(workspace, current)
    out.puts "🧹 Removing files built by projects whose source is gone from _projects/:"
    caches.each do |cache|
      remove_cache(workspace, cache, tracked, owned).each { |line| out.puts "   #{line}" }
    end
    paths.each do |path|
      reason = keep_reason(path, tracked, owned)
      out.puts "   #{reason ? "Keeping #{path} (#{reason})" : remove_path(workspace, path)}"
    end
  end

  def self.git_checkout?(workspace)
    stdout, _, status = Open3.capture3("git", "-C", workspace, "rev-parse", "--is-inside-work-tree")
    status.success? && stdout.strip == "true"
  rescue Errno::ENOENT
    false
  end

  def self.git_files(workspace, *arguments)
    stdout, stderr, status = Open3.capture3("git", "-C", workspace, "ls-files", "-z", "--cached", *arguments)
    raise "git ls-files failed in #{workspace}: #{stderr.strip}" unless status.success?

    stdout.split("\0")
  end

  # Folder names that still hold source files, tracked or new ones git would add. Outputs are
  # named after the project folder: _projects/<category>/<project>/ or _projects/<project>/.
  def self.current_projects(workspace)
    git_files(workspace, "--others", "--exclude-standard", "--", "_projects").each_with_object(Set.new) do |file, names|
      folders = file.split("/")[1...-1]
      # Jupyter's autosaves are not sources; watch-projects skips them too.
      names.merge(folders.first(2)) unless folders.include?(".ipynb_checkpoints")
    end
  end

  # Outputs and generated Makefiles named after projects that have no source left.
  def self.stale_paths(workspace, current)
    folders = OUTPUT_ROOTS.flat_map do |root|
      children(workspace, root).reject { |name| current.include?(name) }
                               .map { |name| "#{root}/#{name}" }
                               .select { |path| File.directory?(File.join(workspace, path)) }
    end
    index_posts = children(workspace, "_posts/projects").select do |file|
      name = file[INDEX_POST, 1]
      name && File.file?(File.join(workspace, "_posts/projects", file)) && !index_of_current_project?(name, current)
    end
    makefiles = Dir.glob(%w[_projects/*/Makefile _projects/*/*/Makefile], base: workspace)
                   .reject { |makefile| current.include?(File.basename(File.dirname(makefile))) }
    (folders + index_posts.map { |file| "_posts/projects/#{file}" } + makefiles).sort
  end

  # An index post belongs to its whole project name, and the course splitter's copies of it add
  # a suffix: <date>-messages.md and <date>-messages_csp.md belong to messages, not to messages_v2.
  def self.index_of_current_project?(name, current)
    current.any? { |project| name == project || name.start_with?("#{project}_") }
  end

  def self.caches(workspace)
    Dir.glob("#{CACHE_ROOT}/*.json", base: workspace).sort
  end

  def self.stale_caches(workspace, current)
    caches(workspace).reject { |cache| current.include?(File.basename(cache, ".json")) }
  end

  # Published path => checksum, as publish_project.rb records it.
  def self.read_cache(workspace, cache)
    outputs = JSON.parse(File.read(File.join(workspace, cache)))
    raise "#{cache} is not a map of published files" unless outputs.is_a?(Hash)

    outputs
  rescue JSON::ParserError => error
    raise "#{cache} is not valid JSON: #{error.message}"
  end

  # Files that current projects' caches say they publish.
  def self.owned_outputs(workspace, current)
    caches(workspace).select { |cache| current.include?(File.basename(cache, ".json")) }
                     .flat_map { |cache| read_cache(workspace, cache).keys }
                     .to_set
  end

  def self.keep_reason(path, tracked, owned)
    inside = ->(file) { file == path || file.start_with?("#{path}/") }
    return "tracked by git" if tracked.any?(&inside)

    "a current project publishes it" if owned.any?(&inside)
  end

  # Removes the outputs a deleted project's cache records, then the cache. ProjectPublisher
  # refuses, before removing anything, if a recorded output changed since it was published.
  def self.remove_cache(workspace, cache, tracked, owned)
    return ["Keeping #{cache} (tracked by git)"] if tracked.include?(cache)

    outputs = read_cache(workspace, cache)
    reasons = outputs.keys.to_h { |path| [path, keep_reason(path, tracked, owned)] }
    removable = outputs.reject { |path, _| reasons[path] }
    present = removable.keys.select { |path| File.exist?(File.join(workspace, path)) }
    ProjectPublisher.remove_outputs(removable, workspace)
    FileUtils.rm_f(File.join(workspace, cache))
    reasons.compact.map { |path, reason| "Keeping #{path} (#{reason})" } + present + [cache]
  end

  def self.remove_path(workspace, path)
    target = File.join(workspace, path)
    ProjectPublisher.validate_destination(workspace, target)
    label = File.directory?(target) ? "#{path}/" : path
    FileUtils.rm_rf(target)
    project_folder = File.dirname(target)
    Dir.rmdir(project_folder) if File.basename(path) == "Makefile" && Dir.empty?(project_folder)
    label
  end

  def self.children(workspace, folder)
    directory = File.join(workspace, folder)
    File.directory?(directory) ? Dir.children(directory).sort : []
  end
end

if $PROGRAM_NAME == __FILE__
  begin
    workspace = ARGV.first
    raise "Usage: clean_removed_projects.rb WORKSPACE" unless workspace

    RemovedProjectCleaner.run(workspace)
  rescue StandardError => error
    warn "Removed-project cleanup failed: #{error.message}"
    exit 1
  end
end
