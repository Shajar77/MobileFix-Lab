import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import {
  Codesandbox,
  TrendingUp,
  BarChart3,
  Zap,
  History,
  Search,
  AlertTriangle,
  Plus,
  Grid3X3,
  Layers,
  CreditCard,
  Activity,
  Trash2,
  Smartphone,
  Package,
  ChevronDown,
  Download,
  RotateCcw,
  Check,
  CheckCircle,
  AlertCircle,
  Minus,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  Delete,
  SearchX,
  Home,
  Box,
  Receipt,
  Clock,
  Wallet,
  LogOut,
  Mail,
  Lock,
  UserPlus
} from 'lucide-react';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';
import { gsap } from 'gsap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Toast = React.memo(({ id, msg, type, onRemove }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    const removeTimer = setTimeout(() => {
      onRemove(id);
    }, 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [id, onRemove]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 500);
  }, [id, onRemove]);

  return (
    <div
      className={`toast ${type === 'error' ? 'border-rose-500/50' : 'border-emerald-500/50'} ${isExiting ? 'animate-toast-out' : ''}`}
      style={{ animation: isExiting ? 'toast-out 0.5s cubic-bezier(0.4, 0, 1, 1) forwards' : undefined }}
    >
      {type === 'error' ? (
        <AlertCircle className="text-rose-500 w-5 h-5" />
      ) : (
        <CheckCircle className="text-emerald-500 w-5 h-5" />
      )}
      <span className="font-medium text-sm flex-1">{msg}</span>
      <button
        onClick={handleClose}
        className="ml-2 text-white/50 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
});

