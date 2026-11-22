<div align="center">

# 🔧 FixMate

### Smart Device & Home Appliance Repair Service Platform

**Find Services · Book Technicians · Track Repairs · Pay Securely**

A full-stack web application that connects customers with professional technicians for smart device and home appliance repair services.

Customers can explore repair services, submit booking requests, track repair progress, and make secure online payments. Technicians can manage their services and booking requests, while administrators oversee users, services, bookings, and platform activities.

<br />

[![Live Website](https://img.shields.io/badge/🌐_Live_Website-Visit_FixMate-7C3AED?style=for-the-badge)](https://fixmate-client-wheat.vercel.app/)
[![Client Repository](https://img.shields.io/badge/Client-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/devnadiaa/fixmate-client)
[![Server Repository](https://img.shields.io/badge/Server-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/devnadiaa/fixmate-server)

<br />

![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI_Assistant-8E75B2?style=flat-square&logo=googlegemini)

</div>

---

## 🌐 Live Demo & Repositories

Explore the deployed application and source code.

| Resource | Link |
|---|---|
| 🌍 Live Website | [FixMate Client](https://fixmate-client-wheat.vercel.app/) |
| ⚙️ Live Server | [Backend API](https://fixmate-server-bay.vercel.app/) |
| 💻 Client Repository | [GitHub Repository](https://github.com/devnadiaa/fixmate-client) |
| 🖥️ Server Repository | [GitHub Repository](https://github.com/devnadiaa/fixmate-server) |

---

## 🔐 Demo Credentials

Use the following accounts to explore FixMate with different user roles.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixmate.com` | `FixMate123` |
| Customer | `customer@fixmate.com` | `FixMate123` |
| Technician | `technician@fixmate.com` | `FixMate123` |
| Technician 2 | `technician2@fixmate.com` | `FixMate123` |

> **Note:** These accounts are provided for demonstration and project evaluation.

---

## 📖 Project Overview

FixMate is a full-stack repair service platform designed to make finding and booking reliable smart device and home appliance repair services easier and more convenient.

Instead of searching for technicians manually, customers can explore available repair services, review service details, view technician information, and submit booking requests—all from one platform. FixMate also provides a structured booking and service management experience, connecting customers, technicians, and administrators in one place.

The application has three user roles:

| Role | Responsibility |
|---|---|
| 👤 Customer | Finds repair services, books technicians, tracks repairs, and makes payments. |
| 🛠️ Technician | Creates repair service listings and manages customer booking requests. |
| 🛡️ Admin | Manages users, approves services, and oversees platform activities. |

Each role has a dedicated dashboard with access to its own features and actions.

---

## ✨ Key Features

FixMate provides different features for Customers, Technicians, and Administrators. Each user can access the tools needed for their role.

### 👤 1. Customer Dashboard

The Customer Dashboard helps users find repair services, book technicians, and manage their repair activities.

| Feature | Explanation |
|---|---|
| 🔐 Authentication | Customers can create an account and log in using email and password or Google authentication. |
| 🔍 Browse Services | Explore repair services that have been approved by the Admin. |
| 🔎 Search Services | Search for a particular repair service using keywords. |
| 🎯 Filter Services | Filter available services by service mode to find suitable options. |
| ⭐ Sort by Rating | Arrange services from highest to lowest rating or lowest to highest rating. |
| 📄 Pagination | Browse service listings page by page instead of loading everything at once. |
| 📋 Service Details | View service descriptions, prices, estimated duration, service information, and technician profiles. |
| 📅 Book a Service | Select a repair service and submit a booking request to the technician. |
| 📍 Track Booking | Check the current booking status and follow the repair progress. |
| ❌ Cancel Booking | Cancel a booking when its current status allows cancellation. |
| 💳 Online Payment | Pay securely through Stripe after the technician completes the repair. |
| 🧾 Payment History | View previous payment records from the customer dashboard. |
| 📄 Download Invoice | Generate and download a PDF invoice for a completed payment. |
| ⭐ Submit Reviews | Give a rating and write feedback after a booking has been completed. |
| 👤 Profile Management | Update personal profile information. |

### 🛠️ 2. Technician Dashboard

The Technician Dashboard allows repair professionals to publish their services and manage customer booking requests.

| Feature | Explanation |
|---|---|
| 📊 Technician Dashboard | Access a dedicated workspace for managing services and repair jobs. |
| ➕ Create Services | Add a new repair service with its details, description, price, and estimated duration. |
| 🖼️ Image Upload | Upload service images using ImgBB so customers can view the service. |
| 📩 Service Approval | Submit a service listing to the Admin for approval before it becomes available to customers. |
| 🗂️ Manage My Services | View and manage service listings created by the signed-in technician. |
| 🔎 Service Status Filter | Filter personal services by Pending, Approved, Rejected, or All. |
| 📥 Booking Requests | View booking requests submitted by customers for the technician's services. |
| ✅ Accept Requests | Accept eligible booking requests to proceed with the repair. |
| ❌ Reject Requests | Reject eligible booking requests when the technician cannot provide the service. |
| 🔄 Update Repair Progress | Update the booking as the repair moves through its available work stages. |
| 🏁 Complete Service | Mark a repair job as completed when the work is finished. |
| 💰 Final Repair Amount | Set the final amount for a completed repair as part of the completion workflow. |

### 🛡️ 3. Admin Dashboard

The Admin Dashboard provides tools to manage users, review service listings, and monitor platform activities.

| Feature | Explanation |
|---|---|
| 📊 Dashboard Overview | View platform statistics and important dashboard summaries. |
| 👥 Manage Users | View registered users and manage their accounts. |
| 🔄 Change User Roles | Change a user's role when necessary, such as Customer, Technician, or Admin. |
| 🔧 Manage Services | View service listings submitted by technicians. |
| 🔎 Filter Services | Find service listings using the available filters. |
| ✅ Approve Services | Approve submitted services so they can become available to customers. |
| ❌ Reject Services | Reject service listings that should not be published. |
| 📅 Monitor Bookings | View booking information and monitor repair activities. |
| 💳 Payment Information | View available transaction and revenue information through the Admin interface. |

### 🤖 4. AI-Powered FixMate Assistant

FixMate includes an AI chat assistant powered by the **Google Gemini API**.

The assistant helps signed-in users understand the platform, find relevant repair services, and get general troubleshooting guidance.

| Feature | Explanation |
|---|---|
| 💬 AI Chat Assistant | Users can ask questions through a floating chat interface available in the application. |
| 👤 Role-Based Guidance | Provides relevant answers based on whether the signed-in user is a Customer, Technician, or Admin. |
| 🛍️ Customer Support | Explains how to browse services, submit bookings, track repairs, make payments, and use other customer features. |
| 🛠️ Technician Support | Helps technicians understand service listings, approval, booking requests, and repair workflows. |
| 🛡️ Admin Support | Explains user management, service approval, booking oversight, and available Admin features. |
| 🔍 Service Recommendations | Uses approved and available service information from the FixMate database to recommend relevant repair services. |
| 🔧 Repair Troubleshooting | Provides general troubleshooting suggestions for common device and appliance problems. |
| 🌐 Language-Aware Replies | Responds in the language used by the user where supported. |
| 🔒 Privacy Protection | Refuses requests for another customer's private account or booking information. |
| ⚠️ Safety Guidance | Avoids dangerous repair instructions and recommends professional help for potentially hazardous problems. |

> **Important:** The AI Assistant provides information and guidance. It does not independently create bookings, process payments, or perform administrative actions.

---

## 🔄 Booking Workflow

FixMate follows a structured booking process so customers and technicians can manage repair requests clearly.

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

FixMate integrates **Stripe** for secure online payment processing.

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

FixMate uses authentication and authorization mechanisms to protect user accounts and application data.

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
- Protected AI Assistant API with authentication and role validation.

---

## 🔎 Search, Filtering & Pagination

FixMate provides server-side data management to help users find relevant repair services.

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
- Floating AI chat assistant.

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
| Google Gemini API | AI Assistant |
| `@google/genai` | Gemini SDK |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |

### Deployment & External Services

| Service | Purpose |
|---|---|
| Vercel | Application deployment |
| MongoDB Atlas | Cloud database |
| Stripe | Online payment processing |
| ImgBB | Image hosting |
| Google OAuth | Social authentication |
| Google AI Studio | Gemini API key management |

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
- Google Gemini API key (for the AI Assistant)

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

GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your actual configuration.

**Note:** The Gemini API key is required for the AI Assistant.

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

The following package names and versions are based on the original project documentation.

### Client Dependencies

| Package | Version |
|---|---|
| `better-auth` | `^1.7.25` |
| `jspdf` | `^4.2.1` |
| `lucide-react` | `^1.74.0` |
| `next` | `16.4.6` |
| `react` | `19.3.0` |
| `react-dom` | `19.3.0` |
| `react-hot-toast` | `^2.6.1` |
| `react-toastify` | `^11.2.0` |
| `recharts` | `^3.11.0` |

### Client DevDependencies

| Package | Version |
|---|---|
| `@tailwindcss/turbopack` | `4.3.3` |
| `@types/node` | `^26.6.6` |
| `@types/react` | `^19.3.0` |
| `eslint` | `^9` |
| `eslint-config-next` | `16.4.6` |
| `tailwindcss` | `4.3.3` |
| `typescript` | `^6.0.3` |

### Server Dependencies

| Package | Version |
|---|---|
| `@better-auth/mongo-adapter` | `^1.7.25` |
| `better-auth` | `^1.7.25` |
| `cors` | `^2.8.6` |
| `dotenv` | `^18.0.10` |
| `express` | `^5.3.0` |
| `jose` | `^6.2.17` |
| `jsonwebtoken` | `^9.0.3` |
| `mongodb` | `^7.9.0` |
| `stripe` | `^23.1.0` |
| `@google/genai` | Google Gemini SDK |

### Server DevDependencies

| Package | Version |
|---|---|
| `nodemon` | `^3.1.14` |

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

The deployed application uses environment variables to configure API connections, authentication, database access, payment services, and Gemini AI integration.

**Security:** Never commit real API keys, database credentials, authentication secrets, or Stripe secrets to GitHub.

---

## 👩‍💻 Author

<div align="center">

### Nadia Akter

**AI-Driven Full Stack Web Engineer in Training**

<br />

[![GitHub](https://img.shields.io/badge/GitHub-devnadiaa-181717?style=for-the-badge&logo=github)](https://github.com/devnadiaa)

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-7C3AED?style=for-the-badge&logo=vercel)](https://nadia-portfolio-omega.vercel.app/)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/nadia-akter-662992442/)

</div>

---

<div align="center">

### 🔧 FixMate

**Making Repair Services Easier, Smarter, and More Accessible.**

Built with modern technologies and a focus on solving real-world problems.

⭐ If you find this project interesting, consider giving it a star!

</div>