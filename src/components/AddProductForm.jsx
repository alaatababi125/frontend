import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProductForm = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '' // This holds the exact ID (1, 2, 3, or 4) selected from MySQL
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load the 4 categories directly from Spring Boot upon opening
  useEffect(() => {
    axios.get('http://localhost:8082/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories from database:', error);
      });
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.categoryId) {
      alert("Please select a valid category!");
      return;
    }

    if (!imageFile) {
      alert("Please upload a photo from your desktop!");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload desktop photo quietly to Cloudinary
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'ecommerce_preset');

      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dujr6vys2/image/upload',
        formData
      );

      const uploadedImageUrl = cloudinaryResponse.data.secure_url;

      // 2. Build product matching your Spring Boot entity structure exactly
      const productToSave = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        stockQuantity: parseInt(product.stockQuantity),
        imagePath: uploadedImageUrl,
        category: { id: parseInt(product.categoryId) } // Links directly to category ID in MySQL
      };

      // 3. Post to backend
      await axios.post('http://localhost:8082/api/products', productToSave);

      alert(`"${product.name}" successfully added to the catalog!`);
      
      // Reset the form fields
      setProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '' });
      setImageFile(null);
      
      // Return to storefront to see changes immediately
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error saving the product. Check your connection or console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-xl font-sans mt-4">
      <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
          <input 
            type="text" 
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            placeholder="e.g. Sony WH-1000XM4" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
          <textarea 
            name="description" 
            value={product.description} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all h-24"
            placeholder="Describe the main features of your product" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Price (TND)</label>
            <input 
              type="number" 
              step="0.01" 
              name="price" 
              value={product.price} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Stock Available</label>
            <input 
              type="number" 
              name="stockQuantity" 
              value={product.stockQuantity} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Assign to Category</label>
         <select 
  name="categoryId" 
  value={product.categoryId} 
  onChange={handleChange} 
  required 
  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
>
  <option value="">-- Pick a Matching Category --</option>
  {categories.map((cat) => (
    <option key={cat.id || cat.idCategory} value={cat.id || cat.idCategory}>
      {cat.name || cat.nom}
    </option>
  ))}
</select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Product Picture</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            required 
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer file:cursor-pointer mt-1" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-200 disabled:bg-slate-300 mt-2"
        >
          {loading ? 'Uploading & Saving to Catalog...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;