# 🔧 FixMate
### Smart Device & Home Appliance Repair Service Platform

A full-stack web application that connects customers with professional technicians for smart device and home appliance repair services.

Customers can explore repair services, submit booking requests, track repair progress, and make secure online payments. Technicians can manage their services and booking requests, while administrators oversee users, services, bookings, and platform activities.

<p align="center">
  <a href="https://fixmate-client-wheat.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Website-Visit%20FixMate-blue?style=for-the-badge" alt="Live Website" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6.0.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js" alt="Node.js" />
</p>

---

## 🌐 Live Demo & Repositories

| Resource | Link |
|---|---|
| Live Website | [FixMate Client](https://fixmate-client-wheat.vercel.app/) |
| Live Server | [Backend API](https://fixmate-server-bay.vercel.app/) |
| Client Repository | [GitHub Repository](https://github.com/devnadiaa/fixmate-client) |
| Server Repository | [GitHub Repository](https://github.com/devnadiaa/fixmate-server) |

---

## 🔐 Demo Credentials

Use the following accounts to explore the application with different user roles.

| Role | Email | Password |
|---|---|---|
| Admin | admin@fixmate.com | FixMate123 |
| Customer | customer@fixmate.com | FixMate123 |
| Technician | technician@fixmate.com | FixMate123 |
| Technician | technician2@fixmate.com | FixMate123 |

**Note:** These accounts are provided for demonstration and project evaluation.

---

## 📖 Project Overview

FixMate is designed to simplify the process of finding and booking reliable repair services.

The platform provides three different user roles:

- **Customer:** Finds repair services, books technicians, tracks repairs, and makes payments.
- **Technician:** Creates repair service listings and manages customer booking requests.
- **Admin:** Manages users, approves services, and oversees platform activities.

Each role has a dedicated dashboard and access to role-specific features.

---

## ✨ Key Features

### 👤 Customer Dashboard

- Register and log in using email/password or Google authentication.
- Browse approved repair services.
- Search, filter, sort, and paginate service listings.
- View detailed service information and technician profiles.
- Submit repair booking requests.
- Track booking status and repair progress.
- Cancel eligible booking requests.
- Make secure Stripe payments after service completion.
- View payment history.
- Download payment invoices.
- Submit ratings and reviews for completed bookings.
- Update profile information.

### 🛠️ Technician Dashboard

- Access a dedicated technician dashboard.
- Add new repair services with image uploads.
- Submit services for administrator approval.
- Manage personal service listings.
- Filter services by Pending, Approved, Rejected, and All.
- View customer booking requests.
- Accept or reject eligible booking requests.
- Update repair progress.
- Set the final repair amount after completing a service.

### 🛡️ Admin Dashboard

- View platform statistics and dashboard summaries.
- Manage registered users.
- Change user roles.
- Manage technician service listings.
- Filter services by different criteria.
- Approve or reject submitted services.
- Monitor booking information.
- View transaction and revenue information.

---

## 🔄 Booking Workflow

The platform follows a structured repair booking process.

```text
Customer Browses Services
          |
          ▼
Selects a Repair Service
          |
          ▼
Submits Booking Request
          |
          ▼
Technician Reviews Request
          |
     ┌────┴────┐
     ▼         ▼
  Accepted   Rejected
     |
     ▼
  In Progress
     |
     ▼
  Completed
     |
     ▼
Customer Makes Payment
     |
     ▼
Stripe Payment Verification
     |
     ▼
Payment Completed
```

The booking timeline maintains a history of important events, including booking creation, cancellation, technician status updates, and successful payment.

---

## 💳 Payment Integration

FixMate integrates Stripe for secure online payment processing.

- Stripe Checkout integration.
- Payment is available after booking completion.
- Server-side payment verification.
- Payment ownership validation.
- Stripe webhook integration.
- Duplicate webhook event prevention.
- Payment history.
- Downloadable PDF invoices.

---

## 🔒 Authentication & Security

- Better Auth authentication.
- Google authentication support.
- JWT-based API authentication.
- Server-side token verification.
- Role-based authorization.
- Protected API routes.
- Environment variables for sensitive configuration.
- Server-side booking status validation.
- Payment ownership verification.
- Secure Stripe webhook handling.

---

## 🔎 Search, Filtering & Pagination

FixMate provides server-side data management for service listings.

- Keyword-based search.
- Service mode filtering.
- Rating-based sorting.
- High-to-low rating sorting.
- Low-to-high rating sorting.
- Server-side pagination.

---

## 🌙 Additional Features

- Responsive design for mobile, tablet, and desktop.
- Dark mode and light mode.
- Job timeline tracker with booking status history.
- Image uploads using ImgBB.
- Toast notifications.
- Loading states.
- Error handling pages.
- Custom Not Found page.
- PDF invoice generation.
- Role-specific dashboards.

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | UI development |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Better Auth | Authentication |
| Lucide React | Icons |
| Recharts | Dashboard charts |
| React Hot Toast | Notifications |
| React Toastify | Toast notifications |
| jsPDF | PDF generation |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | Backend framework |
| MongoDB | Database |
| Better Auth | Authentication |
| JWT / jose | Token verification |
| Stripe | Payment processing |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |

### Deployment & External Services

- Vercel — Application deployment.
- MongoDB Atlas — Cloud database.
- Stripe — Online payment processing.
- ImgBB — Image hosting.
- Google OAuth — Social authentication.

---

## 🗄️ Database Collections

FixMate uses four main application collections.

| Collection | Description |
|---|---|
| `users` | Stores user information and role details. |
| `services` | Stores repair service information. |
| `bookings` | Stores customer booking requests and status history. |
| `payments` | Stores payment transaction information. |

---

## 📁 Project Structure

FixMate is maintained in two separate GitHub repositories.

### 1. Client — Next.js Application

**Repository:** [fixmate-client](https://github.com/devnadiaa/fixmate-client)

```text
fixmate-client/
│
├── public/                 # Static assets
│
├── src/                    # Application source code
│
├── .gitignore              # Git ignored files
├── AGENTS.md               # Project instructions
├── eslint.config.mjs       # ESLint configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

### 2. Server — Express.js Application

**Repository:** [fixmate-server](https://github.com/devnadiaa/fixmate-server)

```text
fixmate-server/
│
├── src/
│   └── index.js            # Server entry point
│
├── .gitignore              # Git ignored files
├── package.json            # Dependencies and scripts
└── package-lock.json       # Dependency lock file
```

---

## ⚙️ Installation & Setup Guide

Follow these steps to run FixMate locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- MongoDB Atlas account or a MongoDB database
- Stripe account
- ImgBB API key
- Google OAuth credentials (for Google login)

### Step 1: Clone the Client Repository

```bash
git clone https://github.com/devnadiaa/fixmate-client.git

cd fixmate-client
```

### Step 2: Install Client Dependencies

```bash
npm install
```

### Step 3: Configure Client Environment Variables

Create a `.env` file in the client root directory.

```env
NEXT_PUBLIC_BACKEND_URL=your_backend_url
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

For local development, use your local backend URL for `NEXT_PUBLIC_BACKEND_URL`.

### Step 4: Start the Client

```bash
npm run dev
```

Open your browser and visit:

http://localhost:3000

### Step 5: Clone the Server Repository

Open another terminal.

```bash
git clone https://github.com/devnadiaa/fixmate-server.git

cd fixmate-server
```

### Step 6: Install Server Dependencies

```bash
npm install
```

### Step 7: Configure Server Environment Variables

Create a `.env` file in the server root directory.

```env
PORT=your_port
CLIENT_URL=your_client_url

MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=your_backend_url

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace the placeholder values with your actual configuration.

### Step 8: Start the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

Make sure the client and server environment variables point to the correct URLs.

---

## 📜 Available Scripts

### Client Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates a production build. |
| `npm start` | Starts the production server. |
| `npm run lint` | Runs ESLint checks. |

### Server Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the server using Nodemon. |
| `npm start` | Starts the production server. |

---

## 📦 Complete NPM Dependencies

The following package names and versions are taken from the Client and Server `package.json` files.

### Client Dependencies

| Package | Version |
|---|---|
| `better-auth` | ^1.7.25 |
| `jspdf` | ^4.2.1 |
| `lucide-react` | ^1.74.0 |
| `next` | 16.4.6 |
| `react` | 19.3.0 |
| `react-dom` | 19.3.0 |
| `react-hot-toast` | ^2.6.1 |
| `react-toastify` | ^11.2.0 |
| `recharts` | ^3.11.0 |

### Client DevDependencies

| Package | Version |
|---|---|
| `@tailwindcss/turbopack` | 4.3.3 |
| `@types/node` | ^26.6.6 |
| `@types/react` | ^19.3.0 |
| `eslint` | ^9 |
| `eslint-config-next` | 16.4.6 |
| `tailwindcss` | 4.3.3 |
| `typescript` | ^6.0.3 |

### Server Dependencies

| Package | Version |
|---|---|
| `@better-auth/mongo-adapter` | ^1.7.25 |
| `better-auth` | ^1.7.25 |
| `cors` | ^2.8.6 |
| `dotenv` | ^18.0.10 |
| `express` | ^5.3.0 |
| `jose` | ^6.2.17 |
| `jsonwebtoken` | ^9.0.3 |
| `mongodb` | ^7.9.0 |
| `stripe` | ^23.1.0 |

### Server DevDependencies

| Package | Version |
|---|---|
| `nodemon` | ^3.1.14 |

---

## 📱 Responsive Design

FixMate is designed to provide a consistent experience across different screen sizes.

The interface supports:

- Desktop screens.
- Tablet screens.
- Mobile devices.

Navigation, service cards, dashboards, forms, and other interface elements adapt to different screen sizes.

---

## 🚀 Deployment

The project is deployed using Vercel.

| Application | Deployment |
|---|---|
| Client | [FixMate Live Website](https://fixmate-client-wheat.vercel.app/) |
| Server | [FixMate Live API](https://fixmate-server-bay.vercel.app/) |

The deployed application uses environment variables to configure API connections, authentication, database access, and payment services.

---

## 👩‍💻 Author

**Nadia Akter**

AI-Driven Full Stack Web Engineer in Training

- GitHub: [devnadiaa](https://github.com/devnadiaa)
- Portfolio: [Nadia's Portfolio](https://nadia-portfolio-omega.vercel.app/)

---

<p align="center">
  <strong>FixMate — Making Repair Services Easier, Smarter, and More Accessible.</strong>
  <br />
  🔧
</p>