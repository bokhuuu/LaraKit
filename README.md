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
| Auth        | Laravel Fortify           |
| Permissions | Spatie Laravel Permission |
| Media       | Spatie Media Library      |
| Activity    | Spatie Activity Log       |
| Icons       | Lucide React              |

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
```

This separation makes the codebase testable, swappable and easy to reason about. Controllers stay thin. Business rules live in one place.

---

## Features

### Authentication & Authorization

- ✅ Laravel Fortify (login, logout, 2FA ready)
- ✅ Role-based access control via Spatie Permission
- ✅ Four roles: `super_admin`, `admin`, `editor`, `viewer`
- ✅ `EnsureUserIsAdmin` middleware on all admin routes
- ✅ Fine-grained protection rules (super admin cannot be edited by others, admins cannot edit admins, nobody deactivates themselves)
- ✅ Roles & Permissions UI Manager - manage roles and assign permissions from the panel

### Users Module

- ✅ Full CRUD with pagination
- ✅ Search by name/email (debounced)
- ✅ Filter by role and status
- ✅ Soft delete with trash / restore / force delete
- ✅ Avatar upload via Spatie Media Library
- ✅ Activity logging on all mutations

### Dashboard

- ✅ Stats: Total Users, Active, Inactive, Trashed, Activity count
- ✅ All cards link to relevant filtered pages

### Site Settings

- ✅ Key-value store with 18 default settings
- ✅ Grouped tabs: General, Social, SEO, Mail
- ✅ Dynamic input types: text, email, url, textarea, file, boolean, color
- ✅ Logo, favicon, OG image via Media Library
- ✅ Cache-driven (1h TTL, invalidated on change)

### Activity Log

- ✅ Full audit trail: who, what, which model, old → new values
- ✅ Filter by event type and model
- ✅ Pagination with filter preservation

### System

- ✅ Events & Listeners - `UserCreated` → `SendWelcomeEmail`
- ✅ Jobs & Queues - async email processing via Redis, Laravel Horizon for monitoring
- ✅ Mailable - `WelcomeEmail` sent on user creation via queued listener

### UI / UX

- ✅ Dark / light mode
- ✅ Fully responsive - mobile horizontal scroll on tables
- ✅ Flash messages with timestamp-based re-triggering
- ✅ Confirmation dialogs for destructive actions

---

### Coming Soon

- ⬜ Notifications - in-app bell, email, database notifications
- ⬜ Posts Module - full CRUD with categories, tags, TipTap editor, SEO fields, scheduling
- ⬜ API Layer - Sanctum token management, versioned API, rate limiting
- ⬜ Login History - last login, IP tracking
- ⬜ Global Search - Ctrl+K across all modules
- ⬜ Pest Test Suite - full coverage, CI-ready
- ⬜ Docker + GitHub Actions CI/CD
