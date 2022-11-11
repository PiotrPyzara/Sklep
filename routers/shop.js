const express = require('express');

const router = express.Router();

const shopControler = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', shopControler.getIndex);

router.get('/products', shopControler.getProducts);

router.get('/products/:productId', shopControler.getProduct);

router.get('/cart', isAuth, shopControler.getCart);

router.post('/cart', isAuth, shopControler.postCart);

router.post('/cart-delete-item', isAuth, shopControler.postDeleteItemFromCart);

router.post('/create-order', isAuth, shopControler.postOrder);

router.get('/orders', isAuth, shopControler.getOrders);

router.get('/orders/:orderId', isAuth, shopControler.getInvoice);

module.exports = router;
