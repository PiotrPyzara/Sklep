const express = require('express');

const router = express.Router();

const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// GET /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProduct);

// POST /admin/add-product
router.post(
  '/add-product',
  [
    body('title', 'Please enter a title at least 3 characters.')
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body('price', 'Please enter a valid price.').isFloat(),
    body('description', 'Please enter a description at least 5 characters.')
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

// GET /admin/products
router.get('/products', isAuth, adminController.getProducts);

//GET /admin/edit-product/:productId
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

//POST /admin/edit-product
router.post('/edit-product/', isAuth, adminController.postEditProduct);

//POST /admin/delete
router.post('/delete', isAuth, adminController.postDeleteProduct);

module.exports = router;
