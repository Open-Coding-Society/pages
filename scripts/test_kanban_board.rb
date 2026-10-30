require "minitest/autorun"
require "fileutils"
require "jekyll"
require "json"
require "nokogiri"
require "open3"
require "tmpdir"

# _includes/ocs_kanban_board.html and ocs_kanban_board_data.html, rendered by
# Jekyll's own include tag with strict Liquid. Every board a page shows today
# renders byte for byte as it did before template=true and the data include;
# with template=true the include gives only the empty board that
# createKanbanSection (assets/js/kanban-board.js) copies.
class KanbanBoardIncludeTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)
  # Upstream main just before template=true and the data include.
  BEFORE = "ec788887e23801bef6ea23ec4886dd74daef18f6".freeze
  # The data today's boards read, loaded the way Jekyll loads _data.
  DATA = %w[
    kanban communication_system_infograph sfi_foundation ncsncf_infograph oak pnec_capstone toolchain-trail-capstone
  ].to_h { |name| [name, SafeYAML.load_file(File.join(ROOT, "_data/#{name}.yml"))] }.freeze

  # Today's boards, as their pages and includes write them.
  PAGES = {
    "Communication Systems, with its columns list" => <<~LIQUID,
      {% assign data = site.data.communication_system_infograph %}
      {% include ocs_kanban_board.html url=data.Board.url filter=data.Board.filter columns=data.Board.columns %}
    LIQUID
    "SFI, with its columns list" => <<~LIQUID,
      {% assign sfi_data = site.data.sfi_foundation %}
      {% include ocs_kanban_board.html url=sfi_data.Board.url filter=sfi_data.Board.filter columns=sfi_data.Board.columns %}
    LIQUID
    "NCSNCF, address and filter from its data" => <<~LIQUID,
      {% assign data = site.data.ncsncf_infograph %}
      {% include ocs_kanban_board.html url=data.board.url filter=data.board.filter %}
    LIQUID
    "OAK, an address alone" => <<~LIQUID,
      {% assign oak_data = site.data.oak %}
      {% include ocs_kanban_board.html url=oak_data.Board.url %}
    LIQUID
    "PNEC, a title from its data" => <<~LIQUID,
      {% assign pnec_data = site.data.pnec_capstone %}
      {% include ocs_kanban_board.html url=pnec_data.Board.url filter=pnec_data.Board.filter title=pnec_data.Board.title %}
    LIQUID
    "Toolchain Trail, a title of its own" => <<~LIQUID,
      {% assign data = site.data.toolchain-trail-capstone %}
      {% include ocs_kanban_board.html url=data.Board.url title="Toolchain Trail Kanban Board" %}
    LIQUID
    "admin and security, four boards on one page" => <<~LIQUID,
      {% include ocs_kanban_board.html url="https://github.com/orgs/CSA-Admin-OCS/projects/16" title="OCS in a Kit Kanban Board" %}
      {% include ocs_kanban_board.html url="https://github.com/orgs/CSA-Admin-OCS/projects/5" title="OCS Security Kanban Board" %}
      {% include ocs_kanban_board.html url="https://github.com/orgs/CSA-Admin-OCS/projects/1" title="OCS Admin Kanban Board" %}
      {% include ocs_kanban_board.html url="https://github.com/orgs/CSA-Admin-OCS/projects/7" title="Mentor Kanban Board" %}
    LIQUID
    "FOPS, two repositories' issues" => <<~LIQUID,
      {% include ocs_kanban_board.html url="https://github.com/rex0dex/fops-pages/issues" filter="Assignee" title="Website (fops-pages)" %}
      {% include ocs_kanban_board.html url="https://github.com/rex0dex/fops-flask/issues" filter="Assignee" title="Backend (fops-flask)" %}
    LIQUID
    "PVO, a title with a dash" => <<~LIQUID,
      {% include ocs_kanban_board.html url="https://github.com/pranavsaiorg/cspteamportfolio/issues" filter="Assignee" title="PVO 2026–27 Team Kanban Board" %}
    LIQUID
    "Doing Exceptional Deeds, options over several lines" => <<~LIQUID,
      {% include ocs_kanban_board.html
         url="https://github.com/orgs/ComputerScienceDudes/projects/7"
         title="ComputerScienceDudes Kanban Board"
      %}
    LIQUID
  }.freeze

  BOARD = '{% include ocs_kanban_board.html url="https://github.com/orgs/UGRC-CSA/projects/1" %}'.freeze

  def current
    %w[ocs_kanban_board.html ocs_kanban_board_data.html].to_h { |name| [name, File.read(File.join(ROOT, "_includes", name))] }
  end

  def before
    text, _, status = Open3.capture3("git", "-C", ROOT, "show", "#{BEFORE}:_includes/ocs_kanban_board.html")
    skip "#{BEFORE[0, 9]} isn't in this clone, so there is no earlier include to compare with" unless status.success?
    { "ocs_kanban_board.html" => text }
  end

  # A page's Liquid with these includes, rendered the way Jekyll renders a page.
  def render(includes, markup, data: DATA)
    Dir.mktmpdir("kanban-board-") do |source|
      FileUtils.mkdir_p(File.join(source, "_includes"))
      includes.each { |name, text| File.write(File.join(source, "_includes", name), text) }
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => source, "destination" => File.join(source, "_site"), "config" => [], "plugins_dir" => [],
        "quiet" => true, "baseurl" => "/preview", "liquid" => { "error_mode" => "strict" }
      ))
      site.data = data
      page = { "url" => "/capstone/" }
      payload = site.site_payload
      payload["page"] = page
      Liquid::Template.parse(markup, error_mode: :strict).render!(payload, registers: { site: site, page: page })
    end
  end

  def count(html, text)
    html.scan(text).size
  end

  def test_todays_boards_render_byte_for_byte_as_before
    old = before
    PAGES.each do |name, markup|
      html = render(current, markup)
      assert_equal render(old, markup), html, name
      assert_equal markup.scan("{% include").size, count(html, "data-ocs-kanban "), name
      assert_equal 1, count(html, 'id="ocs-kanban-defaults"'), name
      assert_equal 1, count(html, "/preview/assets/js/kanban-board.js"), name
    end
  end

  def test_template_is_the_empty_board_alone_whatever_the_other_options
    empty = render(current, "{% include ocs_kanban_board.html %}")[%r{<section.*?</section>}m]
    with_options = '{% include ocs_kanban_board.html template=true url="https://github.com/orgs/UGRC-CSA/projects/1" ' \
                   'filter="Team" title="Ours" columns=site.data.communication_system_infograph.Board.columns %}'
    [render(current, "{% include ocs_kanban_board.html template=true %}"), render(current, with_options)].each do |html|
      assert_equal %(<template data-ocs-template="kanban">#{empty}</template>), html.strip
    end

    board = Nokogiri::HTML.fragment(empty).at_css("section[data-ocs-kanban]")
    assert_equal "", board["data-board-url"]
    assert_equal "", board["data-filter"]
    refute board.key?("data-title-fixed")
    assert_equal DATA["kanban"]["text"]["title"], board["aria-label"]
    # What createKanbanSection fills in.
    assert_equal DATA["kanban"]["text"]["title"], board.at_css('[data-hook="title"]').text
    %w[meta status mount].each { |hook| assert board.at_css(%([data-hook="#{hook}"])), hook }
    assert_equal "", board.at_css("a.ocs__btn")["href"]
    assert_nil board.at_css("script")
  end

  def test_template_takes_neither_once_flag
    html = render(current, "{% include ocs_kanban_board.html template=true %}#{BOARD}")
    assert_equal 1, count(html, 'id="ocs-kanban-defaults"')
    assert_equal 1, count(html, "/preview/assets/js/kanban-board.js")
  end

  def test_data_include_puts_the_defaults_on_the_page_once
    alone = render(current, "{% include ocs_kanban_board_data.html %}{% include ocs_kanban_board_data.html %}")
    scripts = Nokogiri::HTML.fragment(alone).css("script")
    assert_equal ["ocs-kanban-defaults"], scripts.map { |script| script["id"] }
    assert_equal JSON.parse(JSON.generate(DATA["kanban"])), JSON.parse(scripts.first.text)

    ["{% include ocs_kanban_board_data.html %}#{BOARD}", "#{BOARD}{% include ocs_kanban_board_data.html %}"].each do |markup|
      html = render(current, markup)
      assert_equal 1, count(html, 'id="ocs-kanban-defaults"'), markup
      assert_equal 1, count(html, "/preview/assets/js/kanban-board.js"), markup
    end
  end

  def test_defaults_cannot_end_their_script_element
    text = DATA["kanban"]["text"].merge("title" => "</script><b>Board</b>")
    html = render(current, "{% include ocs_kanban_board_data.html %}", data: DATA.merge("kanban" => DATA["kanban"].merge("text" => text)))
    script = Nokogiri::HTML.fragment(html).at_css("script#ocs-kanban-defaults")
    refute_includes script.text, "<"
    assert_equal "</script><b>Board</b>", JSON.parse(script.text)["text"]["title"]
  end

  def test_a_columns_list_cannot_end_its_script_element_and_renders_as_before
    columns = [{ "status" => "</script><b>Notes</b>", "hidden" => true }]
    data = DATA.merge("odd" => { "Board" => { "url" => "https://github.com/orgs/UGRC-CSA/projects/1", "columns" => columns } })
    markup = "{% include ocs_kanban_board.html url=site.data.odd.Board.url columns=site.data.odd.Board.columns %}"
    html = render(current, markup, data: data)
    assert_equal render(before, markup, data: data), html
    script = Nokogiri::HTML.fragment(html).at_css('section[data-ocs-kanban] script[data-hook="columns"]')
    refute_includes script.text, "<"
    assert_equal columns, JSON.parse(script.text)
  end
end
