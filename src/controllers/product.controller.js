const productService = require('../services/product.service.js');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// Método para obtener todos los productos

class ProductController {
    productsFile = path.join(__dirname, "../", "data", "products.json");

    _readJSONFile = async () => {
        try {
            const data = await fs.readFile(this.productsFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
            throw error;
        }
    };

    getAllProducts = async (req, res) => {
            try {
                const products = await this._readJSONFile();
                res.json(products);
            } catch (error) {
                console.error('Error al leer el archivo de productos:', error);
                res.status(500).json({ error: 'Error al obtener los productos' });
            }
        }
        // Método para obtener un producto por su ID
    getProductById = async (req, res) => {
            try {
                const { id } = req.params;
                const products = await this._readJSONFile();
                const product = products.find(p => p.id === id);
                if (!product) {
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }
                res.json(product);
            } catch (error) {
                console.error('Error al obtener el producto por ID:', error);
                res.status(500).json({ error: 'Error al obtener el producto' });
            }
        }
        // Método para crear un nuevo producto
    createProduct = async (req, res) => {
            try {
                const { name, description, code, price, status, stock, category, image } = req.body;
                if (!name || !description || !code || !price || !status || !stock || !category || !image) {
                    throw new Error('Todos los campos son obligatorios');
                }
                const products = await this._readJSONFile();
                const newProduct = {
                    id: uuidv4(),
                    ...req.body
                };
                products.push(newProduct);
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
                res.status(201).json(newProduct);
            } catch (error) {
                console.error('Error al crear el producto:', error);
                res.status(500).json({ error: 'Error al crear el producto' });
            }
        }
        // Método para actualizar un producto existente
    updateProduct = async (req, res) => {
            try {
                const { id } = req.params;
                const { name, description, code, price, status, stock, category, image } = req.body;
                const products = await this._readJSONFile();
                const productIndex = products.findIndex(p => p.id === id);
                if (productIndex === -1) {
                    return res.status(404).json({ error: 'Producto  con ID ${id} no encontrado' });
                }
                const updatedProduct = { ...products[productIndex], ...req.body };
                products[productIndex] = updatedProduct;
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
                res.json(updatedProduct);
            } catch (error) {
                console.error('Error al actualizar el producto:', error);
                res.status(500).json({ error: 'Error al actualizar el producto' });
            }

        }
        // Método para eliminar un producto
    deleteProduct = async (req, res) => {
            try {
                const { id } = req.params;
                const products = await this._readJSONFile();
                const productIndex = products.findIndex(p => p.id === id);
                if (productIndex === -1) {
                    return res.status(404).json({ error: 'Producto con ID ${id} no encontrado' });
                }
                products.splice(productIndex, 1);
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
                res.json({ message: 'Producto eliminado correctamente' });
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                res.status(500).json({ error: 'Error al eliminar el producto' });
            }
    }

}


module.exports = new ProductController();