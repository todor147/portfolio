---
title: EduCoach
tagline: An educational coaching marketplace, re-engineered solo
description: A full-stack marketplace connecting learners with tutors and coaches — search, messaging, session booking, verified reviews and an admin panel. Originally a CS4116 group project; later re-engineered solo into a modern, secure, containerised application and redeployed end-to-end on a fully free cloud stack.
image: educoach.png
tags: ["php", "mysql", "bootstrap", "docker", "html", "css"]
stack: ["PHP 8.2", "MySQL / TiDB Cloud", "Bootstrap 5.3", "Docker", "Apache", "Render"]
githubUrl: https://github.com/todor147/CS4116_Group_1
liveUrl: https://cs4116-group-1.onrender.com
featured: true
order: 1
problem: "A two-sided educational marketplace that began as a CS4116 group build at UL. By the time I came back to it, the original InfinityFree host had been decommissioned, credentials were hardcoded across ~70 PHP pages, the admin login had a plaintext backdoor, and the UI hadn't aged well. The job: bring it back online — secure, modern, and fully free to run."
approach: "Re-architected the ~20,000-line PHP codebase around a single environment-driven config + PDO layer. Hardened security top-to-bottom (bcrypt, prepared statements, CSRF, secure session cookies, response headers, backdoor removed). Refreshed the UI with a Bootstrap 5.3 design system. Containerised the app (PHP 8.2 + Apache) and stood up a one-command `docker compose` dev stack. Deployed continuously from GitHub to Render with a TiDB Cloud Serverless MySQL-compatible database over TLS — zero-dollar production stack."
contribution: "Backend and system-architecture contributor on the original CS4116 team. Sole engineer for the modernisation and re-deployment — configuration, security, UI overhaul, Dockerisation, database migration, and production hosting."
learnings: "The first iteration was about getting it to work; the rebuild was about getting it to last. Splitting environment from code, removing every hardcoded credential, and treating security headers as default — not optional — is what turned a coursework artefact into a system I'd actually deploy. Also: free production infra exists, you just have to know where to look."
---

> A full-stack web marketplace connecting learners with expert tutors and coaches across maths, languages, sciences, music and coding — with search, direct messaging, session booking, verified reviews and admin moderation.

EduCoach is a two-sided educational marketplace. **Learners** discover coaches by subject, price and rating, message them directly, and book sessions. **Coaches** publish profiles with tiered service packages, manage availability, and build a reputation through verified reviews. A dedicated **admin** role handles users, moderation and platform oversight.

The project began as a CS4116 team build at the University of Limerick. I later returned to it solo and **fully re-engineered it** — modernising the codebase, hardening security, containerising it, and bringing it back online end-to-end on a zero-cost cloud stack after its original host had been decommissioned.

> **Live demo note:** the first load may take ~30s while the free-tier Render service wakes up.

## Key features

- **Role-based accounts** — learners, coaches and admins, with secure auth and per-role profiles.
- **Tiered service listings** — coaches publish Basic / Standard / Premium packages with custom pricing.
- **Inquiry → session flow** — learners send inquiries that convert into scheduled, tracked sessions.
- **Verified reviews** — only learners who completed a session can leave a review; coaches can respond.
- **Search & filtering** — by keyword, category, skill, price range and rating, with relevance scoring.
- **Messaging** — direct learner ↔ coach messaging, plus a privacy-respecting "customer insights" system that lets prospects hear from verified past clients.
- **Notifications** — in-app notifications with a live unread badge.
- **Admin panel** — user management, content + review moderation, and banned-word filtering.

## Engineering highlights

- **Re-engineered a ~20,000-line, ~70-page PHP application** around a clean, environment-driven configuration layer — eliminating hardcoded credentials and duplicated database logic in favour of a single PDO connection that runs unchanged across local, Docker and cloud environments.
- **Security hardening** — bcrypt password hashing, prepared statements throughout, CSRF-protected authentication, secure session cookies (`HttpOnly` / `SameSite` / `Secure`), security response headers, and removal of a legacy plaintext admin backdoor.
- **22-table relational schema** covering users, coaches, skills, availability, service tiers, inquiries, sessions, reviews, messaging and moderation — full foreign-key integrity.
- **Custom Bootstrap 5.3 design system** — design tokens, typography, reusable components — refreshed the entire site from a single shared layout.
- **Containerised with Docker** (PHP 8.2 + Apache) and a one-command `docker compose` dev stack: app + MySQL + Adminer, with the schema auto-imported on first run.
- **Deployed for free, end-to-end** — continuous deploys from GitHub to **Render** (Docker web service), backed by a **TiDB Cloud Serverless** MySQL-compatible database over TLS. Pushes to `main` auto-deploy.

## Outcome

A dated, offline coursework project transformed into a secure, modern, fully functional web application — live, continuously deployed, and running on a completely free production stack.
