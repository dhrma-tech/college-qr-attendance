const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { AttendanceSession, AttendanceRecord } = require('../models/Attendance');
const { Subject } = require('../models/Academic');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Export attendance report as CSV or PDF
// @route   GET /api/hod/export?format=csv|pdf&subjectId=&from=&to=
// @access  Private/HOD/Admin
const exportAttendance = async (req, res) => {
    try {
        const { format = 'csv', subjectId, from, to } = req.query;

        // Build query filter
        const sessionFilter = {};
        if (subjectId) sessionFilter.subject = subjectId;

        // Date range for sessions
        if (from || to) {
            sessionFilter.createdAt = {};
            if (from) sessionFilter.createdAt.$gte = new Date(from);
            if (to) sessionFilter.createdAt.$lte = new Date(new Date(to).setHours(23, 59, 59));
        }

        const sessions = await AttendanceSession.find(sessionFilter)
            .populate('subject', 'name code semester')
            .populate('teacher', 'name email');

        // Fetch all attendance records for these sessions
        const sessionIds = sessions.map(s => s._id);
        const records = await AttendanceRecord.find({ session: { $in: sessionIds } })
            .populate('student', 'name email studentDetails')
            .populate('session')
            .populate('subject', 'name code');

        // Build flat rows for export
        const rows = records.map(r => ({
            'Student Name': r.student?.name || 'N/A',
            'Roll Number': r.student?.studentDetails?.rollNumber || 'N/A',
            'Email': r.student?.email || 'N/A',
            'Subject': r.subject?.name || 'N/A',
            'Subject Code': r.subject?.code || 'N/A',
            'Division': r.session?.division || 'N/A',
            'Status': r.status,
            'Marked At': r.markedAt ? new Date(r.markedAt).toLocaleString('en-IN') : 'N/A',
            'Session Date': r.session?.createdAt ? new Date(r.session.createdAt).toLocaleDateString('en-IN') : 'N/A',
        }));

        const filename = `attendance_report_${Date.now()}`;

        if (format === 'csv') {
            const parser = new Parser({ fields: Object.keys(rows[0] || {}) });
            const csv = rows.length > 0 ? parser.parse(rows) : 'No records found';
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            // Fire non-blocking notification
            createNotification({
                recipient: req.user._id,
                type: 'report_exported',
                title: 'CSV Report Downloaded',
                message: `Attendance CSV report with ${records.length} records was exported successfully.`,
                link: '/hod/reports'
            });
            return res.send(csv);
        }

        if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
            doc.pipe(res);

            // Header
            doc.rect(0, 0, doc.page.width, 80).fill('#0f172a');
            doc.fillColor('white').fontSize(22).font('Helvetica-Bold')
               .text('Attendance Report', 40, 25);
            doc.fontSize(10).font('Helvetica')
               .text(`Generated: ${new Date().toLocaleString('en-IN')}`, 40, 52);
            doc.fillColor('black').moveDown(3);

            // Summary box
            const uniqueStudents = new Set(records.map(r => r.student?._id?.toString())).size;
            const uniqueSubjects = new Set(records.map(r => r.subject?._id?.toString())).size;
            doc.roundedRect(40, 95, doc.page.width - 80, 55, 8)
               .fillAndStroke('#f8fafc', '#e2e8f0');
            doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold')
               .text(`Total Records: ${records.length}`, 60, 110)
               .text(`Students: ${uniqueStudents}`, 200, 110)
               .text(`Subjects: ${uniqueSubjects}`, 320, 110)
               .text(`Sessions: ${sessions.length}`, 440, 110);

            doc.moveDown(4);

            if (rows.length === 0) {
                doc.fillColor('#64748b').fontSize(12).font('Helvetica')
                   .text('No attendance records found for the selected filters.', { align: 'center' });
            } else {
                // Table header
                const tableTop = 170;
                const cols = [
                    { label: 'Student', x: 40, width: 120 },
                    { label: 'Roll No', x: 160, width: 70 },
                    { label: 'Subject', x: 230, width: 100 },
                    { label: 'Div', x: 330, width: 30 },
                    { label: 'Status', x: 360, width: 55 },
                    { label: 'Date', x: 415, width: 120 },
                ];

                // Header row
                doc.rect(40, tableTop, doc.page.width - 80, 22).fill('#0f172a');
                doc.fillColor('white').fontSize(8).font('Helvetica-Bold');
                cols.forEach(col => doc.text(col.label, col.x + 4, tableTop + 7, { width: col.width }));

                // Data rows
                let y = tableTop + 22;
                rows.forEach((row, i) => {
                    if (y > doc.page.height - 60) {
                        doc.addPage();
                        y = 40;
                    }
                    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
                    doc.rect(40, y, doc.page.width - 80, 18).fill(bg);
                    doc.fillColor('#334155').fontSize(7).font('Helvetica');
                    doc.text(row['Student Name'], cols[0].x + 4, y + 5, { width: cols[0].width, ellipsis: true });
                    doc.text(row['Roll Number'], cols[1].x + 4, y + 5, { width: cols[1].width });
                    doc.text(row['Subject'], cols[2].x + 4, y + 5, { width: cols[2].width, ellipsis: true });
                    doc.text(row['Division'], cols[3].x + 4, y + 5, { width: cols[3].width });

                    // Status badge color
                    const statusColor = row['Status'] === 'present' ? '#16a34a' :
                                        row['Status'] === 'late' ? '#d97706' : '#dc2626';
                    doc.fillColor(statusColor).text(row['Status'].toUpperCase(), cols[4].x + 4, y + 5, { width: cols[4].width });
                    doc.fillColor('#334155').text(row['Session Date'], cols[5].x + 4, y + 5, { width: cols[5].width });
                    y += 18;
                });
            }

            // Footer
            doc.fontSize(7).fillColor('#94a3b8').font('Helvetica')
               .text('Generated by Gatekeeper — College QR Attendance Protocol', 40, doc.page.height - 30, { align: 'center' });

            doc.end();
            // Fire non-blocking notification after piping completes
            res.on('finish', () => {
                createNotification({
                    recipient: req.user._id,
                    type: 'report_exported',
                    title: 'PDF Report Downloaded',
                    message: `Attendance PDF ledger with ${records.length} records was exported successfully.`,
                    link: '/hod/reports'
                });
            });
            return;
        }

        res.status(400).json({ message: 'Invalid format. Use csv or pdf.' });
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ message: 'Export failed: ' + err.message });
    }
};

module.exports = { exportAttendance };
