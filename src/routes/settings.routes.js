const router = require('express').Router();
const ctrl   = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/',              ctrl.get);
router.put('/general',       ctrl.updateGeneral);
router.put('/regional',      ctrl.updateRegional);
router.put('/operational',   ctrl.updateOperational);
router.put('/seo',           ctrl.updateSEO);
router.put('/orders',        ctrl.updateOrders);
router.put('/social',        ctrl.updateSocial);
router.put('/shipping',      ctrl.updateShipping);
router.put('/reviews',       ctrl.updateReviews);
router.get('/sms',           ctrl.getSms);
router.put('/sms',           ctrl.updateSms);

module.exports = router;
