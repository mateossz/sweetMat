const ProductManager = require('../dao/product.manager.js');

class ProductService {
    static async getAllProducts() {
        try {
            const products = await ProductManager.getAllProducts();
            return products;
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const product = await ProductManager.getProductById(id);
            if (!product) {
                return null; // Retorna null si el producto no se encuentra
            }
            return product;
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${id}:`, error);
            throw error;
        }
    }
}

module.exports = ProductService;