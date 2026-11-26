require "date"
require "json"

# Builds the Events system's pages and catalog from front matter during the Jekyll build.
#
# Every document with `layout: event` is one event. On this site each is a post in _posts/events/
# with Mort's front matter (pages#2089) and an explicit `permalink: /events/<slug>/`. This module
# checks each event against the registry (_data/projects/events/event_registry.yml) and the site's
# `events:` settings in _config.yml, stops the build naming the file when a value is wrong, and
# prepares what the Liquid templates read: page.event_entry on each event, and
# site.data["events_catalog"], ["events_categories"] and ["events_settings"] for /events/.
#
# It does not handle clicks or the clock. The site rebuilds only on a push, so js/event-page.js and
# js/event-catalog.js move a published event to Active and Completed in the visitor's browser.
#
# Methods declared with `self.` belong to the module (like Java static methods). String-keyed Ruby
# hashes below are the named fields Liquid reads.
module Events
  # Mort's lifecycle, in his order (img1). The registry must list exactly these.
  LIFECYCLE = %w[draft published registration active completed archived].freeze
  # The ocs__status-pill tones a lifecycle stage may use.
  TONES = %w[good warn bad neutral].freeze
  PERMALINK = %r{\A/events/[a-z0-9]+(?:-[a-z0-9]+)*/\z}.freeze
  SLUG = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/.freeze
  CLOCK = /\A(?:[01]\d|2[0-3]):[0-5]\d\z/.freeze
  ZONE = %r{\A(?:UTC|[A-Za-z]+(?:/[A-Za-z0-9_+-]+)+)\z}.freeze
  # A path on this site: one leading slash, never two (//host is another site), and no spaces.
  SITE_PATH = %r{\A/(?!/)\S*\z}.freeze
  HTTPS = %r{\Ahttps://\S+\z}i.freeze
  HTTP_OR_HTTPS = %r{\Ahttps?://\S+\z}i.freeze
  REGISTRY_FILE = "_data/projects/events/event_registry.yml".freeze
  CONFIG_FILE = "_config.yml".freeze
  # The shared page viewer (_includes/page-viewer.html); its label and item come from the registry.
  VIEWER = {
    "home" => "/events/", "activation_param" => "events_view", "script" => "/assets/js/projects/events/viewer.js"
  }.freeze

  # Stops the build with "<source>: <message>".
  #
  # @param source [String] the file to fix, like _posts/events/2027-03-15-workshop.md
  # @param message [String] the field and its rule
  # @raise [Jekyll::Errors::FatalException] always
  def self.fail!(source, message)
    raise Jekyll::Errors::FatalException, "#{source}: #{message}"
  end

  # @return [Boolean] whether value is text that isn't blank
  def self.text?(value)
    value.is_a?(String) && !value.strip.empty?
  end

  # @param external [Regexp] the links allowed besides site paths (HTTPS or HTTP_OR_HTTPS)
  # @return [Boolean] whether value is a site path or such a link
  def self.link?(value, external)
    value.is_a?(String) && (value.match?(SITE_PATH) || value.match?(external))
  end

  # Checks the registry: Mort's six lifecycle stages in his order, each with a word and a tone.
  #
  # @param site [Jekyll::Site]
  # @return [Hash] the registry
  # @raise [Jekyll::Errors::FatalException] naming the registry file
  def self.registry(site)
    registry = site.data.dig("projects", "events", "event_registry")
    fail!(REGISTRY_FILE, "is missing; it is published from _projects/systems/events/data") unless registry.is_a?(Hash)
    lifecycle = registry["lifecycle"]
    keys = lifecycle.is_a?(Array) ? lifecycle.map { |stage| stage.is_a?(Hash) ? stage["key"] : nil } : []
    fail!(REGISTRY_FILE, "lifecycle must list #{LIFECYCLE.join(', ')}, in that order") unless keys == LIFECYCLE
    lifecycle.each do |stage|
      fail!(REGISTRY_FILE, "lifecycle #{stage['key']} needs a label") unless text?(stage["label"])
      fail!(REGISTRY_FILE, "lifecycle #{stage['key']} tone must be one of #{TONES.join(', ')}") unless TONES.include?(stage["tone"])
    end
    registry
  end

  # Reads the site's `events:` settings. timezone and page_size are needed once there are events;
  # a value that is there must be right either way.
  #
  # @param site [Jekyll::Site]
  # @param registry [Hash]
  # @param events_exist [Boolean] whether any event will be built
  # @return [Hash{String => Object}] timezone, join_url, page_size and features
  # @raise [Jekyll::Errors::FatalException] naming _config.yml and the setting
  def self.settings(site, registry, events_exist)
    settings = site.config["events"] || {}
    fail!(CONFIG_FILE, "events must be a mapping") unless settings.is_a?(Hash)
    zone = settings["timezone"]
    if zone.nil?
      fail!(CONFIG_FILE, "events.timezone is needed: an Area/City name like America/Los_Angeles, or UTC") if events_exist
    elsif !(zone.is_a?(String) && zone.match?(ZONE))
      fail!(CONFIG_FILE, "events.timezone must be an Area/City name like America/Los_Angeles, or UTC")
    end
    size = settings["page_size"]
    unless (size.nil? && !events_exist) || (size.is_a?(Integer) && size.between?(1, 48))
      fail!(CONFIG_FILE, "events.page_size must be a whole number from 1 to 48")
    end
    join = settings["join_url"]
    fail!(CONFIG_FILE, "events.join_url must be a site path or an https link") unless join.nil? || link?(join, HTTPS)
    features = switches(settings["features"] || {}, registry, CONFIG_FILE, "events.features")
    { "timezone" => zone, "join_url" => join, "page_size" => size, "features" => features }
  end

  # Checks a features block: only the registry's keys, each true or false.
  #
  # @return [Hash{String => Boolean}] value
  # @raise [Jekyll::Errors::FatalException] naming source and the key
  def self.switches(value, registry, source, name)
    fail!(source, "#{name} must be a mapping") unless value.is_a?(Hash)
    value.each do |key, on|
      fail!(source, "#{name}.#{key} isn't one of #{registry['features'].join(', ')}") unless registry["features"].include?(key)
      fail!(source, "#{name}.#{key} must be true or false") unless [true, false].include?(on)
    end
    value
  end

  # Checks one event's front matter and builds what its page and its card read.
  #
  # @param document [Jekyll::Document, Jekyll::Page] the event
  # @param registry [Hash]
  # @param settings [Hash] from Events.settings
  # @return [Hash{String => Object}] the event entry (page.event_entry)
  # @raise [Jekyll::Errors::FatalException] naming the file and the field
  def self.entry(document, registry, settings)
    data = document.data
    source = document.relative_path
    day = check_required(source, data)
    status = data["status"]
    start_time, end_time = times(source, data)
    page_words = words(source, data["labels"], registry)
    formats = registry["formats"]
    place_details = location(source, data["location"])
    host = organizer(source, data["organizer"])
    people = presenters(source, data["presenters"], host, page_words)
    presentation = data["presentation"]
    fail!(source, "presentation must be a site path or an https link") unless presentation.nil? || link?(presentation, HTTPS)
    check_registration(source, data["registration"])
    check_attachments(source, data["attachments"], registry)
    event_type = data["event_type"]
    unless event_type.nil? || registry["event_types"].key?(event_type)
      fail!(source, "event_type must be one of #{registry['event_types'].keys.join(', ')}")
    end
    event_categories = categories(source, data["categories"])
    stage = status == "registration" ? "published" : status # Registration Open needs the Event Service (PR 3).
    pill = registry["lifecycle"].find { |each| each["key"] == stage }
    {
      "title" => data["title"].strip, "description" => text?(data["description"]) ? data["description"].strip : nil,
      "url" => document.url, "path" => source, "sample" => data["sample"] == true,
      "status" => status, "stage" => stage, "pill" => { "label" => pill["label"], "tone" => pill["tone"] },
      "listed" => registry["lifecycle"].find { |each| each["key"] == status }["listed"] == true,
      "day" => day, "start_time" => start_time, "end_time" => end_time, "timezone" => timezone(source, data, settings),
      "when" => when_line(day, start_time, end_time, formats), "datetime" => start_time ? "#{day}T#{start_time}" : day,
      "card_date" => Date.strptime(day, "%Y-%m-%d").strftime(formats["card_date"]),
      "categories" => event_categories, "category_keys" => event_categories.map(&:downcase),
      "event_type" => event_type, "event_type_label" => event_type && registry["event_types"][event_type],
      "location" => place_details, "place" => place(place_details), "place_url" => place_details["url"],
      "organizer" => host, "presenters" => people, "schedule" => schedule(source, data["schedule"], formats),
      "presentation" => presentation, "features" => features(source, data["features"], registry, settings),
      "sections" => sections(document, registry, page_words, people, presentation), "words" => page_words
    }.merge(image(source, data))
  end

  # Checks the fields every event needs: title, date, one of Mort's statuses and an /events/
  # permalink; and the plain optional ones, description and sample.
  #
  # @return [String] the event's "YYYY-MM-DD" day
  def self.check_required(source, data)
    fail!(source, "title must be text that isn't blank") unless text?(data["title"])
    day = day(data["date"]) || fail!(source, "date must be a YYYY-MM-DD day")
    fail!(source, "status must be one of #{LIFECYCLE.join(', ')}") unless LIFECYCLE.include?(data["status"])
    fail!(source, "permalink is needed, like /events/<slug>/") if data["permalink"].nil?
    unless data["permalink"].is_a?(String) && data["permalink"].match?(PERMALINK)
      fail!(source, "permalink must look like /events/<slug>/, with a lowercase slug")
    end
    fail!(source, "description must be text") unless data["description"].nil? || data["description"].is_a?(String)
    fail!(source, "sample must be true or false") unless [nil, true, false].include?(data["sample"])
    day
  end

  # A "YYYY-MM-DD" day from front matter: Jekyll gives a post's date as a Time at midnight and a
  # page's as a Date; written in quotes it stays text.
  #
  # @return [String, nil] the day, or nil when it isn't a real day (or carries a time)
  def self.day(value)
    text = case value
           when Time then value.strftime("%Y-%m-%d") if [value.hour, value.min, value.sec] == [0, 0, 0]
           when Date then value.strftime("%Y-%m-%d")
           when String then value
           end
    return nil unless text&.match?(/\A\d{4}-\d{2}-\d{2}\z/)

    Date.strptime(text, "%Y-%m-%d").strftime("%Y-%m-%d")
  rescue ArgumentError
    nil
  end

  # Checks start_time and end_time: quoted 24-hour "HH:MM", and an end only after a start.
  #
  # @return [Array(String, String)] start and end, either nil when not given
  def self.times(source, data)
    start_time, end_time = %w[start_time end_time].map do |key|
      value = data[key]
      next value if value.nil? || (value.is_a?(String) && value.match?(CLOCK))

      fail!(source, %(#{key} must be a quoted 24-hour "HH:MM", like "10:00" (Jekyll reads an unquoted 10:00 as a number)))
    end
    if end_time
      fail!(source, "end_time needs a start_time") unless start_time
      fail!(source, "end_time must be after start_time") unless end_time > start_time
    end
    [start_time, end_time]
  end

  # @return [String] the event's own time zone, or the site's
  def self.timezone(source, data, settings)
    return settings["timezone"] unless data.key?("timezone")
    return data["timezone"] if data["timezone"].is_a?(String) && data["timezone"].match?(ZONE)

    fail!(source, "timezone must be an Area/City name like America/Los_Angeles, or UTC")
  end

  # The page's words: the registry's page texts and section labels, with the event's own labels
  # over them (`labels: {presenters: Speakers}`).
  #
  # @return [Hash{String => String}]
  def self.words(source, labels, registry)
    words = registry.dig("texts", "page").merge(registry["sections"].to_h { |section| [section["key"], section["label"]] })
    return words if labels.nil?

    fail!(source, "labels must be a mapping of section or page text names to words") unless labels.is_a?(Hash)
    labels.each do |key, value|
      fail!(source, "labels.#{key} isn't a section or a page text in the registry") unless words.key?(key)
      fail!(source, "labels.#{key} must be text that isn't blank") unless text?(value)
    end
    words.merge(labels.transform_values(&:strip))
  end

  # @return [Array<String>] the categories, trimmed, each spelled once whatever its case
  def self.categories(source, value)
    return [] if value.nil?
    fail!(source, "categories must be a list of text") unless value.is_a?(Array) && value.all? { |name| text?(name) }

    value.map(&:strip).uniq(&:downcase)
  end

  # @return [Hash] location's name, address and url (an https link to a map or directions)
  def self.location(source, value)
    return {} if value.nil?
    fail!(source, "location must be a mapping with name and address") unless value.is_a?(Hash)

    %w[name address].each { |key| fail!(source, "location.#{key} must be text") unless value[key].nil? || value[key].is_a?(String) }
    fail!(source, "location.url must be an https link") unless value["url"].nil? || (value["url"].is_a?(String) && value["url"].match?(HTTPS))
    value
  end

  # @return [String, nil] the place line: the location's name and whole address
  def self.place(location)
    parts = [location["name"], location["address"]].select { |part| text?(part) }.map(&:strip)
    parts.empty? ? nil : parts.join(", ")
  end

  # @return [Hash] organizer's name and uids (login uids, who become Microblog authors)
  def self.organizer(source, value)
    return {} if value.nil?
    fail!(source, "organizer must be a mapping with a name") unless value.is_a?(Hash)
    fail!(source, "organizer.name must be text") unless value["name"].nil? || value["name"].is_a?(String)
    uids = value["uids"]
    fail!(source, "organizer.uids must be a list of login uids") unless uids.nil? || (uids.is_a?(Array) && uids.all? { |uid| text?(uid) })

    value
  end

  # The people img2's Presenters card lists, the organizer first, each with initials for an
  # ocs__avatar (the avatar grammar shows initials, not photos).
  #
  # @return [Array<Hash>] name, role and initials
  def self.presenters(source, value, organizer, words)
    list = value || []
    fail!(source, "presenters must be a list of {name, role}") unless list.is_a?(Array) && list.all? { |person| person.is_a?(Hash) }
    people = list.map do |person|
      fail!(source, "presenters need a name") unless text?(person["name"])
      fail!(source, "presenters role must be text") unless person["role"].nil? || person["role"].is_a?(String)
      person(person["name"], person["role"])
    end
    text?(organizer["name"]) ? [person(organizer["name"], words["organizer"]), *people] : people
  end

  # @return [Hash] a name, role and initials (the first letters of the first two words)
  def self.person(name, role)
    name = name.strip
    { "name" => name, "role" => role, "initials" => name.split(/\s+/).first(2).map { |word| word[0] }.join.upcase }
  end

  # @return [Array<Hash>] the schedule rows, each with its time written the registry's way
  def self.schedule(source, value, formats)
    return [] if value.nil?
    fail!(source, "schedule must be a list of {time, title, detail}") unless value.is_a?(Array) && value.all? { |row| row.is_a?(Hash) }

    value.map do |row|
      fail!(source, %(schedule time must be a quoted 24-hour "HH:MM", like "10:00")) unless row["time"].is_a?(String) && row["time"].match?(CLOCK)
      fail!(source, "schedule rows need a title") unless text?(row["title"])
      fail!(source, "schedule detail must be text") unless row["detail"].nil? || row["detail"].is_a?(String)
      { "time" => row["time"], "time_label" => clock_label(row["time"], formats), "title" => row["title"], "detail" => row["detail"] }
    end
  end

  # Checks registration: {enabled: true|false, capacity: a whole number of 1 or more}. The Event
  # Service (PR 3) takes the RSVPs; this page shows no seats until it does.
  def self.check_registration(source, value)
    return if value.nil?
    fail!(source, "registration must be a mapping with enabled and capacity") unless value.is_a?(Hash)
    fail!(source, "registration.enabled must be true or false") unless [nil, true, false].include?(value["enabled"])

    capacity = value["capacity"]
    fail!(source, "registration.capacity must be a whole number of 1 or more") unless capacity.nil? || (capacity.is_a?(Integer) && capacity >= 1)
  end

  # Checks attachments: each {type: a registry attachment type, id: a lowercase slug used once}.
  # Their files come from the Event Service (PR 3).
  def self.check_attachments(source, value, registry)
    return if value.nil?
    fail!(source, "attachments must be a list of {type, id}") unless value.is_a?(Array) && value.all? { |item| item.is_a?(Hash) }

    types = registry["attachment_types"].keys
    value.each_with_object({}) do |item, seen|
      fail!(source, "attachments type must be one of #{types.join(', ')}") unless types.include?(item["type"])
      id = item["id"]
      fail!(source, "attachments id must be a lowercase slug, like workshop-gallery") unless id.is_a?(String) && id.match?(SLUG)
      fail!(source, "attachments id #{id} is used twice") if seen[id]
      seen[id] = true
    end
  end

  # Checks the hero: image (a site path or an http(s) link), its required alt text, and an optional
  # credit (img2's chip).
  #
  # @return [Hash] image, image_alt and image_credit
  def self.image(source, data)
    image = data["image"]
    fail!(source, "image must be a site path starting with / or an http(s) link") unless image.nil? || link?(image, HTTP_OR_HTTPS)
    fail!(source, "image_alt is needed with image") if image && !text?(data["image_alt"])
    credit = data["image_credit"]
    unless credit.nil? || (credit.is_a?(Hash) && text?(credit["name"]))
      fail!(source, "image_credit must be a mapping with a name and a url")
    end
    if credit && !(credit["url"].nil? || link?(credit["url"], HTTPS))
      fail!(source, "image_credit.url must be a site path or an https link")
    end
    {
      "image" => image, "image_alt" => image && data["image_alt"].strip,
      "image_credit" => credit && { "name" => credit["name"].strip, "url" => credit["url"] }
    }
  end

  # The event's switches: each registry feature from the event's own features block, else from the
  # site's events.features, else off.
  #
  # @return [Hash{String => Boolean}] all of the registry's features
  def self.features(source, value, registry, settings)
    own = value.nil? ? {} : switches(value, registry, source, "features")
    registry["features"].to_h { |key| [key, own.key?(key) ? own[key] : settings["features"].fetch(key, false)] }
  end

  # img2's section cards, in the registry's order, each only when its section has content. The
  # gallery has none until the Event Service has photos (PR 3).
  #
  # @return [Array<Hash>] key, label and icon
  def self.sections(document, registry, words, presenters, presentation)
    filled = {
      "description" => !document.content.to_s.strip.empty? || !presentation.nil?,
      "schedule" => true, # every event has its date
      "presenters" => !presenters.empty?
    }
    registry["sections"].select { |section| filled[section["key"]] }
                        .map { |section| { "key" => section["key"], "label" => words[section["key"]], "icon" => section["icon"] } }
  end

  # @return [String] like "March 15, 2027 · 10:00 AM – 1:00 PM", in the registry's formats
  def self.when_line(day, start_time, end_time, formats)
    line = Date.strptime(day, "%Y-%m-%d").strftime(formats["date"])
    return line unless start_time

    line += formats["separator"] + clock_label(start_time, formats)
    end_time ? line + formats["between"] + clock_label(end_time, formats) : line
  end

  # @return [String] an "HH:MM" clock written the registry's way, like "1:00 PM"
  def self.clock_label(clock, formats)
    hour, minute = clock.split(":").map(&:to_i)
    Time.utc(2000, 1, 1, hour, minute).strftime(formats["time"])
  end

  # A schema.org Event for search engines. Times carry no UTC offset: the site declares no time
  # zone library, so the times are written as the event's own wall clock. "</" is written "<\/"
  # and "<!--" as "<\u0021--" (the same text in JSON), so no value can close the script element or
  # keep its end tag from closing it.
  #
  # @param entry [Hash] from Events.entry
  # @param site [Jekyll::Site] for its url and baseurl
  # @return [String] JSON
  def self.json_ld(entry, site)
    base = "#{site.config['url']}#{site.config['baseurl']}"
    address = ->(link) { link.match?(SITE_PATH) ? "#{base}#{link}" : link }
    data = { "@context" => "https://schema.org", "@type" => "Event", "name" => entry["title"], "description" => entry["description"] }
    data["startDate"] = entry["datetime"]
    data["endDate"] = entry["end_time"] ? "#{entry['day']}T#{entry['end_time']}" : (entry["day"] unless entry["start_time"])
    data["eventStatus"] = "https://schema.org/EventScheduled"
    if entry["place"]
      data["eventAttendanceMode"] = "https://schema.org/OfflineEventAttendanceMode"
      data["location"] = { "@type" => "Place", "name" => entry.dig("location", "name"), "address" => entry.dig("location", "address") }.compact
    end
    data["organizer"] = { "@type" => "Organization", "name" => entry.dig("organizer", "name") } if text?(entry.dig("organizer", "name"))
    data["image"] = [address.call(entry["image"])] if entry["image"]
    data["url"] = address.call(entry["url"])
    JSON.generate(data.compact).gsub("</", "<\\/").gsub("<!--", "<\\u0021--")
  end

  # Sets what an event page reads, and the flags that keep it out of other lists.
  #
  # @param document [Jekyll::Document, Jekyll::Page]
  # @return [Hash] the event entry
  # @note hide keeps events out of Blogs, Topics, Capstone and the course reader; microblog turns on
  #   the site shell's Microblog panel (base.html); authors gives organizers the Microblog's resolve
  #   rights and alerts; page_viewer turns on Mort's shared viewer for listed events.
  def self.publish(document, registry, settings, site)
    entry = entry(document, registry, settings)
    entry["json_ld"] = json_ld(entry, site) unless entry["sample"] || entry["status"] == "draft"
    data = document.data
    data["event_entry"] = entry
    data["hide"] = true
    data["full_width"] = true
    data["microblog"] = entry["features"]["microblog"]
    uids = entry.dig("organizer", "uids")
    data["authors"] = uids.dup if entry["features"]["microblog"] && uids && data["authors"].nil?
    if entry["listed"]
      viewer = { "label" => registry.dig("viewer", "label"), "item" => registry.dig("viewer", "item") }.merge(VIEWER)
      fail!(document.relative_path, "page_viewer is already assigned") if data["page_viewer"] && data["page_viewer"] != viewer
      data["page_viewer"] = viewer
    end
    entry
  end

  # @return [Hash{String => String}] each category's lowercase key and the first spelling seen, by key
  def self.category_labels(catalog)
    labels = {}
    catalog.each { |entry| entry["categories"].each { |name| labels[name.downcase] ||= name } }
    labels.sort.to_h
  end

  # Jekyll integration. Runs at :high, before the course reader (:normal) and the Topics and
  # Capstone generators (:lowest), so the `hide: true` it sets keeps events out of their lists.
  class Generator < Jekyll::Generator
    safe true
    priority :high

    # Checks and prepares every event, and publishes the catalog data for /events/.
    #
    # @param site [Jekyll::Site] whose posts and pages have been read
    # @note Mutates each event's data (see Events.publish), removes `status: draft` events from
    #   site.posts.docs and site.pages unless the build uses --unpublished, and sets
    #   site.data["events_catalog"] (listed events by day, start time, then title),
    #   ["events_categories"] and ["events_settings"].
    # @raise [Jekyll::Errors::FatalException] naming the file and field to fix
    def generate(site)
      # Jekyll silently skips future-dated posts unless future is on.
      if site.config["future"] != true && Dir.glob(File.join(site.source, "_posts", "events", "**", "*")).any? { |path| File.file?(path) }
        raise Jekyll::Errors::FatalException, "Events needs future: true in _config.yml"
      end

      events = (site.posts.docs + site.pages).select { |document| document.data["layout"] == "event" }
      unless site.config["unpublished"] == true
        drafts = events.select { |document| document.data["status"] == "draft" }
        [site.posts.docs, site.pages].each { |list| list.reject! { |document| drafts.any? { |draft| draft.equal?(document) } } }
        events -= drafts
      end
      registry = Events.registry(site)
      settings = Events.settings(site, registry, !events.empty?)
      entries = events.map { |document| Events.publish(document, registry, settings, site) }
      duplicates = entries.map { |entry| entry["url"] }.tally.select { |_url, count| count > 1 }.keys
      raise Jekyll::Errors::FatalException, "Events must have unique URLs: #{duplicates.join(', ')}" unless duplicates.empty?

      catalog = entries.select { |entry| entry["listed"] }.sort_by { |entry| [entry["day"], entry["start_time"].to_s, entry["title"].downcase] }
      site.data["events_catalog"] = catalog
      site.data["events_categories"] = Events.category_labels(catalog)
      site.data["events_settings"] = settings
    end
  end
end
