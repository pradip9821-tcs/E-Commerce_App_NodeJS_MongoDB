const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title', 'Invalid title !!')
            .isString()
            .isLength({
                min: 3,
                max: 30
            }),
        body('price', 'Invalid Price !!').isFloat(),
        body('description', 'Invalide Description !!').isLength({
            min: 10,
            max: 150
        })
    ],
    isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title', 'Invalid title !!')
            .isString()
            .isLength({
                min: 3,
                max: 30
            }),
        body('price', 'Invalid Price !!').isFloat(),
        body('description', 'Invalide Description !!').isLength({
            min: 10,
            max: 150
        })
    ], isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
