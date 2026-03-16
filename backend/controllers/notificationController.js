const Notification = require('../models/Notification');

// Create a notification (utility used internally by other controllers)
const createNotification = async ({ recipient, type, title, message, link, meta }) => {
    try {
        await Notification.create({ recipient, type, title, message, link, meta });
    } catch (err) {
        console.error('Notification creation failed:', err.message);
    }
};

// @desc  Get all notifications for the current user (newest first)
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort('-createdAt')
            .limit(30);
        const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
        res.json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc  Mark one notification as read
// @route PATCH /api/notifications/:id/read
// @access Private
const markRead = async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc  Mark ALL notifications as read
// @route PATCH /api/notifications/read-all
// @access Private
const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createNotification, getNotifications, markRead, markAllRead };
