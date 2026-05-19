const router = require('express').Router();
const ctrl   = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats',              ctrl.getStats);
router.get('/gateways',           ctrl.getGateways);
router.put('/gateways/:slug',     ctrl.updateGateway);
router.patch('/gateways/:slug/toggle',  ctrl.toggleGateway);
router.patch('/gateways/:slug/sandbox', ctrl.toggleSandbox);

module.exports = router;
