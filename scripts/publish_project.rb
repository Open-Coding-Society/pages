require "json"
require "fileutils"
require "digest"
require "pathname"

module ProjectPublisher
  DESTINATIONS = %w[_includes _layouts _plugins _data _posts navigation assets _sass].freeze

  def self.files(project, workspace)
    manifest = File.join(project, "distribution.json")
    return [] unless File.file?(manifest)

    entries = JSON.parse(File.read(manifest)).fetch("files")
    raise "distribution.json files must be an array" unless entries.is_a?(Array)

    mappings = entries.flat_map do |entry|
      source = resolve(project, entry.fetch("source"))
      destination_path = entry.fetch("destination")
      unless DESTINATIONS.include?(destination_path.split("/").first)
        raise "Unsupported distribution destination: #{destination_path}"
      end
      destination = resolve(workspace, destination_path)
      raise "Missing project source: #{source}" unless File.exist?(source)

      sources = File.directory?(source) ? Dir.glob(File.join(source, "**", "*")).select { |file| File.file?(file) } : [source]
      sources.map do |file|
        raise "Project source escapes project: #{file}" unless File.realpath(file).start_with?(File.realpath(project) + "/")
        target = File.directory?(source) ? File.join(destination, Pathname.new(file).relative_path_from(Pathname.new(source)).to_s) : destination
        [file, target]
      end
    end
    duplicates = mappings.group_by(&:last).select { |_, values| values.size > 1 }
    raise "Duplicate distribution destinations: #{duplicates.keys.join(', ')}" unless duplicates.empty?

    mappings.sort
  end

  def self.resolve(root, relative)
    unless relative.is_a?(String) && !relative.empty? && !Pathname.new(relative).absolute? &&
           relative.split("/").none? { |part| part == ".." || part.empty? }
      raise "Invalid project distribution path: #{relative.inspect}"
    end
    resolved = File.expand_path(relative, root)
    raise "Distribution path escapes root: #{relative}" unless resolved.start_with?(File.expand_path(root) + "/")
    resolved
  end

  def self.run(action, project, workspace)
    cache = File.join(workspace, ".project-distribution-cache", "#{File.basename(project)}.json")
    previous = File.file?(cache) ? JSON.parse(File.read(cache)) : {}
    case action
    when "publish"
      mappings = files(project, workspace)
      mappings.each { |_, destination| validate_destination(workspace, destination) }
      current = mappings.to_h { |source, destination| [Pathname.new(destination).relative_path_from(Pathname.new(workspace)).to_s, Digest::SHA256.file(source).hexdigest] }
      Dir.glob(File.join(workspace, ".project-distribution-cache", "*.json")).each do |other_cache|
        next if other_cache == cache

        overlap = JSON.parse(File.read(other_cache)).keys & current.keys
        raise "Distribution destinations already owned by #{other_cache}: #{overlap.join(', ')}" unless overlap.empty?
      end
      remove_outputs(previous.reject { |path, _| current.key?(path) }, workspace)
      mappings.each do |source, destination|
        next if File.file?(destination) && File.binread(source) == File.binread(destination)

        FileUtils.mkdir_p(File.dirname(destination))
        FileUtils.cp(source, destination)
      end
      serialized = JSON.pretty_generate(current) + "\n"
      unless File.file?(cache) && File.read(cache) == serialized
        FileUtils.mkdir_p(File.dirname(cache))
        File.write(cache, serialized)
      end
    when "clean"
      remove_outputs(previous, workspace)
      FileUtils.rm_f(cache)
    when "fingerprint"
      digest = Digest::SHA256.new
      manifest = File.join(project, "distribution.json")
      digest << File.binread(manifest) if File.file?(manifest)
      files(project, workspace).each { |source, destination| digest << destination << File.binread(source) }
      puts digest.hexdigest
    else
      raise "Unknown publication action: #{action}"
    end
  end

  def self.validate_destination(workspace, destination)
    ancestor = destination
    loop do
      raise "Symlink distribution destinations are not supported: #{ancestor}" if File.symlink?(ancestor)
      break if ancestor == workspace

      ancestor = File.dirname(ancestor)
    end
  end

  def self.remove_outputs(outputs, workspace)
    outputs.each do |relative, checksum|
      destination = resolve(workspace, relative)
      validate_destination(workspace, destination)
      next unless File.exist?(destination)

      unless File.file?(destination) && Digest::SHA256.file(destination).hexdigest == checksum
        raise "Refusing to remove modified distribution output: #{destination}"
      end
    end
    outputs.each_key { |relative| FileUtils.rm_f(resolve(workspace, relative)) }
  end
end

if $PROGRAM_NAME == __FILE__
  begin
    action, project, workspace = ARGV
    raise "Usage: publish_project.rb publish|clean|fingerprint PROJECT WORKSPACE" unless action && project && workspace
    ProjectPublisher.run(action, File.expand_path(project), File.expand_path(workspace))
  rescue StandardError => error
    warn "Project publication failed: #{error.message}"
    exit 1
  end
end
