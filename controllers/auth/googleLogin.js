const queryString = require('query-string');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../../models');

const {
  BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SECRET_KEY,
  FRONTEND_URL,
} = process.env;

const googleLogin = (req, res) => {
  const stringifyParams = queryString.stringify({
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
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifyParams}`,
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
    await User.findOneAndUpdate({ email: userData.data.email }, { token });
  };

  if (!user) {
    await User.create({
      avatarURL: userData.avatarURL,
      name: userData.data.name,
      email: userData.data.email,
      balance: user.balance,
    });
    await createToken(user._id);
  } else {
    await createToken(user._id);
  }

  return res.redirect(`${FRONTEND_URL}/google-redirect/?access_token=${token}`);
};

module.exports = googleLogin;
module.exports = googleRedirect;

// // 1.По нажатию пустой кнопки гугл, летит запрос на бек
// // Бек принимает, создает параметры под капотом
// // Что - то в этом духе:

//   const stringifiedParams = queryString.stringify({
//     client_id: process.env.GOOGLE_CLIENT_ID,
//     redirect_uri: ${process.env.BASE_URL}/api/users/google-redirect,
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.email',
//       'https://www.googleapis.com/auth/userinfo.profile',
//     ].join(' '),
//     response_type: 'code',
//     access_type: 'offline',
//     prompt: 'consent',
//   })

// // и вставляет редирект для пользователя

// return res.redirect(
//     https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams},
// )

// // 2.Пользователь редиректится https://accounts.google.com/o/oauth2/v2/auth.....
// // выберает свой емейл если их у него много, попадает к гуглу под капот, он снимает
// // наши параметры его параметры заглянув к нему в браузер если там в сесиях нету следов регистрации в гугле, заставляет его ввести логин и пароль гугл почты, и идет на страницу
// // редиректа которую в запросе указал бек в параметрах

// // 3. Бек по заранее указаному в параметрах поинту redirect_uri: ${process.env.BASE_URL}/api/users/google-redirect принимает инфу от гугла в виде токена и парсит ее вот примерный код

// const googleRedirect = async (req, res) => {
//     const fullUrl = ${req.protocol}://${req.get('host')}${req.originalUrl}
//     const urlObj = new URL(fullUrl)
//     const urlParams = queryString.parse(urlObj.search)
//     const code = urlParams.code
//     const tokenData = await axios({
//         url: 'https://oauth2.googleapis.com/token',
//         method: 'post',
//         data: {
//             client_id: process.env.GOOGLE_CLIENT_ID,
//             client_secret: process.env.GOOGLE_CLIENT_SECRET,
//             redirect_uri: ${process.env.BASE_URL}/api/users/google-redirect,
//             grant_type: 'authorization_code',
//             code,
//         },
//     })
//     const userData = await axios({
//         url: 'https://www.googleapis.com/oauth2/v2/userinfo',
//         method: 'get',
//         headers: {
//             Authorization: Bearer ${tokenData.data.access_token},
//         },
//     })
// //  ............
// //     тут вытянули нужные поля из токена, особенно email, сверили в своей бд есть нету, если нету создаем пользователя, с оговореными полями имя, емейл,
// //         пасворд но пустой или нет тут нужно подумать, аватарка там будет гугловская ссылка, и т.д, записываем в бд, вытягиваем  из бд инфу только что созданного
// //     юзера или уже существующего, и тут у нас два пути засунуть все в токен зашифровать, а на фронте расшифровать или просто в доменную строку через анперсанты натолкать например:
// // результат в таком виде
// // 3.1
// return res.redirect(`${process.env.FRONTEND_URL}/google-redirect/?access_token=${token}`);
// // 3.2
// return res.redirect(
//     `${process.env.HOME_URL}/google-redirect/?token=${token}&email=${
//       user.email
//     }&avatar=${user.avatar}
// // и так далее все оговоренные поля
// //     ............
// }

// // 4. Фронт на уже созданой дополнительной странице гугл редиректа ловит ответ редиректа бека, парсит или только токен или строку с аперсантами, засовывает через редакс в локал токен, и обновляет стейт редакса, и потом происходят редиректы и дальнейшие
