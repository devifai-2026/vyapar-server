const router             = require('express').Router();
const ctrl               = require('../controllers/storefront.controller');
const { protectCustomer } = require('../middleware/customerAuth');

// Products
router.get('/products',                             ctrl.listProducts);
router.get('/products/:id',                         ctrl.getProduct);
router.get('/products/:id/reviews',                 ctrl.getProductReviews);
router.post('/products/:id/reviews', protectCustomer, ctrl.submitReview);

// Categories & Brands
router.get('/categories',            ctrl.listCategories);
router.get('/brands',                ctrl.listBrands);

// Flash Sale
router.get('/flash-sales/active',    ctrl.getActiveFlashSale);

// Appearance
router.get('/appearance',            ctrl.getAppearance);

// Payment Gateways (active only, no secrets)
router.get('/payment-gateways',      require('../controllers/payment.controller').getStorefrontGateways);

// Coupons
router.post('/coupons/validate',     ctrl.validateCoupon);

module.exports = router;
