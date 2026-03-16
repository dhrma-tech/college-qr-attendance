const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    division: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: true }, // Session expiration
    sessionToken: { type: String, required: true, unique: true }, // Unique token for QR
    active: { type: Boolean, default: true }
}, { timestamps: true });

const attendanceRecordSchema = new mongoose.Schema({
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    markedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    // Anti-proxy fields
    ipAddress: String,
    deviceFingerprint: String
}, { timestamps: true });

// Prevent duplicate attendance for same student in same session
attendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });

const AttendanceSession = mongoose.model('AttendanceSession', attendanceSessionSchema);
const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);

module.exports = { AttendanceSession, AttendanceRecord };
