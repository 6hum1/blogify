const {validateUser} = require('../services/authentication');

function checkForAuthenticationCookie(cookieName) {

  return async (req, res, next) => {

      const tokenCookieValue = req.cookies["token"];
    //   console.log(tokenCookieValue);
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = await validateUser(tokenCookieValue);
      req.user = userPayload;
      console.log(userPayload);
    } catch (err) {}

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
