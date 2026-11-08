# Login

Login is how people get into the site: the sign-in page at `/login`, the sign-up pages
at `/signup` and `/guestlogin`, `/logout`, and the navbar's signed-in name and menu. It
is a system like [Profile](../profile/README.md): the sources live here, and `make`
copies them to the paths the rest of the site loads them from.

See [Login architecture](docs/ARCHITECTURE.md) for how the pages and scripts fit
together, which backend endpoints they call, and how they're tested.

## Files

Edit the sources in this folder, never the published copies. The published copies are
git-ignored, and `make` (or `make dev`) writes them again from here.

| Source | Published to | What it is |
|---|---|---|
| `pages/login.md` | `navigation/authentication/login.md` | `/login`: sign-in, sign-up and Google re-verification |
| `pages/signup.md` | `navigation/signup.md` | `/signup`, the account options page |
| `pages/guestlogin.md` | `navigation/authentication/guestlogin.md` | `/guestlogin`, guest sign-up |
| `pages/logout.md` | `navigation/authentication/logout.md` | `/logout` |
| `js/navbar-login.js` | `assets/js/api/login.js` | the navbar's signed-in state, started by the site header |
| `js/logout.js` | `assets/js/api/logout.js` | `handleLogout` |
| `js/password-rules.js` | `assets/js/api/passwordRules.js` | the password rule and checklist, also used by `/support` and the microblog |
| `js/password-fields.js` | `assets/js/api/passwordFields.js` | Show/Hide and the Caps Lock hint on password fields |
| `js/reverify.js` | `assets/js/api/reverify.js` | re-verifying a student's school email with Google |

The scripts keep their old published paths because pages, layouts and other systems
load them by those paths.

## Tests

```bash
node --test _projects/systems/login/tests/*.test.mjs
```

`tests/login_distribution.test.mjs` at the repo root runs the same tests with the rest
of `node --test tests/*.test.mjs`.
