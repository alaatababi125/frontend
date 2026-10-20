import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, CheckCircle, Clock, TrendingUp, Phone, User } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8082/api/orders/all');
      setOrders(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // Sends a clean JSON structured object payload matching our Spring Map parser
      await axios.put(`http://localhost:8082/api/orders/${id}/status`, {
        status: newStatus
      });
      // Immediately pull fresh database properties right down into application state view layout
      fetchOrders(); 
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      {/* Mini Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-800">{totalRevenue.toFixed(2)} TND</h3>
          </div>
          <div className="bg-green-50 p-3 rounded-lg"><TrendingUp className="text-green-500" /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Orders Processed</p>
            <h3 className="text-2xl font-black text-slate-800">{orders.length}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg"><Package className="text-blue-500" /></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-800">
          <Package className="text-blue-600" /> Customer Management
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest">
                <th className="py-4 px-2">Order ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Order Details</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                // Safeguard against raw objects or nested structures in the text strings
                const statusString = order.status ? String(order.status) : "PENDING";
                const isConfirmed = statusString.includes("CONFIRMED");
                const cleanStatusText = statusString.replace('{STATUS:', '').replace('}', '').trim();

                return (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 font-mono text-blue-600 font-bold">#{order.id}</td>
                    
                    {/* 🎯 CUSTOMER LOOKUP FIX: Reads flat entity username field directly and removes "@" prefix */}
                    <td className="font-bold text-slate-700 text-sm">
                      {order.username && order.username.trim() !== "" ? (
                        <div className="flex items-center gap-1 text-blue-600 font-bold">
                          <User size={14} className="text-blue-500" />
                          <span>{order.username}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal italic">👤 GUEST_CLIENT</span>
                      )}
                    </td>
                    
                    <td className="text-slate-600">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Phone size={14} className="text-slate-400" />
                        {order.phoneNumber || <span className="text-slate-300 italic">No phone</span>}
                      </div>
                    </td>

                    {/* ITEM LIST CELL */}
                    <td className="py-4 px-2">
                      <div className="flex flex-col gap-1">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[11px] bg-slate-50 p-1 rounded border border-slate-100">
                              <span className="font-black text-blue-600">x{item.quantity}</span>
                              <span className="text-slate-700 font-medium truncate max-w-[120px]">
                                {item.productName || `Product ID: ${item.productId}`}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-300 italic text-xs">Empty Order</span>
                        )}
                      </div>
                    </td>

                    <td className="text-slate-600 font-medium">{order.totalPrice} TND</td>
                    
                    {/* STATUS STRING BADGE CLEANER */}
                    <td>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                        isConfirmed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {isConfirmed ? <CheckCircle size={12}/> : <Clock size={12}/>}
                        {cleanStatusText}
                      </span>
                    </td>
                    
                    <td className="text-right px-2">
                      {!isConfirmed && (
                        <button 
                          onClick={() => updateStatus(order.id, "CONFIRMED")}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm active:scale-95 transition-all"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
              No customer orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;