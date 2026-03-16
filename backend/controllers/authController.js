const mongoose = require('mongoose');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    try {
        // Check database connection state
        const connectionState = mongoose.connection.readyState;
        console.log(`Database connection state: ${connectionState}`);
        
        if (connectionState === 0) {
            // Disconnected - try to connect
            console.log('Database disconnected, attempting to connect...');
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-attendance');
        }
        
        if (connectionState === 3) {
            // Connecting - wait a bit and retry
            console.log('Database connecting, waiting...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Find user with timeout
        const user = await Promise.race([
            User.findOne({ email }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 10000))
        ]);
        
        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`Password match for ${email}: ${isMatch}`);

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        if (err.message === 'Database timeout' || err.name === 'MongoTimeoutError' || err.name === 'MongoServerSelectionError') {
            return res.status(503).json({ 
                message: 'Database temporarily unavailable. Please try again in a few moments.' 
            });
        }
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, passkey } = req.body;
        
        console.log(`Registration attempt for: ${email}, role: ${role}`);
        
        // Check database connection state
        const connectionState = mongoose.connection.readyState;
        console.log(`Database connection state: ${connectionState}`);
        
        if (connectionState === 0) {
            // Disconnected - try to connect
            console.log('Database disconnected, attempting to connect...');
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-attendance');
        }
        
        if (connectionState === 3) {
            // Connecting - wait a bit and retry
            console.log('Database connecting, waiting...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Check if user already exists with timeout
        const userExists = await Promise.race([
            User.findOne({ email }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 10000))
        ]);
        
        if (userExists) {
            console.log(`User already exists: ${email}`);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate passkey for teacher and HOD roles
        if ((role === 'teacher' || role === 'hod') && passkey !== 'teach123') {
            console.log(`Invalid passkey for role: ${role}`);
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

        // Create user with timeout
        const user = await Promise.race([
            User.create(userData),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 10000))
        ]);
        
        console.log(`User created successfully: ${email}`);
        
        // Return user data with token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.message === 'Database timeout' || err.name === 'MongoTimeoutError' || err.name === 'MongoServerSelectionError') {
            return res.status(503).json({ 
                message: 'Database temporarily unavailable. Please try again in a few moments.' 
            });
        }
        res.status(400).json({ 
            message: err.message,
            diagnostic: {
                uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':***@') : 'not set',
                name: err.name
            }
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('teacherDetails.subjects', 'name code semester department')
        .populate('teacherDetails.department', 'name code')
        .populate('studentDetails.department', 'name code')
        .populate('studentDetails.course', 'name code');

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            details: user.role === 'student' ? user.studentDetails : user.teacherDetails
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { loginUser, registerUser, getUserProfile };
