# 📱 Mobile Fix Lab

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-8B5CF6)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12.7.0-FFCA28?logo=firebase)
![License](https://img.shields.io/badge/license-MIT-green)

**A premium, modern Point of Sale (POS) system for mobile repair shops**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 🌟 Overview

Mobile Fix Lab is a state-of-the-art enterprise POS system designed specifically for mobile repair shops. Built with cutting-edge web technologies, it offers a sleek, glassmorphic UI with real-time data synchronization, comprehensive inventory management, and advanced analytics.

### ✨ Key Highlights

- 🎨 **Premium UI/UX** - Glassmorphism design with nebula purple gradient theme
- ⚡ **Real-time Sync** - Firebase Firestore for instant data updates across devices
- 📊 **Advanced Analytics** - Interactive charts and comprehensive sales insights
- 💰 **Money Transfer Tracking** - JazzCash, EasyPaisa, and custom payment methods
- 📄 **PDF Export** - Professional sales reports with one click
- 🔒 **Secure Access** - PIN-based authentication system
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🎭 **Smooth Animations** - GSAP-powered transitions and micro-interactions

---

## 🚀 Features

### 📦 Inventory Management
- Add, edit, and delete products with real-time updates
- Low stock alerts and tracking
- Search and filter functionality
- Stock level monitoring with visual indicators

### 💳 Point of Sale Terminal
- Fast checkout process with custom pricing
- Shopping cart with quantity management
- Real-time stock validation
- Instant sale processing with optimistic updates

### 📈 Sales History & Analytics
- Comprehensive transaction history
- Daily, weekly, and all-time revenue tracking
- Top-selling products analysis
- Transaction voiding with stock restoration
- PDF export for sales reports

### 💸 Money Transfer Management
- Track JazzCash and EasyPaisa transactions
- Support for custom payment methods
- Send/Receive transaction categorization
- Transaction voiding capability
- Real-time balance calculations

### 📊 Dashboard
- Live revenue statistics
- Inventory value tracking
- Top products showcase
- Recent transactions overview
- Visual analytics with Chart.js

---

## 🎯 Demo

### Dashboard View
The main dashboard provides a comprehensive overview of your business metrics, including daily revenue, inventory status, and top-performing products.

### Terminal (POS)
Lightning-fast checkout experience with real-time stock validation and custom pricing options.

### Money Transfers
Track all digital payment transactions with detailed categorization and reporting.

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library with latest features
- **Vite 7.2.4** - Next-generation frontend tooling
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **GSAP 3.14.2** - Professional-grade animation library
- **Framer Motion 12.23.26** - Production-ready motion library

### Backend & Database
- **Firebase 12.7.0** - Real-time database and authentication
- **Firestore** - NoSQL cloud database

### UI Components & Icons
- **Lucide React 0.562.0** - Beautiful, consistent icons
- **Chart.js 4.5.1** - Flexible charting library
- **React Chart.js 2** - React wrapper for Chart.js

### Utilities
- **jsPDF 3.0.4** - PDF generation
- **jsPDF AutoTable 5.0.2** - Table generation for PDFs

---

## 📥 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase account

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mobile-fix-lab.git
   cd mobile-fix-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `src/firebase.js` file with your Firebase configuration:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🎮 Usage

### Default PIN
The default PIN to access the system is: **5555**

### Navigation
- **Dashboard** - Overview of business metrics
- **Inventory** - Manage products and stock levels
- **Terminal** - Process sales and checkouts
- **History** - View and export sales records
- **Transfers** - Track money transfer transactions

### Adding Products
1. Navigate to Inventory
2. Click "Add Device"
3. Enter product name, price, and stock quantity
4. Click "Add Product"

### Processing Sales
1. Navigate to Terminal
2. Search and select products
3. Set custom sale price
4. Add to cart
5. Click "Complete Sale"

### Recording Money Transfers
1. Navigate to Transfers
2. Click "New Transfer"
3. Select transfer type (Send/Receive)
4. Choose payment method
5. Enter amount and submit

### Exporting Reports
1. Navigate to History
2. Click "Export PDF"
3. PDF will be automatically downloaded

---

## 🎨 Design System

### Color Palette
- **Primary Purple**: `#8B5CF6` (Nebula Purple)
- **Secondary Pink**: `#EC4899` (Nebula Pink)
- **Accent Blue**: `#0EA5E9`
- **Background**: `#050505` (Deep Black)
- **Glass Panels**: `rgba(255, 255, 255, 0.04)` with backdrop blur

### Typography
- **Headings**: System font stack with bold weights
- **Body**: Sans-serif with medium weight
- **Monospace**: For numerical data and IDs

### Animations
- Smooth page transitions with GSAP
- Magnetic hover effects on navigation
- Toast notifications with slide-in animations
- Glassmorphic hover states

---

## 📁 Project Structure

```
mobile-fix-lab/
├── src/
│   ├── App.jsx              # Main application component
│   ├── firebase.js          # Firebase configuration
│   ├── index.css            # Global styles and animations
│   └── main.jsx             # Application entry point
├── public/
│   └── favicon.svg          # Application favicon
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

---

## 🔧 Configuration

### Tailwind Configuration
Custom colors are defined in `tailwind.config.js`:
```javascript
colors: {
  'nebula-purple': '#8B5CF6',
  'nebula-pink': '#EC4899',
  'nebula-dark': '#050505'
}
```

### Firebase Collections
- `stock` - Product inventory
- `sales` - Sales transactions
- `moneyTransfers` - Payment transfers

---

## 🚦 Performance

- **Optimistic UI Updates** - Instant feedback for all operations
- **Real-time Synchronization** - Firebase Firestore listeners
- **Code Splitting** - Vite's automatic code splitting
- **Lazy Loading** - Components loaded on demand
- **Memoization** - React.memo and useMemo for optimization

---

## 🔐 Security

- PIN-based authentication
- Session storage for auth state
- Firebase security rules (configure in Firebase Console)
- Input validation on all forms
- XSS protection with React's built-in sanitization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ahtisham Amjad**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Animations powered by [GSAP](https://greensock.com/gsap/)
- UI inspiration from modern design systems
- Firebase for backend infrastructure

---

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

<div align="center">

**Made with ❤️ for mobile repair shops worldwide**

⭐ Star this repo if you find it helpful!

</div>
