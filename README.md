# Mobile Fix Lab

A professional Point of Sale (POS) and inventory management system designed for mobile repair enterprises. Built with React 19 and Firebase, it features a high-performance glassmorphic interface with real-time data synchronization.

## Core Features

### Inventory & POS
- **Real-time Inventory**: Automated stock tracking with low-stock indicators.
- **Dynamic Terminal**: High-speed checkout with custom pricing and optimistic UI updates.
- **Sales Analytics**: Comprehensive revenue tracking and top-product performance metrics.

### Financial Management
- **Digital Wallet Tracking**: Specialized modules for JazzCash and EasyPaisa transactions.
- **Transaction History**: Detailed logs of all sales and money transfers with void capabilities.
- **Reporting**: Professional PDF generation for sales history and audits.

### Security & UX
- **Authentication**: Secure PIN-based access control.
- **Performance**: Optimized rendering with GSAP animations and Framer Motion.
- **Responsive Design**: Fully functional across mobile, tablet, and desktop devices.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: GSAP, Framer Motion
- **Backend**: Firebase Firestore
- **Utilities**: Chart.js, jsPDF

## Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/mobile-fix-lab.git
   cd mobile-fix-lab
   npm install
   ```

2. **Environment Setup**
   Configure your Firebase credentials in `src/firebase.js`.

3. **Run**
   ```bash
   npm run dev
   ```

## Usage

- **Access**: Default PIN is `5555`.
- **Management**: Use the Navigation Dock to switch between Dashboard, Inventory, Terminal, History, and Transfers.

## License

Distributed under the MIT License. See `LICENSE` for details.
