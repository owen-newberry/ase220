const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-username', authMiddleware.protect, authController.verifyUsername);
router.post('/verify-email', authMiddleware.protect, authController.verifyEmail);
router.post('/verify-password', authMiddleware.protect, authController.verifyPassword);
router.put('/password', authMiddleware.protect, authController.updatePassword);
router.put('/email', authMiddleware.protect, authController.updateEmail);
router.put('/username', authMiddleware.protect, authController.updateUsername);
router.get('/', authMiddleware.protect, authController.readUser);
router.delete('/', authMiddleware.protect, authController.deleteUser);

module.exports = router;