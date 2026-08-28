const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controller.js');


const { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product.controller.js');


router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

// // Obtener todos los productos

// router.get("/api/products", async (req, res) => {
//     try {
//         const products = await productsDao.getAllProducts();
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener los productos' });
//     }
// });

// // Obtener un producto por su ID

// router.get("/api/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await productsDao.getProductById(id);
//         if (!product) {
//             res.status(404).json({ error: 'Producto no encontrado' });
//         }
//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener el producto' });
//     }
// });

// // Crear un nuevo producto (ID se autogenera)

// router.post("/api/products", async (req, res) => {
//     const productData = req.body;
//     try {
//         const newProduct = await productsDao.createProduct(productData);
//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(400).json({ error: 'Error al crear el producto' });
//     } 
// });
// /*
// ejemplo de uso
// newProduct = {
//     "name": "Product 1",
//     "description": "Description for Product 1",
//     "code": "P001",
//     "price": 10.99,
//     "status": true,
//     "stock": 100,
//     "category": "Category 1",
//     "image": "product1.jpg"
// }
// */

// // Actualizar un producto exepto su ID

// router.put("/api/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedData = req.body;
//         const updatedProduct = await productsDao.updateProduct(id, updatedData);
//         res.status(200).json(updatedProduct);
//     } catch (error) {
//         res.status(400).json({ error: 'Error al actualizar el producto' });
//     }
// });

// // Eliminar un producto por su ID

// router.delete("/api/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         await productsDao.deleteProduct(id);
//         res.status(200).json({ message: 'Producto eliminado correctamente' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error al eliminar el producto' });
//     }
//     });

module.exports = router;