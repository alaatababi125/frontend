import React, { useEffect } from 'react';
import { ShoppingBag, X, Phone, CreditCard } from 'lucide-react';

const Cart = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemove, 
  totalPrice, 
  onCheckout, 
  user,           // Logged in user object from backend
  phoneNumber,    // Managed state from App.jsx
  setPhoneNumber  // Managed state setter from App.jsx
}) => {

  // Auto-fill phone number if a logged-in user has it saved in their database profile
  useEffect(() => {
    if (user && user.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    } else if (user && user.phone) { 
      setPhoneNumber(user.phone);
    }
  }, [user, setPhoneNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-black flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400">Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-slate-50 pb-4">
                <div>
                  <p className="font-bold text-slate-800">{item.name || item.productName}</p>
                  <p className="text-sm text-slate-500">{item.quantity} x {item.price} TND</p>
                </div>
                <button 
                  onClick={() => onRemove(item.id)} 
                  className="text-red-400 text-xs hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t bg-slate-50 space-y-4">
            
            {/* PHONE INPUT - Linked to App.jsx State */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Phone size={12} /> 
                {user ? "Your Saved Phone Number" : "⚡ Guest Checkout: Enter Phone Number"}
              </label>
              <input 
                type="tel"
                placeholder="Ex: 98765432"
                value={phoneNumber || ''} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                // Disables input field only if logged-in user actually has a valid phone value text string saved
                disabled={!!(user && (user.phoneNumber || user.phone))} 
              />
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 font-medium">Total Amount</span>
              <span className="text-2xl font-black text-blue-600">{totalPrice} TND</span>
            </div>

            <button 
              onClick={() => {
                if(!phoneNumber || !phoneNumber.trim()) {
                  return alert("Please enter a phone number to complete your order!");
                }
                onCheckout(phoneNumber); 
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <CreditCard size={20} />
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;