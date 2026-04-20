# Patch for Liquid 4.0.3 to support Ruby 4.0+
# The taint-tracking security model was removed in Ruby 3.2, we add it back here to prevent errors in Liquid 4.0.3 which still uses it


if RUBY_VERSION >= "3.2"
  class Object
    def tainted?
      false
    end

    def taint
      self
    end

    def untaint
      self
    end
  end
end
