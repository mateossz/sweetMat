//vamos a crear nuestro product manager para manejar los productos de nuestra tienda
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const productsFilePath = path.join(__dirname, "../", "data", "products.json");

//console.log(productsFilePath);

class ProductsManager {
  static async allProducts() {   
    try {
        console.log("---->");
      const data = await fs.readFile(path.join(productsFilePath, "products.json"), 'utf-8');

      console.log("---->", data);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo de productos:', error);
      throw error;
    }
  }

    static async getProductById(id) {
        try {
            const products = await this.allProducts();
            const product = products.find(p => p.id === id);
            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            return product;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }

    
    // Método para obtener todos los productos
    async getAllProducts() {
        try {
            const data = await fs.readFile(this.productsFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
            throw error;
        }
    }
    // Método para obtener un producto por su ID
    async getProductById(id) {
        try {
            const products = await this.getAllProducts();
            const product = products.find(p => p.id === id);
            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            return product;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }
    // Método para crear un nuevo producto
    async createProduct(productData) {
        try {
            const { name, description, code, price, status, stock, category, image } = productData;
            if (!name || !description || !code || !price || !status || !stock || !category || !image) {
                throw new Error('Todos los campos son obligatorios');
            }
            const products = await this.getAllProducts();
            const newProduct = {
                id: uuidv4(),
                ...productData
            };
            products.push(newProduct);
            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw error;
        }
    }
    // Método para actualizar un producto existente
    async updateProduct(id, updatedData) {
        try {
            const products = await this.getAllProducts();
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            const updatedProduct = { ...products[productIndex], ...updatedData };
            products[productIndex] = updatedProduct;
            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }

    }
    // Método para eliminar un producto
    async deleteProduct(id) {
        try {
            const products = await this.getAllProducts();
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            products.splice(productIndex, 1);
            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
            return { message: `Producto con ID ${id} eliminado` };
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    
}


module.exports = ProductsManager;