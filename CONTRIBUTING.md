# Contributing to LaraKit

LaraKit is designed to be extended. This guide covers everything you need to add a new module, run the test suite, and keep the codebase consistent.

---

## Table of Contents

- [Adding a new module](#adding-a-new-module)
- [Running tests](#running-tests)
- [Coding standards](#coding-standards)
- [Commit rules](#commit-rules)

---

## Adding a new module

Every module in LaraKit follows the same layered structure. The Posts module is the reference implementation - read through it before building your own.

A module lives entirely inside `app/Modules/YourModule/` and must be removable without touching anything outside that folder.

### Step 1 - Create the folder structure

app/Modules/YourModule/

├── Controllers/

│ └── YourModelController.php

├── Enums/

│ └── YourModelStatus.php (if needed)

├── Models/

│ └── YourModel.php

├── Repositories/

│ └── YourModelRepository.php

├── Requests/

│ ├── StoreYourModelRequest.php

│ └── UpdateYourModelRequest.php

├── Resources/

│ └── YourModelResource.php (if exposing via API)

└── Services/

└── YourModelService.php

### Step 2 - Build in order

Always build in this order. Never skip ahead.

1. **Migration** - define the schema, add indexes on columns used for filtering or ordering
2. **Model** - fillable fields, casts, relationships, soft deletes if needed
3. **Repository** - all database queries live here, nothing else
4. **Service** - business logic, protection rules, calls the repository
5. **FormRequests** - validation rules for store and update
6. **Controller** - receives the request, calls the service, returns a response
7. **Routes** - register under the `admin` middleware group in `routes/web.php`
8. **React pages** - Index, Create, Edit under `resources/js/Pages/YourModule/`

### Step 3 - Follow the rules

- No database queries in controllers or services - that belongs in the repository
- No business logic in controllers - that belongs in the service
- No hardcoded values - pagination size, cache TTL, queue name all go in `config/larakit.php`
- Add `declare(strict_types=1)` at the top of every PHP file
- Add a docblock to every class and every non-trivial method
- Log all mutations with `activity()->on($model)->log('created')` or similar

### Step 4 - Register permissions

Add your module's permissions to `config/permissions.php` and assign them to roles in the seeder. Never use raw permission strings in code.

### Step 5 - Write tests

Every module needs a Pest test file at `tests/Feature/YourModuleTest.php`. Cover at minimum: index, store, update, delete, and any protection rules specific to your module.

### Step 6 - Regenerate Wayfinder

After adding routes, regenerate typed route helpers:

```bash
bash scripts/wayfinder.sh
```

---

## Running tests

### Prerequisites

Copy `.env.example` to `.env.testing` and configure a separate test database. LaraKit uses `RefreshDatabase` - the test database is wiped on every run.

### Run the full suite

```bash
php artisan test
```

Or with Pest directly:

```bash
./vendor/bin/pest
```

### Run a single file

```bash
./vendor/bin/pest tests/Feature/UserTest.php
```

### Run a single test

```bash
./vendor/bin/pest --filter="it can create a user"
```

### What the suite covers

| File                   | What it tests                               |
| ---------------------- | ------------------------------------------- |
| `AuthTest.php`         | Guest redirect, role-based middleware       |
| `UserTest.php`         | Full CRUD, protection rules                 |
| `SettingsTest.php`     | View, update, cache invalidation            |
| `NotificationTest.php` | Mail::fake, Notification::fake              |
| `PostApiTest.php`      | Sanctum auth, posts endpoints, health check |

---

## Coding standards

### PHP

- `declare(strict_types=1)` on every file - enforced by Pint
- Run Pint before committing: `./vendor/bin/pint`
- Docblocks on every class and every public or non-trivial method - human-readable English only, no `@param`, `@return`, or `@throws`
- Enums for all type-safe constants - never raw strings
- Config for all values - never hardcode pagination sizes, TTLs, queue names, or role strings

### Architecture

Controller → HTTP only. No queries, no business logic.

Service → Business logic and protection rules only. No queries.

Repository → Database queries only. No logic.

FormRequest → Validation only.

Breaking this separation is the only rule with no exceptions.

### React / TypeScript

- All components in TypeScript - no `.jsx` files
- Props typed explicitly - no `any`
- Use Wayfinder typed routes - never hardcode URL strings
- Use the `__()` helper from `useTranslations` for any user-facing string

---

## Commit rules

### Format

type: short description

Examples:
feat: add products module

fix: correct permission check on user update

chore: regenerate wayfinder routes

docs: update README with products module

refactor: extract pricing logic into PriceService

test: add product CRUD tests

### One responsibility per commit

Split by layer - backend changes separate from frontend changes. Wayfinder regeneration always gets its own `chore:` commit. Migrations get their own commit if they stand alone.

### README on every feature commit

Every commit that completes a feature includes a README update in the same commit. Move the item to the completed section, update any relevant counts.
