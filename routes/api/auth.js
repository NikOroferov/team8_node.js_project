const express = require('express');
const path = require('path');
const { auth, validation, ctrlWrapper } = require('../../middlewares');
const { auth: ctrl } = require('../../controllers');
const { joiUserSchema } = require('../../models/user');

const router = express.Router();

router.post('/register', validation(joiUserSchema), ctrlWrapper(ctrl.register));
router.post('/login', validation(joiUserSchema), ctrlWrapper(ctrl.login));
router.get('/googleLogin', ctrlWrapper(ctrl.googleLogin));
router.get('/google-redirect', ctrlWrapper(ctrl.googleRedirect));
router.post('/logout', auth, ctrlWrapper(ctrl.logout));
router.post('/forgotPassword', ctrlWrapper(ctrl.forgotPassword));
router.use('/link', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/link.html'));
});

module.exports = router;
