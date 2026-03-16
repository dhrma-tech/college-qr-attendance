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
        const { name, email, password, role, passkey } = req.body;
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Validate passkey for teacher and HOD roles
        if ((role === 'teacher' || role === 'hod') && passkey !== 'teach123') {
            return res.status(400).json({ message: 'Invalid passkey for teacher/HOD registration' });
        }

        const userData = { name, email, password, role };
        
        // Add role-specific details
        if (role === 'student') {
            userData.studentDetails = {
                rollNumber: `TEMP${Date.now()}`,
                semester: 1,
                division: 'A'
            };
        }
        if (role === 'teacher' || role === 'hod') {
            userData.teacherDetails = {
                teacherId: `T${Date.now().toString().slice(-6)}`
            };
        }

        const user = await User.create(userData);
        
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json({ 
            message: 'User registered successfully',
            user: userWithoutPassword 
        });
    } catch (err) {
        console.error('Registration error:', err);
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
