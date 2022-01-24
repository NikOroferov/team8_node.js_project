const express = require('express');

const { auth, validation, ctrlWrapper } = require('../../middlewares');
const { auth: ctrl } = require('../../controllers');
const { joiUserSchema } = require('../../models/user');

const router = express.Router();

router.post('/register', validation(joiUserSchema), ctrlWrapper(ctrl.register));
router.post('/login', validation(joiUserSchema), ctrlWrapper(ctrl.login));
router.get('/googleLogin', ctrlWrapper(ctrl.googleLogin));
router.get('/googleRedirect', ctrlWrapper(ctrl.googleRedirect));
router.post('/logout', auth, ctrlWrapper(ctrl.logout));
router.post('/forgotPassword', ctrlWrapper(ctrl.forgotPasswordController));

module.exports = router;
