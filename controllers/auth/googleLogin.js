const queryString = require('query-string');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { User } = require('../../models');
const {
  BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SECRET_KEY,
  FRONTEND_URL,
} = process.env;

const googleLogin = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: 'https://oauth2.googleapis.com/token',
    method: 'post',
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });

  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const email = userData.data.email;
  const name = userData.data.name;
  const avatar = userData.data.picture;

  const user = await User.findOne({ email });
  if (!user) {
    const password = nanoid();
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = {
      avatar: avatar,
      name: name,
      email: email,
      password: hashPassword,
    };

    const user = await User.create(newUser);
    const { id } = user;
    const payload = { id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '14d' });
    await User.findByIdAndUpdate(id, { token });

    return res.redirect(
      `${FRONTEND_URL}/google-redirect/?access_token=${user.token}&email=${user.email}&avatar=${user.avatar}&balance=${user.balance}&name=${user.name}`,
    );
  }

  const { id } = user;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '14d' });
  await User.findByIdAndUpdate(id, { token });
  if (!avatar === userData.data.picture) {
    User.findByIdAndUpdate(id, { avatar });
  }

  return res.redirect(
    `${FRONTEND_URL}/google-redirect/?access_token=${user.token}&email=${user.email}&avatar=${user.avatar}&balance=${user.balance}&name=${user.name}`,
  );
};

module.exports = {
  googleLogin,
  googleRedirect,
};
