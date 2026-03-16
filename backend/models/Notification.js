const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['session_started', 'attendance_marked', 'report_exported', 'system'],
        default: 'system'
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String }, // optional frontend route to navigate to
    meta: { type: mongoose.Schema.Types.Mixed } // extra data (subjectName, etc.)
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
