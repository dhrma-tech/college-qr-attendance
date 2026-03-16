const { Department, Course, Subject } = require('../models/Academic');
const User = require('../models/User');
const { AttendanceSession } = require('../models/Attendance');

// --- Department Management ---
const createDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;
        const dept = await Department.create({ name, code });
        res.status(201).json(dept);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getDepartments = async (req, res) => {
    const depts = await Department.find();
    res.json(depts);
};

// --- Course Management ---
const createCourse = async (req, res) => {
    try {
        const { name, code, departmentId } = req.body;
        const course = await Course.create({ name, code, department: departmentId });
        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getCourses = async (req, res) => {
    const courses = await Course.find().populate('department');
    res.json(courses);
};

// --- Subject Management ---
const createSubject = async (req, res) => {
    try {
        const { name, code, departmentId, courseId, semester, teacherId } = req.body;
        const subject = await Subject.create({
            name, code, department: departmentId, course: courseId, semester, teacher: teacherId
        });
        res.status(201).json(subject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getSubjects = async (req, res) => {
    const subjects = await Subject.find().populate('department course teacher', 'name email');
    res.json(subjects);
};

// --- User Management (Teacher/Student) ---
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, details } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const userData = { name, email, password, role };
        if (role === 'student') userData.studentDetails = details;
        if (role === 'teacher') userData.teacherDetails = details;

        const user = await User.create(userData);
        res.status(201).json({ _id: user._id, name: user.name, role: user.role });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getUsers = async (req, res) => {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
};

// --- Dashboard Stats ---
const getStats = async (req, res) => {
    try {
        const [totalStudents, totalTeachers, totalDepartments, totalSubjects, activeSessions] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: { $in: ['teacher', 'hod'] } }),
            Department.countDocuments(),
            Subject.countDocuments(),
            AttendanceSession.countDocuments({ active: true })
        ]);
        res.json({ totalStudents, totalTeachers, totalDepartments, totalSubjects, activeSessions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createDepartment, getDepartments,
    createCourse, getCourses,
    createSubject, getSubjects,
    registerUser, getUsers,
    getStats
};
