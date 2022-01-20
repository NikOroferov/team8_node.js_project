// const { User } = require('../../models');
// const { nanoid } = require('nanoid');
// const { OAuth2Client } = require('google-auth-library');
// const jwt = require('jsonwebtoken');

// const { GOOGLE_SECRET_KEY, GOOGLE_CLIENT_ID } = process.env;

// const googleUser = new OAuth2Client(GOOGLE_CLIENT_ID);

// const googleLogin = (req, res) => {
//   const { tokenId } = req.body;
//   googleUser
//     .verifyIdToken({
//       idToken: tokenId,
//       audience: GOOGLE_CLIENT_ID,
//     })
//     .then(res => {
//       // eslint-disable-next-line camelcase
//       const { email_verified, name, email } = res.payload;

//       // eslint-disable-next-line camelcase
//       if (email_verified) {
//         User.findOne({ email }).exec((err, user) => {
//           const verificationToken = nanoid();
//           if (err) {
//             return res.status(400).json({
//               error: 'Sorry, an error occurred! Please try again ...',
//             });
//           } else {
//             if (user) {
//               const payload = {
//                 id: user._id,
//               };
//               const token = jwt.sign(payload, GOOGLE_SECRET_KEY, {
//                 expiresIn: '14d',
//               });

//               const { id, email, verificationToken } = user;

//               User.findByIdAndUpdate(user.id, { token });

//               res.json({
//                 user: { id, token, email, verificationToken },
//               });
//             } else {
//               const password = email + GOOGLE_SECRET_KEY;

//               const newUser = new User({
//                 name,
//                 email,
//                 password,
//                 verificationToken,
//               });
//               newUser.save((err, data) => {
//                 if (err) {
//                   return res.status(400).json({
//                     error: 'Sorry, an error occurred! Please try again...',
//                   });
//                 }
//                 const payload = {
//                   id: user._id,
//                 };
//                 const token = jwt.sign(payload, GOOGLE_SECRET_KEY, {
//                   expiresIn: '14d',
//                 });

//                 const { id, email } = newUser;

//                 User.findByIdAndUpdate(data.id, { token });

//                 res.json({
//                   status: 'succes',
//                   code: 200,
//                   data: {
//                     token,
//                     id,
//                     email,
//                     user: {
//                       id: newUser._id,
//                       avatarURL: newUser.avatarURL,
//                       name: newUser.name,
//                       email: newUser.email,
//                       balance: newUser.balance,
//                     },
//                   },
//                 });
//               });
//             }
//           }
//         });
//       }
//     });
// };

// module.exports = googleLogin;

// // import * as queryString from 'query-string';

// // const stringifiedParams = queryString.stringify({
// //   client_id: process.env.GOOGLE_CLIENT_ID,
// //   redirect_uri: process.env.GOOGLE_REDIRECT_URL,
// //   scope: [
// //     'https://www.googleapis.com/auth/userinfo.email',
// //     'https://www.googleapis.com/auth/userinfo.profile',
// //   ].join(' '), // space seperated string
// //   response_type: 'code',
// //   access_type: 'offline',
// //   prompt: 'consent',
// // });

// // const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

// // const urlParams = queryString.parse(window.location.search);

// // if (urlParams.error) {
// //   console.log(`An error occurred: ${urlParams.error}`);
// // } else {
// //   console.log(`The code is: ${urlParams.code}`);
// // }

// // // FrontEnd

// // // import axios from 'axios';

// // // async function getAccessTokenFromCode(code) {
// // //   const { data } = await axios({
// // //     url: `https://oauth2.googleapis.com/token`,
// // //     method: 'post',
// // //     data: {
// // //       client_id: process.env.APP_ID_GOES_HERE,
// // //       client_secret: process.env.APP_SECRET_GOES_HERE,
// // //       redirect_uri: 'https://www.example.com/authenticate/google',
// // //       grant_type: 'authorization_code',
// // //       code,
// // //     },
// // //   });
// // //   console.log(data); // { access_token, expires_in, token_type, refresh_token }
// // //   return data.access_token;
// // // }

// // import axios from 'axios';

// // async function getGoogleUserInfo(access_token) {
// //   const { data } = await axios({
// //     url: 'https://www.googleapis.com/oauth2/v2/userinfo',
// //     method: 'get',
// //     headers: {
// //       Authorization: `Bearer ${access_token}`,
// //     },
// //   });
// //   console.log(data); // { id, email, given_name, family_name }
// //   return data;
// // }
