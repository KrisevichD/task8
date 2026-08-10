# CRM Employee & CV Management System

A modern web application for managing employees, their skills and languages, and creating professional CVs with PDF export functionality.

---

## 📋 Features

### 🔐 Authentication & Authorization

* User login and registration
* Access token rotation
* Password reset

### 👥 Employee Management

* Browse employees
* Search employees
* Sort employees by department
* View and edit employee profiles
* Upload profile avatars
* Manage employee skills

  * Add skills
  * Update proficiency levels
  * Remove skills
* Manage employee languages

  * Add languages
  * Update proficiency levels
  * Remove languages

### 📄 CV Management

* Browse CVs
* Search CVs
* Sort CVs by name
* View detailed CV information
* Edit general CV information
* Manage CV skills

  * Add skills
  * Update proficiency levels
  * Remove skills
* Manage projects

  * Add projects
  * Update project responsibilities
  * Remove projects
* Preview CVs
* Export CVs to PDF

### ⚙️ Settings

* Change interface language

  * 🇬🇧 English
  * 🇷🇺 Russian
* Change application theme

  * Light
  * Dark
  * System

---

## 🛠️ Tech Stack

### Core

* **Next.js 15**
* **React 19**
* **TypeScript**

### API & State Management

* **Apollo Client**
* **GraphQL**
* **RxJS**

### Forms & Validation

* **React Hook Form**

### UI & Styling

* **Tailwind CSS v4**
* **shadcn/ui**
* **Base UI**
* **Lucide React**
* **Sonner**

### Utilities

* **clsx**
* **tailwind-merge**
* **class-variance-authority**
* **js-cookie**
* **jwt-decode**

### Testing

* **Vitest**
* **React Testing Library**
* **@testing-library/react**
* **@testing-library/user-event**
* **@testing-library/dom**

### Code Quality

* **ESLint 9**
* **Prettier**

---

## 📁 Project Structure

The project follows a modular architecture that keeps business logic, UI components, and shared functionality separated.

```text
├── app/          # Next.js App Router (pages and routing)
├── components/   # Reusable UI components (Shadcn, forms, etc.)
├── constants/    # Global application constants
├── contents/     # Page-level content modules (employees, CVs, etc.)
├── context/      # React contexts (e.g., Language context)
├── graphql/      # GraphQL queries, mutations, and schemas (Apollo Client)
├── hooks/        # Custom React hooks (auth, CV management, forms)
├── provider/     # Application providers (Theme, Apollo, Auth)
├── public/       # Static assets (images, icons)
├── shared/       # Shared utility modules
├── types/        # TypeScript types and interfaces
└── utils/        # Utility and helper functions  
└── ...
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js 20+**
* **npm**

### 1. Install dependencies

Clone the repository and install the project dependencies:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and add the required environment variables.

Example:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

> The exact environment variables depend on the backend configuration of the project.

### 3. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🏗️ Production

### Build the application

```bash
npm run build
```

### Start the production server

```bash
npm run start
```

---

## 🧪 Testing

The project uses **Vitest** and **React Testing Library** for testing components, hooks, utilities, and application logic.

### Run tests

Run all tests in watch mode:

```bash
npm run test
```

### Run tests once

Run all tests once without watch mode:

```bash
npm run test:run
```

This command is suitable for CI/CD environments.

### Open Vitest UI

Run tests with the Vitest interactive UI:

```bash
npm run test:ui
```

---

## 🔍 Code Quality

Run ESLint to check the codebase:

```bash
npm run lint
```

Format the project using Prettier:

```bash
npm run format
```

> Available scripts may vary depending on the project's `package.json`.

---

## 🌍 Localization

The application supports multiple interface languages:

* English (`EN`)
* Russian (`RU`)

Users can switch the application language through the settings.

---

## 🎨 Theme

The application supports three appearance modes:

* **Light**
* **Dark**
* **System**

The System option automatically follows the user's operating system preference.

---

## 📦 Build & Deployment

The application can be built using the standard Next.js production workflow:

```bash
npm run build
npm run start
```

For deployment, make sure all required environment variables are configured in the target environment.

---

## 🧪 Testing Strategy

The project uses different testing levels to ensure application reliability.

### Unit & Component Tests

Unit and component tests are used to verify individual pieces of functionality in isolation.

Examples include:

* Utility functions
* React components
* Form behavior
* Hooks
* Validation logic

---


## 📌 Project Status

The project is under active development. New features and improvements may be added over time.

---

## 📄 License

This project is intended for educational and development purposes.
