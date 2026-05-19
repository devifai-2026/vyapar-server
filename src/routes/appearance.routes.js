const router = require('express').Router();
const ctrl   = require('../controllers/appearance.controller');
const { protect } = require('../middleware/auth');
const { uploadLogo, uploadFavicon, uploadAppIcon } = require('../middleware/upload');

router.use(protect);

router.get('/',              ctrl.get);
router.put('/colors',        ctrl.updateColors);
router.put('/typography',    ctrl.updateTypography);
router.put('/layout',        ctrl.updateLayout);
router.put('/sections',      ctrl.updateSections);
router.put('/header',        ctrl.updateHeader);
router.put('/footer',        ctrl.updateFooter);
router.put('/css',              ctrl.updateCustomCSS);
router.put('/homepage-content', ctrl.updateHomepageContent);
router.post('/logo',         uploadLogo,    ctrl.uploadLogo);
router.post('/favicon',      uploadFavicon, ctrl.uploadFavicon);
router.post('/appicon',      uploadAppIcon, ctrl.uploadAppIcon);

module.exports = router;
