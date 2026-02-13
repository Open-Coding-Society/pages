# OCS SCSS Mixins Reference

Quick reference for all available mixins in the Open Coding Society SCSS framework.

## Button Mixins (`_buttons.scss`)

### `@mixin text-button`
Standard rectangular button with text content.

```scss
.my-button {
  @include text-button;
}
```

**Provides:**
- Height: 38px (44px on mobile)
- Padding: 8px 12px
- Border radius: 6px
- Hover effects: scale(1.05), opacity 0.9
- Theme-aware colors

---

### `@mixin icon-button($size, $spacing)`
Square button for icon-only content.

```scss
.my-icon-btn {
  @include icon-button;        // Default: 38px
  @include icon-button(48px);  // Custom size
  @include icon-button(48px, 12px); // Custom size + spacing
}
```

**Parameters:**
- `$size`: Button dimensions (default: 38px)
- `$spacing`: Margin-left (default: 8px)

**Mobile:** Automatically adjusts to 44px width

---

### `@mixin emphasized-icon-button($size, $spacing)`
Primary action button with inverted colors.

```scss
.runBtn {
  @include emphasized-icon-button;
}
```

**Provides:**
- Accent color background
- Inverted text color
- Same size options as icon-button
- Enhanced hover effects

---

### `@mixin toggle-button`
Button with icon that can rotate or change state.

```scss
.my-toggle {
  @include toggle-button;
}
```

**Provides:**
- Padding: 8px 16px
- Inline-flex display
- Border radius: 6px

---

### `@mixin select-control($min-width)`
Standardized dropdown/select styling.

```scss
.languageSelect {
  @include select-control;         // Default: 150px min-width
  @include select-control(200px);  // Custom width
}
```

**Parameters:**
- `$min-width`: Minimum width (default: 150px)

---

## Panel Mixins (`_panel.scss`)

### `@mixin info-panel($padding, $border-width, $margin-bottom)`
Standard panel with border and background.

```scss
.my-panel {
  @include info-panel;                        // Defaults
  @include info-panel(1rem, 1px, 0.5rem);    // Custom
}
```

**Parameters:**
- `$padding`: Inner padding (default: 1.5rem)
- `$border-width`: Border width (default: 2px)
- `$margin-bottom`: Bottom margin (default: 1rem)

**Provides:**
- Accent-colored border
- Box shadow
- Styled h3 and p elements

---

### `@mixin output-panel($min-height, $max-height)`
Panel for code/content display with scrolling.

```scss
.output-content {
  @include output-panel;                  // Defaults
  @include output-panel(200px, 500px);   // Custom heights
}
```

**Parameters:**
- `$min-height`: Minimum height (default: 100px)
- `$max-height`: Maximum height (default: 300px)

**Provides:**
- Monospace font
- Custom scrollbar
- Pre-wrap text
- Auto vertical scroll

---

### `@mixin input-panel`
Panel for code editors (CodeMirror compatible).

```scss
.CodeMirror {
  @include input-panel;
}
```

**Provides:**
- Panel background
- Border styling
- Monospace font (14px)

---

### `@mixin control-panel($padding, $gap, $border-radius)`
Horizontal bar for controls and buttons.

```scss
.control-bar {
  @include control-panel;                               // Defaults
  @include control-panel(0.5rem, 0.5rem, 8px);        // Custom
}
```

**Parameters:**
- `$padding`: Inner padding (default: 0.75rem 1rem)
- `$gap`: Gap between items (default: 1rem)
- `$border-radius`: Corner radius (default: 10px 10px 0 0)

**Responsive:** Automatically wraps on mobile

---

## Modal Mixins (`_modals.scss`)

### `@mixin modal-overlay`
Full-screen modal overlay with dark background.

```scss
#my-modal {
  @include modal-overlay;
}
```

**Provides:**
- Fixed position, full viewport
- Dark background (rgba(0,0,0,0.85))
- z-index: 1000
- Scrollable overflow
- Responsive padding

---

### `@mixin modal-content`
Centered modal content container.

```scss
#my-modal > div {
  @include modal-content;
}
```

**Provides:**
- Max-width: 600px
- Centered with margin: auto
- Border radius: 12px
- Box shadow
- Responsive: Full-width on mobile

