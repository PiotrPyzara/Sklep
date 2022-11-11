const Product = require('../models/product');

const { validationResult } = require('express-validator');
const user = require('../models/user');

const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 3;

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    errorMessage: null,
    oldInput: {
      title: '',
      imgUrl: '',
      price: '',
      description: '',
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);

  const image = req.file;

  if (!image) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      errorMessage: 'Attached file is not an image.',
      oldInput: {
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        price: req.body.price,
        description: req.body.description,
      },
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        price: req.body.price,
        description: req.body.description,
      },
    });
  }

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imgUrl: image.path,
    description: req.body.description,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  let totalItems;

  Product.find({ userId: req.user._id })
    .count()
    .then((num) => {
      totalItems = num;
      return Product.find({ userId: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        path: '/admin/products',
        pageTitle: 'Shop',
        currentPage: page,
        totalItems: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasBackPage: page > 1,
        nextPage: page + 1,
        backPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((products) => {
      res.render('admin/edit-product', {
        prod: products,
        path: '/admin/products',
        pageTitle: 'Shop',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const image = req.file;

  Product.findById(id)
    .then((product) => {
      product.title = req.body.title;
      if (image) {
        fileHelper.deleteFile(product.imgUrl);
        product.imgUrl = image.path;
      }
      product.description = req.body.description;
      product.price = req.body.price;
      return product.save();
    })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.deleteOne({ _id: prodId })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
