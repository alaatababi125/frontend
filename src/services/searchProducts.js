import axios from 'axios';

const PRODUCT_API_BASE_URL = "http://localhost:8082/api/products";

class ProductService {
    getProducts() {
        return axios.get(PRODUCT_API_BASE_URL);
    }

    // New search endpoint caller
    searchProducts(query) {
        return axios.get(`${PRODUCT_API_BASE_URL}/search`, {
            params: { query: query }
        });
    }
    // 2. Add this missing method here!
    searchProducts(query) {
        return axios.get(`${PRODUCT_API_BASE_URL}/search`, {
            params: { query: query }
        });
    }
}


const productServiceInstance = new ProductService();
export default productServiceInstance;

