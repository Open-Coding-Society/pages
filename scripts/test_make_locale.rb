require "minitest/autorun"
require "open3"
require "shellwords"
require "tmpdir"

class MakeLocaleTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)

  def run_in_make(locale, script)
    Dir.mktmpdir("make-locale-") do |dir|
      probe = File.join(dir, "probe.rb")
      File.write(probe, script)
      makefile = <<~MAKE
        .DEFAULT_GOAL := check-build-locale
        .PHONY: check-build-locale
        check-build-locale:
        \t@bundle exec ruby #{Shellwords.escape(probe)}
      MAKE
      Open3.capture3(
        { "LC_ALL" => locale, "LANG" => "C", "LC_CTYPE" => "C" },
        "make", "--no-print-directory", "-s", "-f", "Makefile", "-f", "-",
        stdin_data: makefile, chdir: ROOT
      )
    end
  end

  def test_default_locale_compiles_utf8_sass_imports
    output, error, status = run_in_make(nil, <<~'RUBY')
      require "jekyll"
      require "tmpdir"
      Dir.mktmpdir("sass-locale-") do |dir|
        File.write(File.join(dir, "_palette.scss"), "// Priority \u2026\n.label { color: red; }\n")
        converter = Jekyll::Converters::Scss.new(
          "source" => dir, "sass" => { "sass_dir" => "." }
        )
        puts converter.convert('@import "palette";')
      end
    RUBY
    assert status.success?, error
    assert_includes output, ".label"
    assert_includes output, "color: red"
  end

  def test_explicit_locale_is_preserved
    output, error, status = run_in_make("C", 'puts ENV.fetch("LC_ALL")')
    assert status.success?, error
    assert_equal "C", output.strip
  end
end
