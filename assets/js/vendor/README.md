# Shared browser libraries

These checked-in runtime assets are published by Jekyll without an npm install
or dependency-generation step. Keep third-party sources unmodified and retain
their licenses when distributing them.

## Acorn

- Version: **8.15.0**.
- Source: the `dist/acorn.mjs` file from the official `acorn@8.15.0` package
  ([upstream](https://github.com/acornjs/acorn/tree/8.15.0)).
- Runtime module: [acorn.mjs](./acorn.mjs).
- License: [MIT license](./acorn-LICENSE), copied from that package.
- Purpose: parse JavaScript into an AST without executing the source.
- Consumer: GameBuilder's code importer, used by Pull and Push safety checks.
  Other browser tools can reuse the ES module's `parse` export.

The importer uses a relative asset URL so it also works when the site is
published beneath a base URL. The same import resolves from GameBuilder's
source directory for Node tests and from its published project directory in
the browser.

To update Acorn, obtain a reviewed, pinned upstream release and replace both
the module and its license with the exact package files. Update this version
record, run the GameBuilder contract tests, and verify browser Pull/Push through
the Makefile site workflow. Package tooling may be used for maintenance, but
it is not required for ordinary site builds.

## qrcode-generator

- Version: **1.4.4**.
- Source: the `qrcode.js` file from the official `qrcode-generator@1.4.4` package
  ([upstream](https://github.com/kazuhikoarase/qrcode-generator)).
- Runtime script: [qrcode.js](./qrcode.js). It is a classic script, not a module: it
  defines a global `qrcode` function. Load it with a `<script>` tag (the microblog loads
  it on demand, only when a QR code is asked for).
- License: [MIT license](./qrcode-LICENSE), copied from that repository.
- Purpose: draw a QR code as inline SVG in the browser, with no server and no image service.
- Consumer: the microblog's "QR" button (`_includes/microblog_foundation.html`) and the
  phone review page (`navigation/review.md`), through `assets/js/api/microblog-review.js`.
