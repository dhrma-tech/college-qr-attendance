const User = require('../models/User');
const { AttendanceSession, AttendanceRecord } = require('../models/Attendance');
const { Subject, Department } = require('../models/Academic');
const mongoose = require('mongoose');

// @desc    Get departmental dashboard stats
// @route   GET /api/hod/stats
// @access  Private/HOD
const getDepartmentStats = async (req, res) => {
    try {
        const deptId = req.user.teacherDetails?.department;
        if (!deptId) return res.status(400).json({ message: 'No department assigned to HOD' });

        const totalStudents = await User.countDocuments({ 
            role: 'student', 
            'studentDetails.department': deptId 
        });

        const totalFaculty = await User.countDocuments({ 
            role: 'teacher', 
            'teacherDetails.department': deptId 
        });

        const activeSessions = await AttendanceSession.countDocuments({
            status: 'active',
            subject: { $in: await Subject.find({ department: deptId }).distinct('_id') }
        });

        // Calculate actual average attendance across all sessions in the department
        const departmentSessions = await AttendanceSession.find({
            subject: { $in: await Subject.find({ department: deptId }).distinct('_id') }
        });
        
        let avgAttendance = 0;
        if (departmentSessions.length > 0) {
            const sessionIds = departmentSessions.map(s => s._id);
            const totalRecords = await AttendanceRecord.countDocuments({ session: { $in: sessionIds } });
            // Assuming average class size is 30 for percentage calculation
            avgAttendance = Math.min(100, Math.round((totalRecords / (departmentSessions.length * 30)) * 100));
        }

        res.json({
            totalStudents,
            totalFaculty,
            activeSessions,
            avgAttendance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get faculty performance metrics for HOD's department
// @route   GET /api/hod/faculty-performance
// @access  Private/HOD
const getFacultyPerformance = async (req, res) => {
    try {
        const deptId = req.user.teacherDetails?.department;
        if (!deptId) return res.status(400).json({ message: 'No department assigned to HOD' });

        // Find all teachers in the department
        const teachers = await User.find({ 
            role: 'teacher', 
            'teacherDetails.department': deptId 
        });

        const performance = await Promise.all(teachers.map(async (teacher) => {
            // Find all sessions by this teacher
            const sessions = await AttendanceSession.find({ teacher: teacher._id });
            const sessionIds = sessions.map(s => s._id);

            // Calculate average attendance for this teacher
            // This is simplified: count total attendance vs potential attendance
            const attendanceCount = await AttendanceRecord.countDocuments({ session: { $in: sessionIds } });
            let attendancePercentage = 0;
            if (sessions.length > 0) {
                // Determine percentage based on assumed class size of 30 if no exact enrollment exists
                attendancePercentage = Math.min(100, Math.round((attendanceCount / (sessions.length * 30)) * 100));
            }
            
            return {
                name: teacher.name.split(' ').slice(-1)[0], // Last Name
                attendance: attendancePercentage,
                subjects: teacher.teacherDetails?.subjects?.length || 0
            };
        }));

        res.json(performance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get audit logs (recent sessions) for HOD's department
const getAuditLogs = async (req, res) => {
    try {
        const deptId = req.user.teacherDetails?.department;
        if (!deptId) return res.status(400).json({ message: 'No department assigned to HOD' });

        const sessions = await AttendanceSession.find({
            subject: { $in: await Subject.find({ department: deptId }).distinct('_id') }
        })
        .populate('subject', 'name code')
        .populate('teacher', 'name')
        .sort({ createdAt: -1 })
        .limit(20);

        // Calculate actual attendance percentage for each session
        const reports = await Promise.all(sessions.map(async (session) => {
            const recordsCount = await AttendanceRecord.countDocuments({ session: session._id });
            const percentage = Math.min(100, Math.round((recordsCount / 30) * 100)); // Assuming class size 30
            
            return {
                id: session._id,
                subject: session.subject?.name || 'Unknown',
                teacher: session.teacher?.name || 'Unknown',
                date: new Date(session.createdAt).toLocaleDateString('en-CA'),
                status: session.status === 'active' ? 'Active' : 'Finalized',
                attendance: `${percentage}%`
            };
        }));

        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all subjects in HOD's department
const getDepartmentSubjects = async (req, res) => {
    try {
        const deptId = req.user.teacherDetails?.department;
        if (!deptId) return res.status(400).json({ message: 'No department assigned to HOD' });

        const subjects = await Subject.find({ department: deptId }).select('name code');
        res.json(subjects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDepartmentStats,
    getFacultyPerformance,
    getAuditLogs,
    getDepartmentSubjects
};
