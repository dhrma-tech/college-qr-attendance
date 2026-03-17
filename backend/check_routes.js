const express = require('express');
const router = require('./routes/attendanceRoutes');

console.log('--- Attendance Routes ---');
router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(`${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`);
    }
});