---

### `@mixin modal-close-btn`
Styled close button for modals.

```scss
#my-modal .close-btn {
  @include modal-close-btn;
}
```

**Provides:**
- Positioned top-right (28px from edges)
- Font size: 28px (20px on mobile)
- Inherits icon-button styles

---

## Container Mixins (`_container.scss`)

### `@mixin main-container($margin-bottom)`
Top-level wrapper for sections.

```scss
.code-runner-container {
  @include main-container;       // Default: 2rem
  @include main-container(3rem); // Custom
}
```

**Parameters:**
- `$margin-bottom`: Bottom margin (default: 2rem)

---

### `@mixin sub-container($margin-bottom)`
Groups related elements with subtle styling.

```scss
.editor-container {
  @include sub-container;        // Default: 20px
  @include sub-container(15px);  // Custom
}
```

**Parameters:**
- `$margin-bottom`: Bottom margin (default: 20px)

---

### `@mixin inline-container($display, $gap)`
Lightweight container for inline grouping.

```scss
.button-group {
  @include inline-container;              // Defaults: flex, 1rem
  @include inline-container(flex, 0.5rem); // Custom gap
}
```

**Parameters:**
- `$display`: Display type (default: flex)
- `$gap`: Gap between items (default: 1rem)

---

## GameBuilder Layout Mixins (`game-builder.scss`)

### `@mixin three-panel-layout($gap, $padding, $height)`
Creates a three-column builder layout.

```scss
.my-builder {
  @include three-panel-layout;                    // Defaults
  @include three-panel-layout(15px, 10px, 90vh); // Custom
}
```

**Parameters:**
- `$gap`: Space between panels (default: 10px)
- `$padding`: Container padding (default: 10px)
- `$height`: Viewport height (default: 92vh)

**Responsive:** Stacks vertically on mobile

---

### `@mixin asset-panel($flex-basis)`
Left panel for controls and configuration.

```scss
.config-panel {
  @include asset-panel;      // Default: 20%
  @include asset-panel(25%); // Custom width
}
```

**Parameters:**
- `$flex-basis`: Width percentage (default: 20%)

---

### `@mixin main-content-panel`
Flexible panel for primary content.

```scss
.main-panel {
  @include main-content-panel;
}
```

**Responsive:** 600px min-height on mobile

---

### `@mixin glass-panel-effect($bg, $blur, $border-radius)`
Modern glassmorphic panel effect.

```scss
.glass-panel {
  @include glass-panel-effect;                             // Defaults
  @include glass-panel-effect(rgba(0,0,0,0.5), 30px, 8px); // Custom
}
```

**Parameters:**
- `$bg`: Background color (default: rgba(0,0,0,0.3))
- `$blur`: Backdrop blur (default: 20px)
- `$border-radius`: Corner radius (default: 12px)

---

### `@mixin panel-header-bar($padding)`
Consistent header with title and controls.

```scss
.panel-header {
  @include panel-header-bar;       // Default: 16px
  @include panel-header-bar(20px); // Custom
}
```

**Parameters:**
- `$padding`: Inner padding (default: 16px)

---

### `@mixin view-mode-controls`
Container for view toggle buttons.

```scss
.view-controls {
  @include view-mode-controls;
}
```

**Responsive:** Hidden on mobile

---

### `@mixin view-toggle-button`
Individual toggle button for views.

```scss
.view-btn {
  @include view-toggle-button;
  
  &.active {
    // Active state handled automatically
  }
}
```

**Provides:**
- Uppercase text
- Transition effects
- Active state styling

---

### `@mixin code-editor-container`
Dual-layer container for syntax highlighting.

```scss
.editor-container {
  @include code-editor-container;
}
```

---

### `@mixin code-text-layer`
Transparent textarea for code input.

```scss
.code-layer {
  @include code-text-layer;
}
```

**Provides:**
- Monospace font: 'Fira Code', Monaco, Courier
- Font size: 13px
- Line height: 20px
- Padding: 20px

---

### `@mixin code-highlight-layer`
Visual overlay for syntax highlighting.

```scss
.highlight-layer {
  @include code-highlight-layer;
}
```

**Provides:**
- Absolute positioning
- Pointer-events: none
- Same padding as code layer

---

