const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student', 'hod'],
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    // Common fields for Student/Teacher embedded or referenced
    studentDetails: {
        rollNumber: String,
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        semester: Number,
        division: String
    },
    teacherDetails: {
        teacherId: String,
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
