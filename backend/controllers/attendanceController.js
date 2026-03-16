const { AttendanceSession, AttendanceRecord } = require('../models/Attendance');
const { Subject } = require('../models/Academic');
const { createNotification } = require('./notificationController');
const crypto = require('crypto');

// --- Teacher: Session Management ---

const createSession = async (req, res) => {
    try {
        const { subjectId, division, durationMinutes } = req.body;
        
        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        // Duration in minutes
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        // Generate unique session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        const session = await AttendanceSession.create({
            subject: subjectId,
            teacher: req.user._id,
            division,
            startTime,
            endTime,
            sessionToken
        });

        res.status(201).json(session);

        // Fire notification to teacher (non-blocking)
        createNotification({
            recipient: req.user._id,
            type: 'session_started',
            title: 'Session Started',
            message: `Live session for ${subject.name} (Div ${division}) is now active.`,
            link: '/teacher/sessions',
            meta: { subjectName: subject.name, division }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getTeacherSessions = async (req, res) => {
    const sessions = await AttendanceSession.find({ teacher: req.user._id })
        .populate('subject')
        .sort('-createdAt');
    res.json(sessions);
};

const endSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findOneAndUpdate(
            { _id: req.params.id, teacher: req.user._id },
            { active: false, endTime: new Date() },
            { new: true }
        );
        if (!session) return res.status(404).json({ message: 'Session not found or unauthorized' });
        res.json(session);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// --- Student: Attendance Marking ---

const markAttendance = async (req, res) => {
    try {
        const { sessionToken, ipAddress, deviceFingerprint } = req.body;

        const session = await AttendanceSession.findOne({ sessionToken, active: true });
        if (!session) return res.status(404).json({ message: 'Invalid or expired session' });

        // Check if session has expired based on time
        if (new Date() > session.endTime) {
            session.active = false;
            await session.save();
            return res.status(400).json({ message: 'Session has expired' });
        }

        // Validate if student belongs to the division (Optional based on requirements)
        // Here we assume student role is already verified by middleware

        const record = await AttendanceRecord.create({
            session: session._id,
            student: req.user._id,
            subject: session.subject,
            ipAddress,
            deviceFingerprint
        });

        res.status(201).json({ message: 'Attendance marked successfully', record });

        // Fire notifications (non-blocking)
        createNotification({
            recipient: req.user._id,
            type: 'attendance_marked',
            title: 'Attendance Confirmed',
            message: `Your attendance for has been recorded successfully.`,
            link: '/student/history'
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Attendance already marked for this session' });
        }
        res.status(400).json({ message: err.message });
    }
};

const getStudentAttendance = async (req, res) => {
    const records = await AttendanceRecord.find({ student: req.user._id })
        .populate({
            path: 'session',
            populate: { path: 'subject teacher', select: 'name' }
        })
        .sort('-createdAt');
    res.json(records);
};

// --- Reports ---

const getSessionAttendance = async (req, res) => {
    const records = await AttendanceRecord.find({ session: req.params.id })
        .populate('student', 'name email studentDetails');
    res.json(records);
};

// --- Admin: All Sessions ---
const getAllSessions = async (req, res) => {
    const sessions = await AttendanceSession.find()
        .populate('subject', 'name code')
        .populate('teacher', 'name')
        .sort('-createdAt')
        .limit(20);
    res.json(sessions);
};

// --- Student: Per-subject attendance stats ---
const getStudentStats = async (req, res) => {
    try {
        const student = req.user;
        const { course, semester, division } = student.studentDetails || {};

        if (!course || !semester || !division) {
            return res.status(400).json({ message: 'Student profile incomplete' });
        }

        // 1. Get all subjects for student's course and semester
        const subjects = await Subject.find({ course, semester });
        const subjectIds = subjects.map(s => s._id);

        // 2. Fetch all sessions for these subjects in student's division
        const sessions = await AttendanceSession.find({
            subject: { $in: subjectIds },
            division
        });

        // 3. Fetch all attendance records for this student
        const records = await AttendanceRecord.find({ student: student._id });

        // 4. Calculate stats per subject
        const statsBySubject = subjects.map(subject => {
            const subjectSessions = sessions.filter(s => s.subject.toString() === subject._id.toString());
            const subjectRecords = records.filter(r => r.subject.toString() === subject._id.toString());
            
            const total = subjectSessions.length;
            const present = subjectRecords.length;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

            return {
                _id: subject._id,
                name: subject.name,
                code: subject.code,
                total,
                present,
                percentage
            };
        });

        // 5. Calculate overall stats
        const totalSessionsAcrossSubjects = sessions.length;
        const totalRecords = records.length;
        const overall = totalSessionsAcrossSubjects > 0 
            ? Math.round((totalRecords / totalSessionsAcrossSubjects) * 100) 
            : 0;

        res.json({
            overall,
            subjects: statsBySubject,
            totalClasses: totalSessionsAcrossSubjects,
            attendedCount: totalRecords
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createSession, getTeacherSessions, endSession,
    markAttendance, getStudentAttendance, getSessionAttendance,
    getAllSessions, getStudentStats
};
