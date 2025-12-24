# Mobile Fix Lab

A professional Point of Sale (POS) and inventory management system designed for mobile repair enterprises. Built with React 19 and Firebase, it features a high-performance glassmorphic interface with real-time data synchronization and multi-user workspace isolation.

## Core Features

### Inventory & POS
- **Multi-user Workspaces**: Secure, isolated database for every shop owner linked to their Google Account.
- **Real-time Inventory**: Automated stock tracking with low-stock indicators.
- **Dynamic Terminal**: High-speed checkout with custom pricing and optimistic UI updates.
- **Sales Analytics**: Comprehensive revenue tracking and top-product performance metrics.

### Financial Management
- **Digital Wallet Tracking**: Specialized modules for JazzCash and EasyPaisa transactions.
- **Transaction History**: Detailed logs of all sales and money transfers with void capabilities.
- **Reporting**: Professional PDF generation for sales history and audits.

### Security & UX
- **Authentication**: Secure, one-click login via Google Sign-In.
- **Performance**: Optimized rendering with GSAP animations and Framer Motion.
- **Responsive Design**: Fully functional across mobile, tablet, and desktop devices.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: GSAP, Framer Motion
- **Backend**: Firebase Firestore & Authentication (Google Provider)
- **Utilities**: Chart.js, jsPDF

## Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/mobile-fix-lab.git
   cd mobile-fix-lab
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Firebase Configuration**
   - Enable **Google Sign-In** in the Firebase Console Authentication settings.
   - Create a Firestore Database in the Firebase Console.

4. **Run**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

When deploying to Vercel, Netlify, or any other host, you **must** authorize your domain in Firebase:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Authentication** > **Settings** > **Authorized domains**.
3.  Click **Add domain**.
4.  Enter your domain (e.g., `mobilefixlab.vercel.app`).
5.  Click **Add**.

*Without this step, Google Sign-In will fail with an unauthorized domain error.*

## Usage

- **Access**: Sign in using your Google Account. A private workspace is automatically created for you.
- **Management**: Use the Navigation Dock to switch between Dashboard, Inventory, Terminal, History, and Transfers.

## License

Distributed under the MIT License. See `LICENSE` for details.
