import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrackOrder = ({ autoTrackDetails }) => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-run if the user just came from a successful checkout session
  useEffect(() => {
    if (autoTrackDetails?.id && autoTrackDetails?.phoneNumber) {
      setOrderId(autoTrackDetails.id);
      setPhone(autoTrackDetails.phoneNumber);
      fetchStatus(autoTrackDetails.id, autoTrackDetails.phoneNumber);
    }
  }, [autoTrackDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStatus(orderId, phone);
  };

  const fetchStatus = async (id, phoneNumber) => {
    setLoading(true);
    setError('');
    setOrderStatus(null);
    try {
      const res = await axios.get(`http://localhost:8082/api/orders/track`, {
        params: { id, phoneNumber }
      });
      setOrderStatus(res.data);
    } catch (err) {
      setError(err.response?.data || "Could not find an order matching those details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 space-y-6">
      
      {/* 🎉 VISUAL SUCCESS BANNER FOR GUESTS */}
      {autoTrackDetails?.justPlaced && orderStatus && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center shadow-sm animate-fade-in">
          <h3 className="text-xl font-bold mb-1">🎉 Order Placed Successfully!</h3>
          <p className="text-sm opacity-90">
            Your order has been recorded as <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded font-bold"># {orderId}</span>. 
            No account needed—bookmark this page to see when the Admin approves your shipment!
          </p>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Track Your Order Status</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Order ID</label>
            <input 
              type="text" 
              placeholder="e.g., 23" 
              value={orderId}
              required
              className="w-full p-3 border rounded-xl bg-slate-50 focus:outline-blue-500 transition-all text-sm"
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
            <input 
              type="tel" 
              placeholder="e.g., 908655" 
              value={phone}
              required
              className="w-full p-3 border rounded-xl bg-slate-50 focus:outline-blue-500 transition-all text-sm"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
            {loading ? 'Checking Database...' : 'Track Order'}
          </button>
        </form>

        {/* 🔴 ERROR RENDER */}
        {error && (
          <div className="mt-6 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-100 text-center font-medium">
            {error}
          </div>
        )}

        {/* 🟢 LIVE ORDER STATUS COMPONENT */}
        {orderStatus && (
          <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
            <h4 className="font-bold text-slate-700 text-lg text-center">Order Information</h4>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Current Status</span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                  orderStatus.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                  orderStatus.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {orderStatus.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Total Bill</span>
                <span className="font-bold text-slate-800 block mt-1">{orderStatus.totalPrice} TND</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;