const App = () => {
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);
  const [moneyTransfers, setMoneyTransfers] = useState([]);
  const [cart, setCart] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [time, setTime] = useState(new Date());

  const [inventorySearch, setInventorySearch] = useState('');
  const [terminalSearch, setTerminalSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showMoneyTransferModal, setShowMoneyTransferModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [customPrice, setCustomPrice] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [expandedSales, setExpandedSales] = useState(new Set());

  const [transferType, setTransferType] = useState('send');
  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [customPaymentMethod, setCustomPaymentMethod] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const viewContainerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthorized(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      setStock([]);
      setSales([]);
      setMoneyTransfers([]);
      return;
    }

    const unsubscribeStock = onSnapshot(
      query(collection(db, "stock"), where("userId", "==", user.uid)),
      (snap) => {
        setStock(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        showToast("Sync Error: " + err.message, 'error');
      }
    );

    const unsubscribeSales = onSnapshot(
      query(collection(db, "sales"), where("userId", "==", user.uid)),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => b.time - a.time);
        setSales(data);
      }
    );

    const unsubscribeTransfers = onSnapshot(
      query(collection(db, "moneyTransfers"), where("userId", "==", user.uid)),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => b.time - a.time);
        setMoneyTransfers(data);
      }
    );

    return () => {
      unsubscribeStock();
      unsubscribeSales();
      unsubscribeTransfers();
    };
  }, [user]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const panels = document.querySelectorAll('.glass-panel');
      panels.forEach(panel => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        panel.style.setProperty('--mouse-x', `${x}px`);
        panel.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('.dock-item');
    const handlers = [];

    items.forEach(btn => {
      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      };
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      handlers.push({ btn, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ btn, onMove, onLeave }) => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [authorized]);

  useEffect(() => {
    if (viewContainerRef.current) {
      const target = viewContainerRef.current;
      const children = target.querySelectorAll('.glass-panel, .grid > div');

      gsap.fromTo(target,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );

      if (children.length) {
        gsap.fromTo(children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
      }
    }
  }, [activeView]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowProductModal(false);
        setShowPriceModal(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]:focus') || document.querySelector('input[type="text"]');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleGoogleLogin = async () => {
    setLoginError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showToast("Welcome back!");
    } catch (err) {
      setLoginError(err.message.replace('Firebase: ', ''));
      showToast("Login failed", 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Logged out successfully");
    } catch (err) {
      showToast("Logout failed", 'error');
    }
  };

  const switchView = (viewId) => {
    if (viewId === activeView) return;
    gsap.to(".canvas-view", {
      opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => {
        setActiveView(viewId);
      }
    });
  };

  const highlightText = (text, term) => {
    if (!text) return "";
    if (!term) return text;
    const parts = String(text).split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? <span key={i} className="highlight">{part}</span> : part
    );
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock'))
    };

    if (!data.name || data.name.trim() === '') {
      showToast("Please enter a product name", 'error');
      return;
    }
    if (isNaN(data.price) || data.price <= 0) {
      showToast("Price must be greater than 0", 'error');
      return;
    }
    if (isNaN(data.stock) || data.stock < 0) {
      showToast("Stock cannot be negative", 'error');
      return;
    }

    setShowProductModal(false);

    try {
      if (editItem) {
        setStock(prev => prev.map(item =>
          item.id === editItem.id ? { ...item, ...data } : item
        ));

        await updateDoc(doc(db, "stock", editItem.id), data);
        setEditItem(null);
        showToast("Device updated");
      } else {
        const tempId = 'temp_' + Date.now();
        const newItem = { id: tempId, ...data, time: Date.now() };
        setStock(prev => [...prev, newItem]);

        const docRef = await addDoc(collection(db, "stock"), { ...data, userId: user.uid, time: Date.now() });
        setStock(prev => prev.map(item =>
          item.id === tempId ? { ...item, id: docRef.id } : item
        ));
        showToast("Device added");
      }
    } catch (err) {
      if (editItem) {
        setStock(prev => prev.map(item =>
          item.id === editItem.id ? editItem : item
        ));
      } else {
        setStock(prev => prev.filter(item => !item.id.startsWith('temp_')));
      }
      showToast("Failed to save: " + err.message, 'error');
      setShowProductModal(true);
    }
  };

  const deleteUnit = async (id) => {
    if (!window.confirm("Permanently delete this item?")) return;

    const deletedItem = stock.find(item => item.id === id);
    setStock(prev => prev.filter(item => item.id !== id));
    showToast("Item deleted");

    try {
      await deleteDoc(doc(db, "stock", id));
    } catch (err) {
      if (deletedItem) {
        setStock(prev => [...prev, deletedItem]);
      }
      showToast("Failed to delete: " + err.message, 'error');
    }
  };

  const voidSale = async (id) => {
    if (window.confirm("Void this transaction? This will restore stock levels.")) {
      try {
        const sale = sales.find(s => s.id === id);
        if (!sale) return;

        for (const item of sale.items) {
          const productRef = doc(db, "stock", item.id);
          const currentProduct = stock.find(p => p.id === item.id);
          if (currentProduct) {
            await updateDoc(productRef, { stock: currentProduct.stock + item.qty });
          }
        }
        await deleteDoc(doc(db, "sales", id));
        showToast("Transaction voided and stock restored.");
      } catch (err) {
        showToast("Failed to void sale: " + err.message, 'error');
      }
    }
  };

  const addToCart = (p) => {
    if (p.stock < 1) return showToast("Out of stock.", 'error');
    setPendingItem(p);
    setCustomPrice('');
    setShowPriceModal(true);
  };

  const confirmAddToCart = () => {
    const price = parseFloat(customPrice);
    if (!customPrice || customPrice.trim() === '') return showToast("Please enter a price", 'error');
    if (isNaN(price) || price <= 0) return showToast("Price must be greater than 0", 'error');

    const p = pendingItem;
    const totalInCart = cart.filter(c => c.id === p.id).reduce((s, x) => s + x.qty, 0);
    if (totalInCart >= p.stock) return showToast("Maximum stock reached", 'error');

    setCart(prev => {
      const exist = prev.find(c => c.id === p.id && c.price === price);
      if (exist) {
        return prev.map(c => c === exist ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...p, price, qty: 1 }];
    });

    setShowPriceModal(false);
    showToast(`Added ${p.name} at Rs. ${price.toLocaleString()}`);
  };

  const changeQty = (index, delta) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[index].qty += delta;
      if (newCart[index].qty < 1) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  const executeSale = async () => {
    if (!cart.length) return;

    const total = cart.reduce((s, x) => s + (x.price * x.qty), 0);
    const saleItems = [...cart];

    setCart([]);
    const stockBackup = [...stock];
    setStock(prev => prev.map(item => {
      const cartItem = saleItems.find(c => c.id === item.id);
      return cartItem ? { ...item, stock: item.stock - cartItem.qty } : item;
    }));
    showToast("Processing sale...");

    try {
      await addDoc(collection(db, "sales"), { items: saleItems, total, userId: user.uid, time: Date.now() });

      const updatePromises = saleItems.map(c => {
        const original = stockBackup.find(s => s.id === c.id);
        return updateDoc(doc(db, "stock", c.id), { stock: original.stock - c.qty });
      });
      await Promise.all(updatePromises);

      showToast("Sale completed!");
    } catch (err) {
      setCart(saleItems);
      setStock(stockBackup);
      showToast("Sale failed: " + err.message, 'error');
    }
  };

  const handleMoneyTransfer = async (e) => {
    e.preventDefault();

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Amount must be greater than 0", 'error');
      return;
    }

    if (paymentMethod === 'others' && (!customPaymentMethod || customPaymentMethod.trim() === '')) {
      showToast("Please enter bank/service name", 'error');
      return;
    }

    const methodName = paymentMethod === 'others' ? customPaymentMethod.trim() : paymentMethod;

    const transferData = {
      type: transferType,
      method: paymentMethod,
      customMethod: paymentMethod === 'others' ? customPaymentMethod.trim() : null,
      amount: amount,
      time: Date.now()
    };

    try {
      await addDoc(collection(db, "moneyTransfers"), { ...transferData, userId: user.uid });
      setShowMoneyTransferModal(false);

      setTransferAmount('');
      setCustomPaymentMethod('');
      setTransferType('send');
      setPaymentMethod('jazzcash');

      const methodDisplay = paymentMethod === 'jazzcash' ? 'JazzCash' :
        paymentMethod === 'easypaisa' ? 'EasyPaisa' :
          methodName;
      showToast(`${transferType === 'send' ? 'Sent' : 'Received'} Rs.${amount.toLocaleString()} via ${methodDisplay} `);
    } catch (err) {
      showToast("Failed to record transfer: " + err.message, 'error');
    }
  };

  const voidTransfer = async (transferId) => {
    try {
      await deleteDoc(doc(db, "moneyTransfers", transferId));
      showToast("Transfer voided successfully");
    } catch (err) {
      showToast("Failed to void transfer: " + err.message, 'error');
    }
  };

  const downloadHistoryPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(139, 92, 246);
    doc.text("MOBILE FIX SHOP", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sales History Report", 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleString()} `, 14, 34);

    const tableData = sales.map(s => [
      `#${s.id.slice(0, 8)} `,
      new Date(s.time).toLocaleString(),
      s.items.map(i => `${i.name} (x${i.qty})`).join(", "),
      `Rs.${s.total.toLocaleString()} `
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Order ID', 'Date & Time', 'Products Sold', 'Total Amount']],
      body: tableData,
      headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 45 },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 35, halign: 'right' }
      }
    });

    doc.save(`Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast("PDF Exported Successfully!");
  };

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - (24 * 60 * 60 * 1000);

    const daily = sales.filter(s => s.time >= todayStart).reduce((s, x) => s + x.total, 0);
    const yesterday = sales.filter(s => s.time >= yesterdayStart && s.time < todayStart).reduce((s, x) => s + x.total, 0);
    const allTime = sales.reduce((s, x) => s + x.total, 0);
    const totalStock = stock.reduce((s, x) => s + x.stock, 0);
    const inventoryValue = stock.reduce((s, x) => s + (x.price * x.stock), 0);

    let diff = 0;
    if (yesterday > 0) {
      diff = ((daily - yesterday) / yesterday) * 100;
    } else if (daily > 0) {
      diff = 100;
    }

    const itemStats = {};
    sales.forEach(s => {
      s.items.forEach(i => {
        if (!itemStats[i.name]) itemStats[i.name] = { qty: 0, revenue: 0 };
        itemStats[i.name].qty += i.qty;
        itemStats[i.name].revenue += (i.price * i.qty);
      });
    });

    const topItems = Object.entries(itemStats)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 4);

    return { daily, allTime, totalStock, inventoryValue, diff, topItems, orders: sales.length };
  }, [sales, stock]);

  const toggleSaleDetails = (id) => {
    setExpandedSales(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredInventory = stock.filter(p =>
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) &&
    (!showOnlyLowStock || p.stock < 5)
  );

  const filteredTerminal = stock.filter(p =>
    p.name.toLowerCase().includes(terminalSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(terminalSearch.toLowerCase())
  );

  const filteredHistory = sales.filter(s =>
    s.id.toLowerCase().includes(historySearch.toLowerCase()) ||
    s.items.some(i => i.name.toLowerCase().includes(historySearch.toLowerCase()))
  );

  return (
    <div className="antialiased selection:bg-nebula-purple selection:text-white font-sans">
      <div className="nebula-bg"></div>
      <div className="noise-overlay"></div>

      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} id={t.id} msg={t.msg} type={t.type} onRemove={removeToast} />
        ))}
      </div>

      {/* AUTH LOGIN OVERLAY */}
      {!authorized && (
        <div id="login-overlay" className="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
          <div className="nebula-bg"></div>
          <div className="noise-overlay"></div>

          <div className="glass-panel p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center max-w-md w-[90%] relative z-10 border-white/5 shadow-2xl shadow-nebula-purple/20">
            <div className="mb-6 md:mb-8 relative group">
              <div className="absolute inset-0 bg-nebula-purple/30 blur-3xl rounded-full group-hover:bg-nebula-purple/50 transition-all duration-1000"></div>
              <div className="relative w-20 h-20 md:w-24 md:h-24 glass-panel rounded-3xl flex items-center justify-center border-white/10 group-hover:scale-105 transition-transform duration-500">
                <Codesandbox className="text-nebula-purple w-10 h-10 md:w-12 md:h-12" />
              </div>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl mb-2 tracking-tighter text-center bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
              Mobile Fix <span className="text-nebula-purple">Lab</span>
            </h2>
            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8 md:mb-12">Enterprise OS v2.0</p>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 bg-white text-black rounded-2xl font-heading text-[clamp(10px,4vw,14px)] tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-row items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <svg className="w-[clamp(16px,5vw,20px)] h-[clamp(16px,5vw,20px)] shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-bold whitespace-nowrap">Continue with Google</span>
            </button>

            {loginError && (
              <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <p className="text-rose-400 text-[10px] font-bold uppercase tracking-wide">{loginError}</p>
              </div>
            )}

            <p className="mt-8 text-[10px] text-slate-600 font-medium text-center max-w-[200px] leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}

      <div className="h-[100dvh] w-full flex flex-col p-4 md:p-6 lg:p-8 xl:p-10 relative overflow-hidden">

        <header className="flex justify-between items-center mb-4 md:mb-6 lg:mb-8 z-40 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-1 md:gap-1.5">
            <div className="w-10 h-10 md:w-12 md:h-12 md:rounded-2xl flex items-center justify-center border-white/20">
              <Codesandbox className="text-nebula-purple w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="font-heading text-lg md:text-xl lg:text-2xl tracking-tighter uppercase">Mobile Fix <span className="text-nebula-purple">Lab</span></h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise OS v2.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 xl:gap-8">
            <div className="hidden lg:flex items-center gap-4 xl:gap-6 px-4 xl:px-6 py-2 xl:py-3 glass-panel rounded-2xl border-white/5">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">CPU Load</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="bg-nebula-purple h-full w-1/3 animate-[pulse_2s_infinite]"></div>
                  </div>
                  <span className="text-[10px] font-black tabular-nums">32%</span>
                </div>
              </div>
              <div className="w-[1px] h-6 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Memory</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="bg-nebula-pink h-full w-2/3"></div>
                  </div>
                  <span className="text-[10px] font-black tabular-nums">64%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xl font-black font-heading tabular-nums text-nebula-purple">
                  {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user?.displayName || 'User'}</span>
                <span className="text-[8px] text-slate-400 font-mono">ID: {user?.uid?.slice(0, 6)}...</span>
              </div>
              <div className="relative group flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 group-hover:border-nebula-purple transition-all cursor-pointer flex items-center justify-center relative overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-heading text-2xl text-nebula-purple uppercase">{user?.email?.[0] || 'U'}</span>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-nebula-dark rounded-full"></div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-500 hover:text-rose-500 transition-all flex items-center justify-center group/logout"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover/logout:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden mb-20 lg:mb-24" ref={viewContainerRef}>

          {/* DASHBOARD VIEW */}
          {activeView === 'dashboard' && (
            <div className="canvas-view grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full overflow-y-auto no-scrollbar pb-10">
              <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-l-4 border-nebula-purple relative overflow-hidden group">
                    <div className="stat-card-glow"></div>
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest">Daily Revenue</p>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-nebula-purple/10 flex items-center justify-center text-nebula-purple">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading mb-2">Rs. {stats.daily.toLocaleString()}</h2>
                    <p className={`text - [8px] md: text - [10px] font - black uppercase ${stats.diff >= 0 ? 'text-emerald-400' : 'text-rose-400'} `}>
                      {stats.diff >= 0 ? '+' : ''}{stats.diff.toFixed(1)}% from yesterday
                    </p>
                  </div>
                  <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-l-4 border-emerald-500 relative overflow-hidden group">
                    <div className="stat-card-glow"></div>
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest">All-Time Revenue</p>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading mb-2">Rs. {stats.allTime.toLocaleString()}</h2>
                    <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase">Lifetime Performance</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden">
                    <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">Inventory</p>
                    <h2 className="text-3xl md:text-5xl font-heading mb-2">{stats.totalStock}</h2>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-nebula-purple h-full w-2/3"></div>
                    </div>
                  </div>
                  <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden">
                    <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">Orders</p>
                    <h2 className="text-3xl md:text-5xl font-heading mb-2">{stats.orders}</h2>
                    <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase">Processed Today</p>
                  </div>
                  <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden">
                    <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">Inventory Value</p>
                    <h2 className="text-3xl md:text-4xl font-heading text-amber-400 mb-2">Rs. {stats.inventoryValue.toLocaleString()}</h2>
                    <p className="text-[8px] md:text-[10px] text-amber-400/50 font-black uppercase">Total Asset Worth</p>
                  </div>
                </div>

                <div className="glass-panel p-10 rounded-[3rem]">
                  <h3 className="font-heading text-xl mb-8 text-slate-400">Top Performing Items</h3>
                  <div className="space-y-6">
                    {stats.topItems.length > 0 ? stats.topItems.map(([name, itemStat]) => (
                      <div key={name} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-nebula-purple/10 flex items-center justify-center text-nebula-purple group-hover:bg-nebula-purple group-hover:text-white transition-all">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-base">{name}</p>
                            <p className="text-xs text-slate-500 uppercase font-black">{itemStat.qty} Items Sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-xl text-white">Rs. {itemStat.revenue.toLocaleString()}</p>
                          <div className="w-32 bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-nebula-purple to-nebula-pink h-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, (itemStat.revenue / (stats.allTime || 1)) * 100)}% ` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-slate-500 italic py-10">Waiting for sales data...</p>
                    )}
                  </div>
                </div>

                {/* Critical Alerts */}
                <div className="glass-panel p-8 rounded-[2.5rem]">
                  <h3 className="font-heading text-lg mb-6 flex items-center gap-2">
                    <Zap className="text-amber-400 w-5 h-5" /> Critical Alerts
                  </h3>
                  <div className="space-y-4">
                    {stock.filter(p => p.stock < 5).map(a => (
                      <div key={a.id} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex justify-between items-center group hover:bg-rose-500/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                          <p className="font-black text-sm">{a.name}</p>
                        </div>
                        <span className="text-xs font-black bg-rose-500 px-2 py-1 rounded-lg text-white">{a.stock} LEFT</span>
                      </div>
                    ))}
                    {stock.filter(p => p.stock < 5).length === 0 && (
                      <p className="text-center text-slate-500 italic py-6">Stock levels healthy.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6 lg:space-y-8">
                {/* Money Transfer Section */}
                <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-nebula-purple/5 to-transparent">
                  <h3 className="font-heading text-lg mb-6 flex items-center gap-2">
                    <Wallet className="text-nebula-purple w-5 h-5" /> JazzCash & EasyPaisa Transactions
                  </h3>
                  <div className="space-y-4">
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyan-500">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-slate-400 text-xs font-semibold uppercase">Money Sent</p>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-heading mb-1">Rs. {moneyTransfers.filter(t => t.type === 'send').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</h2>
                      <p className="text-sm text-slate-300 font-bold uppercase tracking-wide">Total Sent</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-green-500">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-slate-400 text-xs font-semibold uppercase">Money Received</p>
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-heading mb-1">Rs. {moneyTransfers.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</h2>
                      <p className="text-sm text-slate-300 font-bold uppercase tracking-wide">Total Received</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY VIEW */}
          {activeView === 'inventory' && (
            <div className="canvas-view h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
                <h2 className="text-3xl md:text-4xl font-heading">The Inventory</h2>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-0 bg-white/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl transition-all duration-300 group-focus-within:border-white/20 group-focus-within:bg-white/[0.06]">
                      <div className="pl-4 pr-3 py-4 text-slate-500 group-focus-within:text-nebula-purple transition-colors">
                        <Search className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        placeholder="Search inventory..."
                        className="flex-1 bg-transparent py-4 pr-14 outline-none text-sm font-medium placeholder:text-slate-600"
                      />
                      <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-white/5 opacity-40 group-focus-within:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-slate-500">⌘K</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
                      className={`flex-1 md:flex-none px-4 md:px-6 py-4 rounded-2xl border transition-all text-[10px] md:text-xs font-black flex items-center justify-center gap-2 ${showOnlyLowStock ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' : 'border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30'}`}
                    >
                      <AlertTriangle className={`w-4 h-4 ${showOnlyLowStock ? 'text-rose-500' : 'text-rose-500'}`} /> Low Stock
                    </button>
                    <button
                      onClick={() => { setEditItem(null); setShowProductModal(true); }}
                      className="flex-1 md:flex-none bg-white text-black px-4 md:px-8 py-4 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-nebula-purple hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scroll pr-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 pb-20">
                {filteredInventory.length > 0 ? filteredInventory.map(p => (
                  <div key={p.id} className={`glass-panel p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col group hover:border-nebula-purple transition-all ${p.stock < 5 ? 'ring-1 ring-rose-500/20' : ''}`}>
                    <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                      <div className="w-10 h-10 md:w-12 md:h-12 glass-panel rounded-xl md:rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-nebula-purple group-hover:bg-nebula-purple/5 transition-all">
                        <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className={`px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] md:text-sm font-black ${p.stock < 5 ? 'text-rose-500 animate-pulse bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                        {p.stock} IN STOCK
                      </div>
                    </div>
                    <div className="relative z-10 flex-1">
                      <h4 className="font-heading text-xl md:text-2xl mb-1 text-white leading-tight">{highlightText(p.name, inventorySearch)}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Part ID: #{highlightText(p.id.slice(-6), inventorySearch)}</p>
                      <p className="text-3xl md:text-4xl font-heading text-white mb-6">Rs. {p.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3 relative z-10">
                      <button onClick={() => { setEditItem(p); setShowProductModal(true); }} className="flex-1 bg-white/5 py-4 rounded-2xl hover:bg-white/10 text-xs font-black uppercase tracking-widest transition-all">Edit Details</button>
                      <button onClick={() => deleteUnit(p.id)} className="w-14 h-14 bg-rose-500/5 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-32 text-center">
                    <div className="w-24 h-24 glass-panel rounded-full flex items-center justify-center mx-auto mb-8 text-slate-700">
                      <SearchX className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-heading text-slate-500">No matching parts found</h3>
                    <p className="text-slate-600 mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TERMINAL VIEW */}
          {activeView === 'terminal' && (
            <div className="canvas-view h-full overflow-y-auto no-scrollbar">
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 h-full">
                <div className="lg:col-span-8 flex flex-col min-h-[500px] lg:min-h-0">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                    <h2 className="text-3xl md:text-4xl font-heading">Checkout</h2>
                    <div className="relative w-full md:w-80 group">
                      <div className="absolute inset-0 bg-white/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl transition-all duration-300 group-focus-within:border-white/20 group-focus-within:bg-white/[0.06]">
                        <div className="pl-4 pr-3 py-4 text-slate-500 group-focus-within:text-nebula-purple transition-colors">
                          <Search className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={terminalSearch}
                          onChange={(e) => setTerminalSearch(e.target.value)}
                          placeholder="Search items..."
                          className="flex-1 bg-transparent py-4 pr-14 outline-none text-sm font-medium placeholder:text-slate-600"
                        />
                        <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-white/5 opacity-40 group-focus-within:opacity-100 transition-opacity">
                          <span className="text-[10px] font-black text-slate-500">⌘K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 overflow-y-auto custom-scroll pr-2">
                    {filteredTerminal.map(p => (
                      <div key={p.id} onClick={() => addToCart(p)} className="glass-panel p-6 rounded-[2rem] cursor-pointer group hover:bg-white/5 active:scale-95">
                        <div className="flex justify-between items-start mb-2">
                          <p className={`text - [10px] font - black uppercase ${p.stock < 1 ? 'text-rose-500' : 'text-slate-500'} `}>{p.stock < 1 ? 'Out of Stock' : 'Ready'}</p>
                          <p className="text-sm font-black text-nebula-purple uppercase bg-nebula-purple/10 px-2 py-1 rounded-lg">{p.stock} IN STOCK</p>
                        </div>
                        <h5 className="font-black text-base md:text-lg mb-1 text-white">{highlightText(p.name, terminalSearch)}</h5>
                        <p className="text-2xl font-black text-nebula-pink">Rs. {p.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4 h-auto lg:h-full pb-24 lg:pb-0">
                  <div className="glass-panel p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem] h-full flex flex-col border-white/20">
                    <h3 className="font-heading text-2xl mb-8 flex justify-between items-center">
                      <span>Basket <span className="text-xs bg-nebula-purple px-2 py-1 rounded-full align-middle ml-2">{cart.reduce((s, x) => s + x.qty, 0)}</span></span>
                      <button onClick={() => { if (cart.length && window.confirm("Clear all items?")) setCart([]); }} className="text-xs text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    </h3>
                    <div className="mb-6 p-4 border-y border-white/5 border-dashed text-center">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Digital Receipt Terminal</p>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scroll space-y-4 mb-8">
                      {cart.length > 0 ? cart.map((c, i) => (
                        <div key={`${c.id} -${c.price} `} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="font-black text-sm">{c.name}</p>
                            <p className="text-xs text-nebula-purple font-black">Rs. {c.price}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => changeQty(i, -1)} className="text-rose-500"><Minus className="w-4 h-4" /></button>
                            <span className="font-black">{c.qty}</span>
                            <button onClick={() => changeQty(i, 1)} className="text-emerald-500"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )) : (
                        <p className="text-center py-10 opacity-20">Waiting for items...</p>
                      )}
                    </div>
                    <div className="pt-8 border-t border-white/10 space-y-4">
                      <div className="flex justify-between text-3xl font-heading text-white">
                        <span>Total</span><span>Rs. {cart.reduce((s, x) => s + (x.price * x.qty), 0).toFixed(2)}</span>
                      </div>
                      <button onClick={executeSale} className="w-full py-5 bg-gradient-to-r from-white to-gray-50 text-black rounded-2xl font-heading font-bold text-lg hover:from-gray-50 hover:to-gray-100 active:scale-[0.98] transition-all shadow-xl shadow-black/10 border border-white/20">
                        Complete Sale
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HISTORY VIEW */}
          {activeView === 'history' && (
            <div className="canvas-view h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
                <h2 className="text-3xl md:text-4xl font-heading">History</h2>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <button onClick={downloadHistoryPDF} className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-nebula-purple/20 hover:border-nebula-purple/50 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <Download className="w-4 h-4 text-nebula-purple" /> Export PDF
                  </button>
                  <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-0 bg-white/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl transition-all duration-300 group-focus-within:border-white/20 group-focus-within:bg-white/[0.06]">
                      <div className="pl-4 pr-3 py-4 text-slate-500 group-focus-within:text-nebula-purple transition-colors">
                        <Search className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search history..."
                        className="flex-1 bg-transparent py-4 pr-14 outline-none text-sm font-medium placeholder:text-slate-600"
                      />
                      <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-white/5 opacity-40 group-focus-within:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-slate-500">⌘K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scroll pr-4 space-y-6 pb-20">
                {filteredHistory.map(s => (
                  <div key={s.id} className="glass-panel rounded-[2.5rem] overflow-hidden group hover:bg-white/5 transition-all mb-6">
                    <div onClick={() => toggleSaleDetails(s.id)} className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer gap-4">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 glass-panel rounded-full flex items-center justify-center text-emerald-500 border-emerald-500/20 border">
                          <Check className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <p className="font-heading text-lg md:text-xl">Order ID: #{s.id.slice(0, 8)}</p>
                          <p className="text-[10px] md:text-sm text-slate-400 font-medium mt-1">{new Date(s.time).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 md:gap-10">
                        <div className="text-left md:text-right">
                          <p className="text-2xl md:text-3xl font-heading text-white">Rs. {s.total.toLocaleString()}</p>
                          <p className="text-[10px] md:text-xs text-nebula-purple font-black uppercase tracking-widest">{s.items.length} Items Sold</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); voidSale(s.id); }} className="p-3 md:p-4 bg-rose-500/10 text-rose-500 rounded-xl md:rounded-2xl hover:bg-rose-50 hover:text-white transition-all">
                            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <ChevronDown className={`w - 5 h - 5 text - slate - 600 transition - transform duration - 300 ${expandedSales.has(s.id) ? 'rotate-180' : ''} `} />
                        </div>
                      </div>
                    </div>
                    {expandedSales.has(s.id) && (
                      <div className="border-t border-white/5 bg-black/20 p-6 md:p-8 space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          {s.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-nebula-purple/10 flex items-center justify-center text-nebula-purple">
                                  <Package className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-black text-sm text-white">{item.name}</p>
                                  <p className="text-[10px] text-slate-500 uppercase font-black">{item.qty} x Rs. {item.price.toLocaleString()}</p>
                                </div>
                              </div>
                              <p className="font-heading text-lg text-white">Rs. {(item.price * item.qty).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MONEY TRANSFERS VIEW */}
          {activeView === 'transfers' && (
            <div className="canvas-view h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-heading text-4xl md:text-5xl mb-2">Money Transfers</h1>
                  <p className="text-slate-500 text-sm">JazzCash & EasyPaisa Transactions</p>
                </div>
                <button
                  onClick={() => setShowMoneyTransferModal(true)}
                  className="px-4 py-3 md:px-6 md:py-5 bg-gradient-to-r from-white to-gray-50 text-black rounded-xl md:rounded-2xl font-heading font-bold text-sm md:text-lg hover:from-gray-50 hover:to-gray-100 active:scale-[0.98] transition-all shadow-xl shadow-black/10 border border-white/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  New Transfer
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyan-500">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Total Sent</p>
                  <h2 className="text-3xl font-heading mb-1">Rs. {moneyTransfers.filter(t => t.type === 'send').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</h2>
                  <p className="text-xs text-slate-500">{moneyTransfers.filter(t => t.type === 'send').length} transactions</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-green-500">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Total Received</p>
                  <h2 className="text-3xl font-heading mb-1">Rs. {moneyTransfers.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</h2>
                  <p className="text-xs text-slate-500">{moneyTransfers.filter(t => t.type === 'receive').length} transactions</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-nebula-purple">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Net Balance</p>
                  <h2 className="text-3xl font-heading mb-1">
                    Rs. {(moneyTransfers.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0) -
                      moneyTransfers.filter(t => t.type === 'send').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                  </h2>
                  <p className="text-xs text-slate-500">Total transactions: {moneyTransfers.length}</p>
                </div>
              </div>

              {/* Transfers List */}
              <div className="glass-panel p-8 rounded-3xl flex-1 overflow-y-auto">
                <h3 className="font-heading text-xl mb-6">All Transactions</h3>
                <div className="space-y-4">
                  {moneyTransfers.length > 0 ? moneyTransfers.map(transfer => (
                    <div key={transfer.id} className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w - 12 h - 12 rounded - xl flex items - center justify - center ${transfer.type === 'send' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-green-500/10 text-green-500'
                            } `}>
                            <ArrowRight className={`w - 6 h - 6 ${transfer.type === 'receive' ? 'rotate-180' : ''} `} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text - sm px - 3 py - 1 rounded - full font - semibold ${transfer.type === 'send' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-400'
                                } `}>
                                {transfer.type === 'send' ? 'Sent' : 'Received'}
                              </span>
                              <span className="text-sm px-3 py-1 rounded-full bg-nebula-purple/20 text-nebula-purple font-semibold">
                                {transfer.method === 'jazzcash' ? 'JazzCash' :
                                  transfer.method === 'easypaisa' ? 'EasyPaisa' :
                                    transfer.customMethod || 'Others'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-2xl font-heading ${transfer.type === 'send' ? 'text-cyan-400' : 'text-green-400'}`}>
                              {transfer.type === 'send' ? '-' : '+'}Rs. {transfer.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-400 mt-1 font-medium">{new Date(transfer.time).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => voidTransfer(transfer.id)}
                            className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            title="Void Transfer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20">
                      <CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">No transfers yet</p>
                      <p className="text-slate-600 text-sm mt-2">Click "New Transfer" to record your first transaction</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION - CENTERED DOCK */}
        <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] lg:bottom-[calc(2rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="flex items-center gap-2 md:gap-3 lg:gap-4 p-2 md:p-2.5 lg:p-3.5 glass-panel rounded-full md:rounded-[2rem] lg:rounded-[2.5rem] border-white/20 shadow-2xl pointer-events-auto">
            <button onClick={() => switchView('dashboard')} className={`dock-item p-3 md:p-4 rounded-xl md:rounded-2xl hover:text-nebula-purple transition-all group relative ${activeView === 'dashboard' ? 'nav-active' : ''}`}>
              <Home className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="w-[1px] h-6 md:h-8 bg-white/10 mx-1"></div>
            <button onClick={() => switchView('inventory')} className={`dock-item p-3 md:p-4 rounded-xl md:rounded-2xl hover:text-nebula-purple transition-all group relative ${activeView === 'inventory' ? 'nav-active' : ''}`}>
              <Box className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button onClick={() => switchView('terminal')} className={`dock-item p-3 md:p-4 rounded-xl md:rounded-2xl hover:text-nebula-purple transition-all group relative ${activeView === 'terminal' ? 'nav-active' : ''}`}>
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button onClick={() => switchView('history')} className={`dock-item p-3 md:p-4 rounded-xl md:rounded-2xl hover:text-nebula-purple transition-all group relative ${activeView === 'history' ? 'nav-active' : ''}`}>
              <Clock className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button onClick={() => switchView('transfers')} className={`dock-item p-3 md:p-4 rounded-xl md:rounded-2xl hover:text-nebula-purple transition-all group relative ${activeView === 'transfers' ? 'nav-active' : ''}`}>
              <Wallet className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="w-[1px] h-6 md:h-8 bg-white/10 mx-1"></div>
            <button onClick={() => { setEditItem(null); setShowProductModal(true); }} className="dock-item p-3 md:p-4 bg-white text-black rounded-xl md:rounded-2xl hover:bg-nebula-purple hover:text-white transition-all group relative">
              <Plus className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </nav>
        </div>
      </div>

      {/* PRICE MODAL */}
      {
        showPriceModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[110] flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8 rounded-3xl border-white/20">
              <h2 className="font-heading text-2xl mb-6 tracking-tight">{pendingItem?.name}</h2>
              <div className="space-y-6">
                <div className="bg-white/5 py-4 px-5 rounded-2xl border border-white/10">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Original Price</p>
                  <p className="text-white text-3xl font-bold tabular-nums">Rs. {pendingItem?.price.toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-nebula-purple tracking-wide block mb-3">Sale Price</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">Rs.</span>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && confirmAddToCart()}
                      className="w-full py-4 pl-14 pr-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-nebula-purple font-semibold text-2xl text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPriceModal(false)} className="flex-1 py-3.5 rounded-xl bg-white/5 font-semibold text-sm uppercase tracking-wide hover:bg-white/10 transition-colors">Cancel</button>
                  <button onClick={confirmAddToCart} className="flex-1 py-3.5 rounded-xl bg-nebula-purple font-semibold text-sm uppercase tracking-wide shadow-lg shadow-nebula-purple/20 hover:bg-nebula-purple/90 transition-colors">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* MONEY TRANSFER MODAL */}
      {
        showMoneyTransferModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[110] flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] w-full max-w-lg p-10 rounded-3xl border border-white/10 shadow-2xl">
              <h2 className="font-heading text-3xl mb-8 tracking-tight">Money Transfer</h2>
              <form onSubmit={handleMoneyTransfer} className="space-y-6">
                {/* Transfer Type */}
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500 tracking-wider block mb-3">Transfer Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTransferType('send')}
                      className={`py-4 rounded-xl font-medium transition-all ${transferType === 'send'
                        ? 'bg-nebula-purple/20 border-2 border-nebula-purple text-white'
                        : 'bg-white/5 border-2 border-transparent text-slate-500 hover:border-white/20'
                        }`}
                    >
                      Send Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType('receive')}
                      className={`py-4 rounded-xl font-medium transition-all ${transferType === 'receive'
                        ? 'bg-nebula-purple/20 border-2 border-nebula-purple text-white'
                        : 'bg-white/5 border-2 border-transparent text-slate-500 hover:border-white/20'
                        }`}
                    >
                      Receive Money
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-xs font-medium uppercase text-slate-500 tracking-wider block mb-3">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('jazzcash')}
                      className={`py-4 rounded-xl font-medium transition-all ${paymentMethod === 'jazzcash'
                        ? 'bg-nebula-purple/20 border-2 border-nebula-purple text-white'
                        : 'bg-white/5 border-2 border-transparent text-slate-500 hover:border-white/20'
                        }`}
                    >
                      JazzCash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('easypaisa')}
                      className={`py-4 rounded-xl font-medium transition-all ${paymentMethod === 'easypaisa'
                        ? 'bg-nebula-purple/20 border-2 border-nebula-purple text-white'
                        : 'bg-white/5 border-2 border-transparent text-slate-500 hover:border-white/20'
                        }`}
                    >
                      EasyPaisa
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('others')}
                      className={`py-4 rounded-xl font-medium transition-all ${paymentMethod === 'others'
                        ? 'bg-nebula-purple/20 border-2 border-nebula-purple text-white'
                        : 'bg-white/5 border-2 border-transparent text-slate-500 hover:border-white/20'
                        }`}
                    >
                      Others
                    </button>
                  </div>

                  {/* Custom Payment Method Input */}
                  {paymentMethod === 'others' && (
                    <input
                      type="text"
                      value={customPaymentMethod}
                      onChange={(e) => setCustomPaymentMethod(e.target.value)}
                      className="w-full mt-3 py-4 px-5 bg-white/5 border-2 border-white/10 rounded-xl outline-none focus:border-white/40 font-medium text-white placeholder:text-slate-600 transition-all"
                      placeholder="Enter bank/service name"
                      required={paymentMethod === 'others'}
                    />
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-nebula-purple tracking-wider block mb-3">Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-semibold text-lg">Rs.</span>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full py-5 pl-20 pr-6 bg-black/50 border border-white/10 rounded-2xl outline-none focus:border-nebula-purple/60 focus:bg-black/60 font-semibold text-4xl text-center text-white placeholder:text-slate-700 transition-all"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMoneyTransferModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-nebula-purple font-bold text-sm uppercase tracking-wider shadow-lg shadow-nebula-purple/40 hover:bg-nebula-purple/90 transition-all"
                  >
                    Record Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* PRODUCT MODAL */}
      {
        showProductModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="glass-panel w-full max-w-xl p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border-white/20 max-h-[90vh] overflow-y-auto custom-scroll">
              <h2 className="font-heading text-3xl mb-10 tracking-tighter">{editItem ? 'Edit Device Info' : 'Add New Device'}</h2>
              <form onSubmit={handleProductSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Model & Specification</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editItem?.name || ''}
                    required
                    className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-nebula-purple font-black text-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Price (Rs.)</label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={editItem?.price || ''}
                      required
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-nebula-purple font-black text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Stock Units</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={editItem?.stock || ''}
                      required
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-nebula-purple font-black text-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 font-black text-slate-500">Cancel</button>
                  <button type="submit" className="flex-2 bg-nebula-purple px-10 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all">Submit Entry</button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default App;
