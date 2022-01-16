const express = require('express');

const { auth, upload, ctrlWrapper } = require('../../middlewares');
const { users: ctrl } = require('../../controllers');

const router = express.Router();

router.get('/current', auth, ctrlWrapper(ctrl.getCurrent));

router.patch(
  '/avatars',
  auth,
  upload.single('avatar'),
  ctrlWrapper(ctrl.updateAvatar),
);

router.get('/verify/:verificationToken', ctrlWrapper(ctrl.verify));

router.post('/verify', ctrlWrapper(ctrl.repeatVerifyEmail));

module.exports = router;
