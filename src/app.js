const express = require('express');
const app = express()
const path = require('path');

const handlebars = require('express-handlebars');


const routesProducts = require('./routes/product.routes.js')

const ProductsManager = require('./dao/product.manager.js')

const productsDao = new ProductsManager();


// arranque handlebars

app.engine(
    'hbs', 
    handlebars.engine({
        extname: '.hbs', 
        defaultLayout: 'main.hbs', 
        layoutsDir: path.join(__dirname, 'views/layouts'), 
        partialsDir: path.join(__dirname, 'views/partials'),
        pagesDir: path.join(__dirname, 'views/pages')
        })
    );
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const context = {
        active: true,
        nombre,
        apellido,
        edad: 21
    }
    return res.render('pages/home', context);
});
 

app.get('/login', (req, res) => {
    const { id, nombre } = req.query;
    const context = {
        id,
        nombre,
    };
    return res.render('pages/login', context);
});

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

// monitoreo de rutas con morgan
const morgan = require('morgan');
app.use(morgan('dev'));


// CORS -- DE MANERA NATIVA - CON LISTA DINAMICA DE DOMINIOS

const allowedOrigins = ['http://localhost:3000', 'http://example.com']; // Lista de dominios permitidos


// STATIC
app.use("/public", express.static(path.join(__dirname, 'public'))); // Carpeta pública para archivos estáticos (CSS, JS, imágenes, etc.)



app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//------------------------------------------------



/*
ESTO ES EL ARRANQUE DEL SERVER

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
*/

//----------------------ROUTES-----------------------------

app.use('/api/products', routesProducts); // Rutas de productos

// // Obtener todos los productos

// app.get("/api/products", async (req, res) => {
//     try {
//         const products = await productsDao.getAllProducts();
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener los productos' });
//     }
// });

// // Obtener un producto por su ID

// app.get("/api/products/:id", async (req, res) => {
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

// app.post("/api/products", async (req, res) => {
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

// app.put("/api/products/:id", async (req, res) => {
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

// app.delete("/api/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         await productsDao.deleteProduct(id);
//         res.status(200).json({ message: 'Producto eliminado correctamente' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error al eliminar el producto' });
//     }
//     });



module.exports = { app } 