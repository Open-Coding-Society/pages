# ============================================================================
# Liquid 4.0.3 + Ruby 3.2/4.0 Compatibility Patch
# ============================================================================
#
# PROBLEM:
# --------
# Liquid 4.0.3 (a template engine used by Jekyll) relies on Ruby's taint-tracking
# security model via the `taint()`, `untaint()`, and `tainted?()` methods on all
# objects. This security model was REMOVED in Ruby 3.2.0 to reduce complexity
# and improve performance, as it was rarely used in modern Ruby code.
#
# When running Liquid 4.0.3 on Ruby 3.2+, calling these methods raises:
#   NoMethodError: undefined method `taint' for <Object>
#   NoMethodError: undefined method `untaint' for <Object>
#   NoMethodError: undefined method `tainted?' for <Object>
#
# This breaks Jekyll builds since Jekyll 3.9.0 depends on Liquid 4.0.3.
#
# SOLUTION:
# ---------
# This patch adds stub implementations of these methods to the Object class
# for Ruby 3.2+. The stubs do nothing—they simply return the object unchanged
# or false—which is safe because:
#
# 1. These methods are no longer needed for security (Ruby removed the model)
# 2. The behavior of `untaint()` and `taint()` returning `self` is idiomatic
# 3. Returning false for `tainted?` is conservative and safe
#
# REFERENCES:
# -----------
# - Ruby 3.2.0 Release Notes: https://www.ruby-lang.org/en/news/2022/12/25/ruby-3-2-0-released/
# - Object#taint (deprecated): https://github.com/tzinfo/tzinfo/issues/145
# - Liquid GitHub: https://github.com/Shopify/liquid
# - Jekyll GitHub: https://github.com/jekyll/jekyll
#
# ============================================================================

if RUBY_VERSION >= "3.2"
  class Object
    # Returns false - object is never tainted in this stub
    def tainted?
      false
    end

    # No-op - returns self unchanged for method chaining compatibility
    def taint
      self
    end

    # No-op - returns self unchanged for method chaining compatibility
    def untaint
      self
    end
  end
end
