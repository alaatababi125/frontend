import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart'; 
import ManageOrders from './components/ManageOrders';
import UserOrders from './components/UserOrders';
import TrackOrder from './components/TrackOrder'; // Import your live tracking component
import { ShoppingCart, Settings, ArrowLeft, User, LogOut, Package, PlusCircle, History, Search } from 'lucide-react';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [isTrackingMode, setIsTrackingMode] = useState(false); // 🚀 New tracking mode view state switch
  const [adminTab, setAdminTab] = useState('products'); 
  const [user, setUser] = useState(null); 
  const [authMode, setAuthMode] = useState(null);
  
  // State for tracking route properties automatically on guest checkout redirect
  const [autoTrackDetails, setAutoTrackDetails] = useState(null);

  // State for the Phone Number (Professional Input)
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { 
        setUser(JSON.parse(savedUser)); 
      } catch (e) { 
        localStorage.removeItem('user'); 
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAdminMode(false);
    setIsHistoryMode(false);
    setIsTrackingMode(false);
    setAuthMode(null);
    setCartItems([]);
    setPhoneNumber(""); 
    setAutoTrackDetails(null);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleAddToCart = (product) => {
    if (!product) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        const stock = product.stockQuantity || 0; 
        if (existingItem.quantity + 1 > stock) {
          alert(`Only ${stock} units in stock!`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

const handleCheckout = async (typedPhoneNumber) => {
    if (!typedPhoneNumber || typedPhoneNumber.trim() === "") {
      alert("Please enter your phone number first!");
      return;
    }

    if (!cartItems || cartItems.length === 0) return;

    // 🔍 Dynamic fallback extraction to guarantee fields are never null for logged-in accounts
    const activeUserId = user?.id || user?._id || null;
    const activeUsername = user?.username || user?.name || null;

    const orderPayload = {
      phoneNumber: typedPhoneNumber.trim(),
      totalPrice: totalPrice, 
      status: "PENDING",                     
      userId: activeUserId,         // Sends clean Long id or null
      username: activeUsername,     // Sends clean String username or null
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price,         
        productName: item.name
      }))
    };

    try {
      const response = await axios.post('http://localhost:8082/api/orders/create', orderPayload);
      const newOrder = response.data; 

      setCartItems([]);
      setIsCartOpen(false);

      if (user) {
        setIsAdminMode(false);
        setIsTrackingMode(false);
        setIsHistoryMode(true); 
        alert("🎉 Order placed successfully! It is currently awaiting Admin Approval.");
      } else {
        setIsAdminMode(false);
        setIsHistoryMode(false);
        setAuthMode(null);
        setIsTrackingMode(true);
        
        setAutoTrackDetails({
          id: newOrder.id,
          phoneNumber: newOrder.phoneNumber,
          justPlaced: true
        });
      }

    } catch (err) {
      console.error("❌ Checkout Error:", err);
      alert("Could not process order. Check your IDE compiler output.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => { setIsAdminMode(false); setIsHistoryMode(false); setIsTrackingMode(false); setAuthMode(null); }}>
              <span className="text-2xl font-black text-blue-600 tracking-tighter">ALAA<span className="text-slate-400">STORE</span></span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {user?.role === 'ROLE_ADMIN' && (
                <button onClick={() => { setIsAdminMode(!isAdminMode); setIsHistoryMode(false); setIsTrackingMode(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isAdminMode ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                  {isAdminMode ? <ArrowLeft size={18} /> : <Settings size={18} />}
                  <span>{isAdminMode ? 'Exit Admin' : 'Admin Panel'}</span>
                </button>
              )}

              {/* 🎯 SEPARATION FIX: Track Order only shows up if the client is an unauthenticated guest user */}
              {!isAdminMode && !user && (
                <button 
                  onClick={() => { setIsTrackingMode(!isTrackingMode); setIsHistoryMode(false); setAuthMode(null); setAutoTrackDetails(null); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${isTrackingMode ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">{isTrackingMode ? 'Back to Shop' : 'Track Order'}</span>
                </button>
              )}

              {!isAdminMode && user && user.role !== 'ROLE_ADMIN' && (
                <button 
                  onClick={() => { setIsHistoryMode(!isHistoryMode); setIsTrackingMode(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isHistoryMode ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                >
                  {isHistoryMode ? <ArrowLeft size={18} /> : <History size={18} />}
                  <span>{isHistoryMode ? 'Shop' : 'My Orders'}</span>
                </button>
              )}

              {!user ? (
                <button 
                  onClick={() => { setAuthMode('login'); setIsTrackingMode(false); setIsHistoryMode(false); }} 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <User size={18} />
                  <span>Login</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
                  <p className="hidden sm:block text-sm font-bold text-slate-700">{user.username}</p>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500"><LogOut size={18} /></button>
                </div>
              )}

              {!isAdminMode && !isHistoryMode && !isTrackingMode && !authMode && (
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-blue-600 text-white rounded-lg">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cartCount}</span>}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {authMode === 'login' && <Login onLoginSuccess={(u) => { setUser(u); setAuthMode(null); }} onSwitch={() => setAuthMode('register')} onSwitchToTracking={() => { setIsTrackingMode(true); setAuthMode(null); }} />}
        {authMode === 'register' && <Register onRegisterSuccess={() => setAuthMode('login')} onSwitch={() => setAuthMode('login')} />}

        {!authMode && (
          isAdminMode ? (
            <div className="space-y-8">
              <div className="flex gap-6 border-b border-slate-200 pb-2">
                 <button onClick={() => setAdminTab('products')} className={`flex items-center gap-2 px-4 py-2 font-bold ${adminTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}><PlusCircle size={20}/> Inventory</button>
                 <button onClick={() => setAdminTab('orders')} className={`flex items-center gap-2 px-4 py-2 font-bold ${adminTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}><Package size={20}/> Customer Orders</button>
              </div>
              {adminTab === 'products' ? <AddProductForm onProductAdded={() => setAdminTab('products')} /> : <ManageOrders />}
            </div>
          ) : isHistoryMode ? (
            <UserOrders username={user?.username} />
          ) : isTrackingMode ? (
            <TrackOrder autoTrackDetails={autoTrackDetails} />
          ) : (
            <div>
              <header className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Featured Products</h1>
                <p className="text-slate-500 text-lg mt-2">Premium hardware for your next build.</p>
              </header>
              <ProductList handleAddToCart={handleAddToCart} />
            </div>
          )
        )}
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onRemove={(id) => setCartItems(cartItems.filter(i => i.id !== id))} 
        totalPrice={totalPrice} 
        onCheckout={handleCheckout} 
        user={user}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />
    </div>
  );
}

export default App;