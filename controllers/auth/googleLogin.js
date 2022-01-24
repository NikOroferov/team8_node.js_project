const queryString = require('query-string');
const jwt = require('jsonwebtoken');
const axios = require('axios');
// const URL = require('url');
const { User } = require('../../models');

const {
  BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SECRET_KEY,
  FRONTEND_URL,
} = process.env;

const googleLogin = (req, res) => {
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
    url: `https://oauth2.googleapis.com/token`,
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

  const user = await User.findOne({ email: userData.data.email });
  let token = '';

  const createToken = async id => {
    const payload = {
      id: user._id,
    };
    token = await jwt.sign(payload, SECRET_KEY, { expiresIn: '14d' });
    await User.findOneAndUpdate(
      {
        avatar: userData.data.avatar,
        name: userData.data.name,
        email: userData.data.email,
        balance: user.balance,
      },
      { token },
    );
  };

  if (!user) {
    await User.create({
      avatar: userData.data.avatar,
      name: userData.data.name,
      email: userData.data.email,
      balance: user.balance,
    });
    await createToken(user._id);
  } else {
    await createToken(user._id);
  }

  return res.redirect(
    `${FRONTEND_URL}google-redirect/?access_token=${token}&email=${user.email}&avatar=${user.avatar}&name=${user.name}`,
  );
};

module.exports = googleLogin;
module.exports = googleRedirect;
