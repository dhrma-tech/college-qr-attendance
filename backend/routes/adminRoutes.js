const express = require('express');
const {
    createDepartment, getDepartments,
    createCourse, getCourses,
    createSubject, getSubjects,
    registerUser, getUsers,
    getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here require admin role
router.use(protect, authorize('admin'));

router.route('/departments').post(createDepartment).get(getDepartments);
router.route('/courses').post(createCourse).get(getCourses);
router.route('/subjects').post(createSubject).get(getSubjects);
router.route('/users').post(registerUser).get(getUsers);
router.get('/stats', getStats);

module.exports = router;
