# LaraKit

A production-ready Laravel admin panel starter template built with React, Inertia.js and TypeScript. Clone it, understand every line, extend it however you need.

---

## Why LaraKit?

Every Laravel project eventually needs an admin panel. The usual options:

|               | Filament    | Nova      | LaraKit         |
| ------------- | ----------- | --------- | --------------- |
| Frontend      | Livewire    | Blade/Vue | React + Inertia |
| Customization | Opinionated | Limited   | Fully yours     |
| Source        | Open        | Closed    | Open            |

LaraKit is built to be read and understood, not just used. Every architectural decision has a reason behind it.

---

## Tech Stack

| Layer       | Technology                |
| ----------- | ------------------------- |
| Backend     | Laravel 12, PHP 8.3       |
| Frontend    | React 19, TypeScript      |
| Bridge      | Inertia.js                |
| Styling     | Tailwind CSS, shadcn/ui   |
| Auth        | Laravel Fortify, Sanctum  |
| Permissions | Spatie Laravel Permission |
| Media       | Spatie Media Library      |
| Activity    | Spatie Activity Log       |
| Queue       | Redis + Laravel Horizon   |
| Icons       | Lucide React              |
| Testing     | Pest                      |

---

## Architecture

LaraKit enforces a strict layered architecture. Every layer has exactly one responsibility.

```
Route → Controller → Service → Repository → Model
```

```
Controller   →  HTTP only (receive request, return response)
Service      →  Business logic and protection rules
Repository   →  Database queries only
FormRequest  →  Validation rules
Enum         →  Type-safe constants
Trait        →  Reusable model behaviour
Event        →  Something happened in the system
Listener     →  React to an event (queued)
Notification →  Alert users through multiple channels
Job           →  Async task processing
Resource      →  Transform models for API output
```

This separation makes the codebase testable, swappable and easy to reason about.
Controllers stay thin. Business rules live in one place.

---

## Features

### Authentication & Authorization

- Laravel Fortify (login, logout, 2FA ready)
- Role-based access control via Spatie Permission
- Four roles: `super_admin`, `admin`, `editor`, `viewer`
- `EnsureUserIsAdmin` middleware on all admin routes
- Fine-grained protection rules:
    - Super admin cannot be edited by anyone except themselves
    - Admins cannot edit other admins
    - Nobody can change their own role or deactivate themselves
    - Only super_admin can create admin accounts

### Roles & Permissions UI Manager

- Manage roles directly from the panel
- Assign and revoke permissions per role
- Permission changes reflected immediately without re-seeding

### Users Module

- Full CRUD with pagination
- Search by name/email (debounced)
- Filter by role and status
- Soft delete with trash / restore / force delete
- Avatar upload via Spatie Media Library
- Role assignment with permission-based restrictions
- Activity logging on all mutations

### Dashboard

- Stats: Total Users, Active, Inactive, Trashed, Activity count
- All cards link to relevant filtered pages

### Site Settings

- Key-value store with default settings
- Grouped tabs: General, Social, SEO, Mail
- Dynamic input types: text, email, url, textarea, file, boolean, color
- Logo, favicon, OG image via Media Library
- Cache-driven (1h TTL, invalidated on change)

### Activity Log

- Full audit trail: who, what, which model, old → new values
- Filter by event type (created / updated / deleted / restored) and model
- Pagination with filter preservation
- Relative timestamps

### Events, Listeners & Queues

- `UserCreated` event fired on new user creation
- `SendWelcomeEmail` listener - queued, sends `WelcomeEmail` mailable
- `NotifyAdminsOfNewUser` listener - queued, notifies all admins
- Redis-backed queue for all async processing
- Laravel Horizon - real-time queue monitoring dashboard

### Notifications

- In-app bell icon with unread count badge
- Dropdown list of recent notifications
- Mark as read / mark all as read
- Click navigates directly to the relevant resource
- Database + email channels, fully queued

### System

- Login History - last login timestamp, IP address and user agent tracked per user, displayed on edit page
- 403 error page with logout button

### Code Quality

- Pint - Laravel code formatter configured, `strict_types=1` enforced across all PHP files
- Docblocks - every class and public method documented
- N+1 Protection - `preventLazyLoading()` in development, DB indexes on performance-critical columns
- Telescope - query, request, mail and job inspection dashboard at `/telescope`

### UI / UX

- Dark / light mode
- Fully responsive - mobile horizontal scroll on tables
- Flash messages with timestamp-based re-triggering
- Confirmation dialogs for destructive actions

---

## Coming Soon

### Content

- Posts Module - full CRUD with categories, tags, TipTap rich text editor, SEO fields, draft/published/scheduled status, featured image, soft delete, activity logging, multilingual content (EN + KA), PDF export, Excel export

### API

- API Layer - Sanctum token management, versioned API (v1/), API Resources, rate limiting on all endpoints, health check endpoint, Postman collection

### Quality

- Pest Test Suite - full coverage (auth, users, settings,notifications, API),`Mail::fake()`, `Notification::fake()`, `Queue::fake()`

### Advanced

- Security Hardening - rate limiting on login, OWASP basics, Sentry error tracking
- Cache / Maintenance Panel - clear config/route/view cache, maintenance mode toggle, system info
- Global Search - Ctrl+K across users, settings, posts
- Role-Based Sidebar Visibility - editors see only content modules

### Deployment

- Docker - `docker-compose.yml` with app, MySQL, Redis, Horizon
- GitHub Actions CI/CD - run Pest and Pint on every push, deploy on merge to main
- Deployment guides - VPS and Vultr, `.env.example` fully documented, production checklist

---
