const express = require('express');
const app = express()
const PORT = 3000


const ProductsManager = require('./dao/ProductManager.js')

const productsDao = new ProductsManager();


// inicio con html + diseño
const style = `
    body {
        font-family: Arial, sans-serif;
        background-color: #04021d;
        margin: 0;
        padding: 0;
    }
    h1 {
        color: #4120ff; 
    }
    p {
        color: #c1f3fa;
    }
`;
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SweetMat</title>
    <style>
        ${style}
    </style>
</head>
<body>
    <h1>Bienvenido a SweetMat</h1>
    <p>Esta es la página de inicio de SweetMat.</p>
</body>
</html>
`;

// funcion middleware para monitoreo de rutas   date + url + method + status code + tiempo de respuesta 

function logger(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const respuesta = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration} ms`
        console.log(respuesta);
        req.infoExtra = respuesta; // Agregar la información extra al objeto req
    });

    next();
}

app.use(logger);

//! BODY IMPORTANTE MIDDLEWARE - req.body --> DATA ENVIADA DESDE EL CLIENTE (POSTMAN, NAVEGADOR, ETC.)

app.use(express.json()); //sin esto la data por body es undefined

//! FORMULARIO -> URLENCODED

app.use(express.urlencoded({ extended: true })); //para recibir data desde formularios html

app.get('/', (req, res) => {
  res.status(200).send(html)
})
//------------------------------------------------



/*
ESTO ES EL ARRANQUE DEL SERVER

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
*/

//---------ROUTES-----------------------------

// Obtener todos los productos

app.get("/api/products", async (req, res) => {
    try {
        const products = await productsDao.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por su ID

app.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productsDao.getProductById(id);
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Crear un nuevo producto (ID se autogenera)

app.post("/api/products", async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = await productsDao.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el producto' });
    } 
});
/*
ejemplo de uso
newProduct = {
    "name": "Product 1",
    "description": "Description for Product 1",
    "code": "P001",
    "price": 10.99,
    "status": true,
    "stock": 100,
    "category": "Category 1",
    "image": "product1.jpg"
}
*/

// Actualizar un producto exepto su ID

app.put("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedProduct = await productsDao.updateProduct(id, updatedData);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por su ID

app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await productsDao.deleteProduct(id);
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
    });

    module.exports = { app }