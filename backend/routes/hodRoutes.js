const express = require('express');
const { 
    getDepartmentStats, 
    getFacultyPerformance,
    getAuditLogs,
    getDepartmentSubjects
} = require('../controllers/hodController');
const { exportAttendance } = require('../controllers/exportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('hod', 'admin'));

router.get('/stats', getDepartmentStats);
router.get('/faculty-performance', getFacultyPerformance);
router.get('/audit-logs', getAuditLogs);
router.get('/subjects', getDepartmentSubjects);
router.get('/export', exportAttendance);

module.exports = router;

