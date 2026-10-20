import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    ShoppingCart, Search, Tag, 
    Cpu, HardDrive, Network, Speaker, Monitor, Shield 
} from 'lucide-react';

function ProductList({ handleAddToCart }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [error, setError] = useState(null);

    const API_BASE_URL = "http://localhost:8082/api/products";
    const CAT_API_BASE_URL = "http://localhost:8082/api/categories";

    useEffect(() => {
        axios.get(API_BASE_URL)
            .then((res) => {
                if (res && res.data) setProducts(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => setError("Error loading catalog."));

        axios.get(CAT_API_BASE_URL)
            .then((res) => {
                if (res && res.data) setCategories(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => console.error("Error loading categories:", err));
    }, []);

    // FAIL-SAFE IMAGE OR ICON FALLBACK
    const renderProductVisual = (product) => {
        // Fix to read both camelCase and snake_case from DB/API
        const imageSrc = product.imagePath || product.image_path;

        if (imageSrc && (imageSrc.startsWith('http') || imageSrc.startsWith('/'))) {
            return (
                <img 
                    src={imageSrc} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => { 
                        e.target.style.display = 'none';
                        e.target.parentNode.className = "h-48 w-full bg-slate-100 flex items-center justify-center";
                    }}
                />
            );
        }

        const categoryName = (product.category?.name || product.category || "").toLowerCase();
        const iconProps = { className: "w-16 h-16 text-blue-600 stroke-[1.5]" };

        if (categoryName.includes('hardware') || categoryName.includes('screen') || categoryName.includes('peripherals')) {
            return <Monitor {...iconProps} />;
        }
        if (categoryName.includes('storage') || categoryName.includes('disk') || categoryName.includes('ssd') || categoryName.includes('ram')) {
            return <HardDrive {...iconProps} />;
        }
        if (categoryName.includes('networking') || categoryName.includes('wifi') || categoryName.includes('internet')) {
            return <Network {...iconProps} />;
        }
        if (categoryName.includes('audio') || categoryName.includes('sound') || categoryName.includes('speaker')) {
            return <Speaker {...iconProps} />;
        }
        if (categoryName.includes('software') || categoryName.includes('antivirus') || categoryName.includes('security')) {
            return <Shield {...iconProps} />;
        }

        return <Cpu {...iconProps} />;
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const productCategoryName = product.category?.name || product.category;
        const matchesCategory = activeCategory === 'All' || productCategoryName === activeCategory;

        return matchesSearch && matchesCategory;
    });

    if (error) return <div className="text-center text-red-500 py-10 font-medium">{error}</div>;

    return (
        <div className="space-y-8">
            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col gap-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                    />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
                        <Tag className="w-4 h-4" /> Filter By:
                    </span>
                    <button
                        onClick={() => setActiveCategory('All')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            activeCategory === 'All'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                activeCategory === cat.name
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* PRODUCT CATALOG GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
                        >
                            {/* Visual Header */}
                            <div className="h-48 w-full bg-slate-50 overflow-hidden relative flex items-center justify-center border-b border-slate-100">
                                {renderProductVisual(product)}
                                {product.category && (
                                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold tracking-wide">
                                        {product.category.name || product.category || "Product"}
                                    </span>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${
                                            product.stockQuantity > 0 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                : 'bg-red-50 text-red-600 border border-red-100'
                                        }`}>
                                            {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">
                                        {product.description}
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                                    <div>
                                        <span className="text-xs text-slate-400 font-medium block">Price</span>
                                        <span className="text-xl font-extrabold text-blue-600">
                                            {product.price} TND
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleAddToCart(product)} 
                                        disabled={product.stockQuantity <= 0}
                                        className={`p-3 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center cursor-pointer ${
                                            product.stockQuantity > 0 
                                                ? 'bg-blue-600 hover:bg-blue-700' 
                                                : 'bg-slate-300 cursor-not-allowed'
                                        }`}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-slate-400 py-16 bg-white rounded-3xl border border-slate-100">
                        No products match your current search and category.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;