"use strict";

require('dotenv').config();

var express = require('express');

var axios = require('axios');

var jwt = require('jsonwebtoken');

var Admin = require('../models/Admin');

var router = express.Router();
var config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  redirectUrl: process.env.REDIRECT_URL,
  clientUrl: process.env.CLIENT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: 60000 * 60,
  postUrl: 'https://jsonplaceholder.typicode.com/posts'
};

var getAuthParams = function getAuthParams() {
  var params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    state: 'standard_oauth',
    prompt: 'consent'
  });
  return params.toString();
};

var getTokenParams = function getTokenParams(code) {
  var params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl
  });
  return params.toString();
};

router.get('/auth/url', function (_, res) {
  res.json({
    url: "".concat(config.authUrl, "?").concat(getAuthParams())
  });
});
router.get('/auth/token', function _callee(req, res) {
  var code, tokenParam, _ref, id_token, _jwt$decode, email, name, picture, user, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          code = req.query.code;

          if (code) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Authorization code must be provided'
          }));

        case 3:
          _context.prev = 3;
          tokenParam = getTokenParams(code);
          _context.next = 7;
          return regeneratorRuntime.awrap(axios.post("".concat(config.tokenUrl, "?").concat(tokenParam)));

        case 7:
          _ref = _context.sent;
          id_token = _ref.data.id_token;

          if (id_token) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Auth error'
          }));

        case 11:
          _jwt$decode = jwt.decode(id_token), email = _jwt$decode.email, name = _jwt$decode.name, picture = _jwt$decode.picture;
          user = {
            name: name,
            email: email,
            picture: picture
          };
          token = jwt.sign({
            user: user
          }, config.tokenSecret, {
            expiresIn: config.tokenExpiration
          });
          res.cookie('token', token, {
            maxAge: config.tokenExpiration,
            httpOnly: true
          });
          res.status(201).json({
            user: user
          });
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](3);
          console.error('Error: ', _context.t0);
          res.status(500).json({
            message: _context.t0.message || 'Server error'
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 18]]);
});
router.get('/auth/logged_in', function _callee2(req, res) {
  var token, _jwt$verify, user, admin, alladmins, newToken;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          token = req.cookies.token;

          if (token) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.json({
            loggedIn: false
          }));

        case 4:
          _jwt$verify = jwt.verify(token, config.tokenSecret), user = _jwt$verify.user;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Admin.findOne({
            email: user.email
          }));

        case 7:
          admin = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(Admin.find());

        case 10:
          alladmins = _context2.sent;

          if (admin) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.json({
            loggedIn: false
          }));

        case 13:
          newToken = jwt.sign({
            user: user
          }, config.tokenSecret, {
            expiresIn: config.tokenExpiration
          });
          res.cookie('token', newToken, {
            maxAge: config.tokenExpiration,
            httpOnly: true
          });
          res.status(200).json({
            loggedIn: true,
            user: user
          });
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          res.json({
            loggedIn: false
          });

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
router.post('/auth/logout', function (_, res) {
  res.clearCookie('token').json({
    message: 'Logged out'
  });
});
router.post('/addadmin', function _callee3(req, res) {
  var _req$body, email, username, token, _jwt$verify2, user, admin;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, username = _req$body.username;
          _context3.prev = 1;
          token = req.cookies.token;

          if (token) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.json({
            loggedIn: false
          }));

        case 5:
          _jwt$verify2 = jwt.verify(token, config.tokenSecret), user = _jwt$verify2.user;

          if (!(!user || user.isAdmin == false)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(401).json({
            message: 'Unauthorized'
          }));

        case 8:
          admin = new Admin({
            email: email,
            username: username
          });
          _context3.next = 11;
          return regeneratorRuntime.awrap(admin.save());

        case 11:
          res.status(201).json({
            message: 'Admin added successfully'
          });
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: _context3.t0.message || 'Server error'
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 14]]);
});
router.post('/superadmin', function _callee4(req, res) {
  var _req$body2, email, username, isAdmin, admin;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, username = _req$body2.username, isAdmin = _req$body2.isAdmin;
          _context4.prev = 1;
          admin = new Admin({
            email: email,
            username: username,
            isAdmin: true
          });
          _context4.next = 5;
          return regeneratorRuntime.awrap(admin.save());

        case 5:
          res.status(200).json(admin);
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            message: _context4.t0.message || 'Server error'
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.get('/alladmins', function _callee5(req, res) {
  var alladmins;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Admin.find());

        case 3:
          alladmins = _context5.sent;
          res.status(200).json(alladmins);
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: _context5.t0.message || 'Server error'
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router["delete"]('/deleteadmin/:id', function _callee6(req, res) {
  var token, _jwt$verify3, user, id, admin, deleting;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          token = req.cookies.token;

          if (token) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.json({
            loggedIn: false
          }));

        case 4:
          _jwt$verify3 = jwt.verify(token, config.tokenSecret), user = _jwt$verify3.user;
          id = req.params.id;
          _context6.next = 8;
          return regeneratorRuntime.awrap(Admin.findOne({
            email: user.email
          }));

        case 8:
          admin = _context6.sent;
          _context6.next = 11;
          return regeneratorRuntime.awrap(Admin.findById(id));

        case 11:
          deleting = _context6.sent;
          console.log(admin);
          console.log(user);

          if (!(!user || admin.isAdmin == false || deleting.isAdmin == true)) {
            _context6.next = 16;
            break;
          }

          return _context6.abrupt("return", res.status(401).json({
            message: 'Unauthorized'
          }));

        case 16:
          _context6.next = 18;
          return regeneratorRuntime.awrap(Admin.findByIdAndDelete(id));

        case 18:
          res.status(200).json({
            message: 'Admin deleted successfully'
          });
          _context6.next = 24;
          break;

        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: 'delete nhi hua'
          });

        case 24:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
module.exports = router;