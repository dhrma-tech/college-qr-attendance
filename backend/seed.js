const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { Department, Course, Subject } = require('./models/Academic');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Department.deleteMany();
        await Course.deleteMany();
        await Subject.deleteMany();

        // 1. Create Departments
        const csDept = await Department.create({ name: 'Computer Science', code: 'CS' });
        const eeDept = await Department.create({ name: 'Electrical Engineering', code: 'EE' });
        const mechDept = await Department.create({ name: 'Mechanical Engineering', code: 'ME' });

        // 2. Create Courses
        const btechCS = await Course.create({ name: 'B.Tech CS', code: 'BTCS', department: csDept._id });
        const btechEE = await Course.create({ name: 'B.Tech EE', code: 'BTEE', department: eeDept._id });
        const btechME = await Course.create({ name: 'B.Tech ME', code: 'BTME', department: mechDept._id });

        // 3. Create Admin
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@college.edu',
            password: 'password123',
            role: 'admin'
        });

        // 4. Create HODs
        const hodCS = await User.create({
            name: 'Dr. Grace Hopper',
            email: 'hod@college.edu',
            password: 'password123',
            role: 'hod',
            teacherDetails: { teacherId: 'H001', department: csDept._id }
        });

        // 5. Create Teachers (WITHOUT subjects first — we'll assign after)
        const teacher1 = await User.create({
            name: 'Dr. Alan Turing',
            email: 'alan@college.edu',
            password: 'password123',
            role: 'teacher',
            teacherDetails: { teacherId: 'T001', department: csDept._id }
        });

        const teacher2 = await User.create({
            name: 'Dr. Nikola Tesla',
            email: 'tesla@college.edu',
            password: 'password123',
            role: 'teacher',
            teacherDetails: { teacherId: 'T002', department: eeDept._id }
        });

        const teacher3 = await User.create({
            name: 'Dr. Marie Curie',
            email: 'curie@college.edu',
            password: 'password123',
            role: 'teacher',
            teacherDetails: { teacherId: 'T003', department: csDept._id }
        });

        // 6. Create Subjects
        const sub1 = await Subject.create({
            name: 'Data Structures',
            code: 'CS101',
            department: csDept._id,
            course: btechCS._id,
            semester: 3,
            teacher: teacher1._id
        });

        const sub2 = await Subject.create({
            name: 'Algorithms',
            code: 'CS102',
            department: csDept._id,
            course: btechCS._id,
            semester: 3,
            teacher: teacher1._id
        });

        const sub3 = await Subject.create({
            name: 'Circuit Theory',
            code: 'EE101',
            department: eeDept._id,
            course: btechEE._id,
            semester: 3,
            teacher: teacher2._id
        });

        const sub4 = await Subject.create({
            name: 'Machine Learning',
            code: 'CS201',
            department: csDept._id,
            course: btechCS._id,
            semester: 5,
            teacher: teacher3._id
        });

        // 7. Assign subjects back to teachers
        await User.findByIdAndUpdate(teacher1._id, {
            'teacherDetails.subjects': [sub1._id, sub2._id]
        });

        await User.findByIdAndUpdate(teacher2._id, {
            'teacherDetails.subjects': [sub3._id]
        });

        await User.findByIdAndUpdate(teacher3._id, {
            'teacherDetails.subjects': [sub4._id]
        });

        // 8. Create Students
        for (let i = 1; i <= 20; i++) {
            await User.create({
                name: `Student ${i}`,
                email: `student${i}@college.edu`,
                password: 'password123',
                role: 'student',
                studentDetails: {
                    rollNumber: `CS21B${String(i).padStart(3, '0')}`,
                    department: csDept._id,
                    course: btechCS._id,
                    semester: 3,
                    division: i <= 10 ? 'A' : 'B'
                }
            });
        }

        console.log('✅ Seed data created successfully!');
        console.log('   Admin:   admin@college.edu / password123');
        console.log('   HOD:     hod@college.edu / password123');
        console.log('   Teacher: alan@college.edu / password123 (2 subjects)');
        console.log('   Teacher: tesla@college.edu / password123 (1 subject)');
        console.log('   Teacher: curie@college.edu / password123 (1 subject)');
        console.log('   Students: student1@college.edu ... student20@college.edu / password123');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        if (err.name === 'ValidationError') {
            console.error('Validation Details:', err.errors);
        }
        process.exit(1);
    }
};

seedData();
