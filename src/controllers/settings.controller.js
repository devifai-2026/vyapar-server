const StoreSettings = require('../models/StoreSettings');

const getOrCreate = () =>
  StoreSettings.findOneAndUpdate(
    { storeId: 'default' },
    { $setOnInsert: { storeId: 'default' } },
    { upsert: true, new: true }
  );

exports.get = async (req, res, next) => {
  try {
    const settings = await getOrCreate();
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

const updateSection = (section) => async (req, res, next) => {
  try {
    const prefixed = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [`${section}.${k}`, v])
    );
    const settings = await StoreSettings.findOneAndUpdate(
      { storeId: 'default' },
      { $set: prefixed },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

exports.updateGeneral     = updateSection('general');
exports.updateRegional    = updateSection('regional');
exports.updateOperational = updateSection('operational');
exports.updateSEO         = updateSection('seo');
exports.updateOrders      = updateSection('orders');
exports.updateSocial      = updateSection('social');
exports.updateShipping    = updateSection('shipping');
exports.updateReviews     = updateSection('reviews');