### `@mixin preview-frame`
Container for iframe or canvas preview.

```scss
.game-frame {
  @include preview-frame;
}
```

**Styles:** Auto-sized iframe/canvas children

---

### `@mixin scrollable-form($padding)`
Scrollable area for form inputs.

```scss
.scroll-form {
  @include scrollable-form;       // Default: 15px
  @include scrollable-form(20px); // Custom
}
```

**Parameters:**
- `$padding`: Inner padding (default: 15px)

---

### `@mixin form-section-group($padding, $margin-bottom)`
Grouped section for related fields.

```scss
.asset-group {
  @include form-section-group;                  // Defaults
  @include form-section-group(20px, 20px);     // Custom
}
```

**Parameters:**
- `$padding`: Inner padding (default: 14px)
- `$margin-bottom`: Bottom margin (default: 15px)

---

### `@mixin section-group-title`
Title header for form sections.

```scss
.group-title {
  @include section-group-title;
}
```

**Provides:**
- Font size: 0.8em
- Bold weight
- Flexbox with space-between

---

### `@mixin icon-button-tooltip($size)`
Icon button with hover tooltip support.

```scss
.icon-btn {
  @include icon-button-tooltip;       // Default: 32px
  @include icon-button-tooltip(40px); // Custom
}
```

**Parameters:**
- `$size`: Button size (default: 32px)

**Usage:** Add `data-tooltip="Text"` attribute

---

## Variable Reference

### Panel Colors
```scss
$panel-bg: var(--panel);
$panel-text: var(--pref-text-color);
$panel-border: var(--ui-border);
$panel-accent: var(--pref-accent-color);
$panel-bg-primary: var(--pref-bg-color);
$panel-bg-hover: var(--panel-mid);
```

### Font Stacks
```scss
$mono-font: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
```

### Background Colors (from root-color-map.scss)
```scss
$bg-0: #000;
$bg-1: #1F2020;
$bg-2: #1F1F1F;
$bg-3: #2A2D2D;
```

---

## CSS Custom Properties (Theme System)

All mixins automatically use these CSS custom properties when available:

### Colors
- `--pref-bg-color` - Background color
- `--pref-text-color` - Text color
- `--pref-accent-color` - Accent/highlight
- `--pref-selection-color` - Selection highlight
- `--panel` - Panel background
- `--panel-mid` - Panel mid-tone
- `--ui-bg` - UI element background
- `--ui-border` - UI borders
- `--text-muted` - Muted text
- `--background` - Page background

### Typography
- `--pref-font-family` - Font family
- `--pref-font-size` - Font size

---

## Quick Start Examples

### Simple Button
```scss
.my-btn {
  @include text-button;
  background: var(--pref-accent-color);
}
```

### Panel with Header
```scss
.my-panel {
  @include glass-panel-effect;
  
  .header {
    @include panel-header-bar;
  }
  
  .content {
    @include scrollable-form;
  }
}
```

### Three-Panel Builder
```scss
.my-builder {
  @include three-panel-layout;
  
  .left {
    @include asset-panel(30%);
  }
  
  .main {
    @include main-content-panel;
  }
}
```

### Modal Dialog
```scss
#my-modal {
  @include modal-overlay;
  
  > div {
    @include modal-content;
  }
  
  .close {
    @include modal-close-btn;
  }
}
```

---

## Import Guide

```scss
// Import individual mixin files
@import "mixins/buttons";
@import "mixins/panel";
@import "mixins/modals";
@import "mixins/container";

// Import full GameBuilder system (includes above)
@import "game-builder";

// Use mixins
.my-component {
  @include text-button;
  @include info-panel;
}
```

---

## Documentation Files

- **`_buttons.scss`** - Button patterns and controls
- **`_panel.scss`** - Panel and content containers
- **`_modals.scss`** - Modal overlays and dialogs
- **`_container.scss`** - Layout containers
- **`game-builder.scss`** - Three-panel builder system
- **`BUILDER_PATTERN_GUIDE.md`** - Comprehensive usage guide
- **`BEFORE_AFTER_COMPARISON.md`** - Visual examples

---

**Last Updated**: February 2026  
**Maintained by**: Open Coding Society  
**Purpose**: Reusable SCSS patterns for OCS interfaces
