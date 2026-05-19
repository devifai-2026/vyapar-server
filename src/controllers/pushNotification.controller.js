const PushNotification = require('../models/PushNotification');
const Customer         = require('../models/Customer');

exports.list = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const skip  = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      PushNotification.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      PushNotification.countDocuments(),
    ]);
    res.json({ success: true, data: notifications, pagination: { page, limit, total } });
  } catch (err) { next(err); }
};

exports.send = async (req, res, next) => {
  try {
    const { title, body, audience, deepLink, deepLinkTarget, imageUrl } = req.body;

    const audienceFilter = {};
    if (audience === 'android') audienceFilter.deviceType = 'android';
    if (audience === 'ios')     audienceFilter.deviceType = 'ios';
    audienceFilter.fcmToken = { $ne: null };
    audienceFilter.status   = 'active';

    const recipients = await Customer.find(audienceFilter).select('fcmToken').lean();
    const sentCount  = recipients.length;

    // In production, integrate FCM/APNs here:
    // await sendFCMPush(recipients.map(r => r.fcmToken), { title, body, imageUrl, data: { deepLink, target: deepLinkTarget } });

    const notification = await PushNotification.create({
      title, body, imageUrl, deepLink, deepLinkTarget, audience,
      sentCount, status: 'sent', sentAt: new Date(),
    });

    res.status(201).json({ success: true, data: notification, message: `Notification sent to ${sentCount} devices` });
  } catch (err) { next(err); }
};

exports.schedule = async (req, res, next) => {
  try {
    const { title, body, audience, deepLink, deepLinkTarget, imageUrl, scheduledAt } = req.body;
    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({ success: false, message: 'Scheduled time must be in the future' });
    }
    const notification = await PushNotification.create({
      title, body, imageUrl, deepLink, deepLinkTarget, audience,
      status: 'scheduled', scheduledAt: new Date(scheduledAt),
    });
    res.status(201).json({ success: true, data: notification });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [subscriberCount, sentThisMonth, avgOpenRate] = await Promise.all([
      Customer.countDocuments({ fcmToken: { $ne: null }, status: 'active' }),
      PushNotification.countDocuments({
        status: 'sent',
        sentAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      }),
      PushNotification.aggregate([
        { $match: { status: 'sent', sentCount: { $gt: 0 } } },
        { $group: { _id: null, avgRate: { $avg: { $divide: ['$openedCount', '$sentCount'] } } } },
      ]),
    ]);
    const openRate = avgOpenRate[0] ? Math.round(avgOpenRate[0].avgRate * 100) : 0;
    res.json({ success: true, data: { subscriberCount, sentThisMonth, avgOpenRate: openRate } });
  } catch (err) { next(err); }
};
