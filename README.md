# 🚀 Business Listing SaaS

A modern, SEO-friendly Business Listing platform built with Next.js 15,
React 19, Better Auth, Drizzle ORM and Supabase.

Live Demo • Documentation • Roadmap

![Next.js](...)
![React](...)
![TypeScript](...)
![License](...)
![PRs Welcome](...)

<p align="center">
<img src="/public/error.png" width="100%" />
</p>

# Features
⚡ Lightning Fast

🔒 Secure Authentication

🏢 Business Management

📍 Location Search

⭐ Reviews

📊 Analytics

🤖 AI Ready

📱 Responsive

# Tech Stack
Frontend
│
├── Next.js 15
├── React 19
├── Tailwind v4
└── Shadcn UI

Backend
│
├── Better Auth
├── Route Handlers
└── Server Actions

Database
│
├── Supabase
└── Drizzle ORM

Deployment
│
└── Vercel

# Architecture Diagram
```mermaid
graph TD

User --> Browser

Browser --> NextJS

NextJS --> BetterAuth

NextJS --> ServerActions

ServerActions --> Supabase

Supabase --> PostgreSQL

Supabase --> Storage
```


# Project Structure
src
│
├── app
├── components
├── actions
├── db
│     ├── schema
│     ├── migrations
│     └── index.ts
├── hooks
├── lib
├── providers
└── services


# Authentication Flow
```mermaid
sequenceDiagram

User->>Next.js: Login

Next.js->>Better Auth: Authenticate

Better Auth->>Database: Verify

Database-->>Better Auth: Success

Better Auth-->>User: Session Cookie
```


# Listing Flow

```mermaid
graph LR

User

-->

Create Listing

-->

Validation

-->

Database

-->

Business Published
```

# Search Flow 
```mermaid
graph TD

User

-->

Search

-->

Filters

-->

Query

-->

Supabase

-->

Results
```

# Folder Tree

📦 src
 ┣ 📂 app
 ┣ 📂 components
 ┣ 📂 db
 ┃ ┣ 📂 schema
 ┃ ┣ 📂 migrations
 ┃ ┗ 📜 index.ts
 ┣ 📂 actions
 ┣ 📂 hooks
 ┣ 📂 lib
 ┣ 📂 providers
 ┣ 📂 services
 ┗ 📂 types

 