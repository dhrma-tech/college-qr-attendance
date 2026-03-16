const express = require('express');
const {
    createSession, getTeacherSessions, endSession,
    markAttendance, getStudentAttendance, getSessionAttendance,
    getAllSessions, getStudentStats
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Teacher routes
router.post('/session', protect, authorize('teacher'), createSession);
router.get('/teacher/sessions', protect, authorize('teacher'), getTeacherSessions);
router.put('/session/:id/end', protect, authorize('teacher'), endSession);
router.get('/session/:id/records', protect, authorize('teacher', 'admin'), getSessionAttendance);

// Student routes
router.post('/scan', protect, authorize('student'), markAttendance);
router.get('/student/history', protect, authorize('student'), getStudentAttendance);
router.get('/student/stats', protect, authorize('student'), getStudentStats);

// Admin routes
router.get('/sessions', protect, authorize('admin', 'hod'), getAllSessions);

module.exports = router;
