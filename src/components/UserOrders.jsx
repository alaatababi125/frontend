import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle } from 'lucide-react';

function UserOrders({ username }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // We fetch all then filter by the logged-in user
    axios.get(`http://localhost:8082/api/orders/all`)
      .then(res => {
        const myOrders = res.data.filter(o => o.username === username);
        // Sort by newest first
        setOrders(myOrders.sort((a, b) => b.id - a.id));
      });
  }, [username]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <Package className="text-blue-600" /> My Purchase History
      </h2>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-slate-400 text-center py-10">No orders found yet. Start shopping!</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="p-5 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors bg-slate-50/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-black text-slate-800 text-lg">Order #{order.id}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {/* Fixed field name from total_price to totalPrice */}
                  <p className="font-black text-blue-600 text-xl">{order.totalPrice} TND</p>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    order.status === 'SHIPPED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Show the items inside the order */}
              <div className="border-t border-slate-200 pt-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Items Purchased:</p>
                <div className="flex flex-wrap gap-2">
                  {order.items && order.items.map((item, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-medium text-slate-600">
                      {item.quantity}x {item.productName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserOrders;