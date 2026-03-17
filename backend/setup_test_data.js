const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log(`Loading .env from ${envPath}`);
dotenv.config({ path: envPath, override: true });

const User = require('./models/User');
const { Department, Course, Subject } = require('./models/Academic');

async function setupTestData() {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/college-attendance';
        console.log(`Connecting to: ${uri.replace(/:([^:@]+)@/, ':***@')}`);
        
        await mongoose.connect(uri, {
            ssl: true,
            sslValidate: false
        });
        console.log('Connected to DB');

        // Create or find Department
        let dept = await Department.findOne({ code: 'BIOTECH' });
        if (!dept) {
            dept = await Department.create({ name: 'Biotechnology', code: 'BIOTECH' });
            console.log('Created Department');
        }

        // Create or find Course
        let course = await Course.findOne({ code: 'BTECH-BIO' });
        if (!course) {
            course = await Course.create({ name: 'B.Tech Biotechnology', code: 'BTECH-BIO', department: dept._id });
            console.log('Created Course');
        }

        // Create or find Subject
        let subject = await Subject.findOne({ code: 'BIO101' });
        if (!subject) {
            subject = await Subject.create({
                name: 'Genetic Engineering',
                code: 'BIO101',
                department: dept._id,
                course: course._id,
                semester: 1
            });
            console.log('Created Subject');
        }

        // Assign to teacher
        const teacher = await User.findOne({ email: 'bioteacher@example.com' });
        if (teacher) {
            if (!teacher.teacherDetails.department) {
                teacher.teacherDetails.department = dept._id;
            }
            if (!teacher.teacherDetails.subjects.includes(subject._id)) {
                teacher.teacherDetails.subjects.push(subject._id);
            }
            await teacher.save();
            console.log('Updated Teacher Data');
            console.log('Teacher subjects:', teacher.teacherDetails.subjects);
        } else {
            console.log('Teacher not found (bioteacher@example.com)');
        }

        // Assign to student
        const student = await User.findOne({ email: 'biostudent@example.com' });
        if (student) {
            student.studentDetails = {
                rollNumber: 'BIO-2026-001',
                department: dept._id,
                course: course._id,
                semester: 1,
                division: 'A'
            };
            await student.save();
            console.log('Updated Student Data');
        } else {
            console.log('Student not found (biostudent@example.com)');
        }

        console.log('Setup Complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

setupTestData();
