const Appearance = require('../models/Appearance');

const getOrCreate = () =>
  Appearance.findOneAndUpdate({ storeId: 'default' }, { $setOnInsert: { storeId: 'default' } }, { upsert: true, new: true });

exports.get = async (req, res, next) => {
  try {
    const appearance = await getOrCreate();
    res.json({ success: true, data: appearance });
  } catch (err) { next(err); }
};

const updateSection = (section) => async (req, res, next) => {
  try {
    const update = { [section]: req.body };
    const appearance = await Appearance.findOneAndUpdate(
      { storeId: 'default' },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: appearance });
  } catch (err) { next(err); }
};

exports.updateColors          = updateSection('colors');
exports.updateTypography      = updateSection('typography');
exports.updateLayout          = updateSection('layout');
exports.updateSections        = updateSection('homepageSections');
exports.updateHeader          = updateSection('header');
exports.updateFooter          = updateSection('footer');
exports.updateCustomCSS       = updateSection('customCSS');
exports.updateHomepageContent = updateSection('homepageContent');

exports.updateCardStyle = async (req, res, next) => {
  try {
    const appearance = await Appearance.findOneAndUpdate(
      { storeId: 'default' },
      { $set: { productCardStyle: req.body.style } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: appearance });
  } catch (err) { next(err); }
};

exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `/uploads/branding/${req.file.filename}`;
    const appearance = await Appearance.findOneAndUpdate(
      { storeId: 'default' },
      { logo: url },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: { logo: url }, appearance });
  } catch (err) { next(err); }
};

exports.uploadFavicon = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `/uploads/branding/${req.file.filename}`;
    const appearance = await Appearance.findOneAndUpdate(
      { storeId: 'default' },
      { favicon: url },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: { favicon: url }, appearance });
  } catch (err) { next(err); }
};

exports.uploadAppIcon = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `/uploads/branding/${req.file.filename}`;
    const appearance = await Appearance.findOneAndUpdate(
      { storeId: 'default' },
      { appIcon: url },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: { appIcon: url }, appearance });
  } catch (err) { next(err); }
};
