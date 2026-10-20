import axios from 'axios';

const PRODUCT_API_BASE_URL = "http://localhost:8082/api/products";

class ProductService {
    getProducts() {
        return axios.get(PRODUCT_API_BASE_URL);
    }
}

export default new ProductService();