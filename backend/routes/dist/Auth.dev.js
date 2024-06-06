"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var bcrypt = require("bcrypt");

var router = require("express").Router();

var nodemailer = require("nodemailer");

var User = require("../models/User");

var DailyImages = require("../models/DailyImages");

var Notifications = require("../models/Notification");

var jwt = require("jsonwebtoken");

var JWT_SEC = "mysecretkey101";

var amqplib = require('amqplib');

var redis = require("redis"); // const client = redis.createClient({
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//       host: 'redis-12250.c8.us-east-1-3.ec2.redns.redis-cloud.com',
//       port: 12250
//   },
// });
// client.connect(console.log("Redis Connected")).catch(console.error);


var defaultExpiration = 600; //REGISTER

router.post("/register", function _callee(req, res) {
  var salt, hashedPass, newUser, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 3:
          salt = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, salt));

        case 6:
          hashedPass = _context.sent;
          newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            phone: req.body.phone,
            address: req.body.address
          }); //saving the new user

          _context.next = 10;
          return regeneratorRuntime.awrap(newUser.save());

        case 10:
          user = _context.sent;
          //   client.del(`user`, function(err, response) {
          //     if (err) throw err;
          //     console.log(response);
          //  });
          res.status(200).json(user);
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          res.status(500).json(_context.t0);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); //LOGIN

router.post("/login", function _callee2(req, res) {
  var user, validated, accessToken, _user$_doc, password, others, responseData;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            username: req.body.username
          }));

        case 3:
          user = _context2.sent;
          !user && res.status(400).json("Wrong credentials!");
          _context2.next = 7;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 7:
          validated = _context2.sent;
          //serverside error of user
          !validated && res.status(400).json("Wrong credentials!"); // except password all the other parmas will be stored in others ...from user._doc as object

          accessToken = jwt.sign({
            id: user._id,
            username: user.username
          }, JWT_SEC, {
            expiresIn: "3d"
          });
          _user$_doc = user._doc, password = _user$_doc.password, others = _objectWithoutProperties(_user$_doc, ["password"]);
          responseData = _objectSpread({
            accessToken: accessToken
          }, others);
          res.status(200).json(responseData);
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          //internal db error
          res.status(500).json(_context2.t0);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
}); // Delete user endpoint

router["delete"]("/users/:id", function _callee3(req, res) {
  var deletedUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndDelete(req.params.id));

        case 3:
          deletedUser = _context3.sent;

          if (deletedUser) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).send("User not found"));

        case 6:
          //     client.del('user', function(err, response) {
          //       if (err) throw err;
          //       console.log(response);
          //    });
          //    client.del(`user-${req.params.id}`,function(err, response) {
          //     if (err) throw err;
          //     console.log(response);
          //  })
          res.status(200).json({
            message: "User deleted successfully"
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.get('/users/:id?', function _callee4(req, res) {
  var id, users, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;

          if (id) {
            _context4.next = 14;
            break;
          }

          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.find());

        case 5:
          users = _context4.sent;
          //client.setEx('user', defaultExpiration, JSON.stringify(users));
          console.log("Cachee");
          return _context4.abrupt("return", res.status(200).json(users));

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](2);
          console.error(_context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            message: 'Internal Server Error'
          }));

        case 14:
          _context4.prev = 14;
          _context4.next = 17;
          return regeneratorRuntime.awrap(User.findById(id));

        case 17:
          user = _context4.sent;

          if (!user) {
            _context4.next = 22;
            break;
          }

          return _context4.abrupt("return", res.status(200).json(user));

        case 22:
          return _context4.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 23:
          _context4.next = 29;
          break;

        case 25:
          _context4.prev = 25;
          _context4.t1 = _context4["catch"](14);
          console.error(_context4.t1);
          return _context4.abrupt("return", res.status(500).json({
            message: 'Internal Server Error'
          }));

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 10], [14, 25]]);
});

var sendVerificationEmail = function sendVerificationEmail(email, rating, date, overall) {
  var transporter, mailOptions;
  return regeneratorRuntime.async(function sendVerificationEmail$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // Create a Nodemailer transporter
          transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "maitisattwik@gmail.com",
              pass: "asiepkljrnykrrhw"
            }
          }); // Compose email message

          mailOptions = {
            from: "no-reply@gmail.com",
            to: email,
            subject: "Jythu Report for ".concat(date),
            html: "\n      <p>You have been rated ".concat(rating, " for Date : ").concat(date, ". Your Overall Rating is ").concat(overall, ".</p>\n      <ul>\n         <div>Employee Rating Category</div>\n        <li><span style=\"color: #27ae60;\">4-5: Excellent Employee</span></li>\n        <li><span style=\"color: #2980b9;\">3-3.9: Good Employee</span></li>\n        <li><span style=\"color: #c0392b;\">Below 3: Satisfactory Employee</span></li>\n      </ul>\n    ")
          }; // Send the email

          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          console.log("Attendence email sent successfully");
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](2);
          console.error("Error sending Attendence email:", _context5.t0);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 8]]);
};

router.post("/users/attendence-rating/:id", function _callee5(req, res) {
  var id, _req$body, date, attendence, rating, user, data, presentDays, totalRating, averageRating;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _req$body = req.body, date = _req$body.date, attendence = _req$body.attendence, rating = _req$body.rating;
          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(User.findById(id));

        case 5:
          user = _context6.sent;

          if (user) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 8:
          user.attendance_rating.push({
            date: date,
            attendence: attendence,
            rating: rating
          });
          _context6.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          data = user.attendance_rating;
          presentDays = data.filter(function (item) {
            return item.attendence === 'Present';
          });
          totalRating = presentDays.reduce(function (acc, curr) {
            return acc + curr.rating;
          }, 0);
          averageRating = totalRating / presentDays.length;
          sendVerificationEmail(user.email, rating, date, averageRating);
          res.status(200).json({
            message: "Attendance record added successfully",
            user: user
          }); //   client.del(`user-${id}`, function(err, response) {
          //     if (err) throw err;
          //     console.log(response);
          //  });

          _context6.next = 22;
          break;

        case 19:
          _context6.prev = 19;
          _context6.t0 = _context6["catch"](2);
          res.status(500).json({
            message: _context6.t0.message
          });

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 19]]);
});
router.post("/update-dailyimages/:id", function _callee6(req, res) {
  var id, _req$body2, url, filename, time, record;

  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, url = _req$body2.url, filename = _req$body2.filename;
          time = new Date();
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(User.findById(id));

        case 6:
          record = _context7.sent;

          if (record) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "Record not found"
          }));

        case 9:
          record.dailyimages.push({
            url: url,
            filename: filename,
            time: time
          });
          _context7.next = 12;
          return regeneratorRuntime.awrap(record.save());

        case 12:
          res.json({
            message: "Daily images updated successfully",
            record: record
          });
          _context7.next = 18;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](3);
          res.status(500).json({
            message: "Server error",
            error: _context7.t0
          });

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 15]]);
});

function formatDateToYYYYMMDD(date) {
  var d = new Date(date);
  var year = d.getFullYear();
  var month = ('0' + (d.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns month from 0-11

  var day = ('0' + d.getDate()).slice(-2);
  return "".concat(year, "-").concat(month, "-").concat(day);
}

router.post("/update-dailyworking/:id", function _callee7(req, res) {
  var id, _req$body3, filename, fileDetails, starttime, endtime, record, formattedStarttime, formattedEndtime, newNotification;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id;
          _req$body3 = req.body, filename = _req$body3.filename, fileDetails = _req$body3.fileDetails, starttime = _req$body3.starttime, endtime = _req$body3.endtime;
          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(User.findById(id));

        case 5:
          record = _context8.sent;

          if (record) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "Record not found"
          }));

        case 8:
          formattedStarttime = formatDateToYYYYMMDD(starttime);
          formattedEndtime = formatDateToYYYYMMDD(endtime);
          console.log(formattedStarttime);
          record.dailyworking.push({
            filename: filename,
            fileDetails: fileDetails,
            starttime: formattedStarttime,
            endtime: formattedEndtime
          });
          _context8.next = 14;
          return regeneratorRuntime.awrap(record.save());

        case 14:
          newNotification = new Notifications({
            starttime: starttime,
            endtime: new Date(),
            id: id
          });
          _context8.next = 17;
          return regeneratorRuntime.awrap(newNotification.save());

        case 17:
          res.json({
            message: "Daily working updated successfully",
            record: record
          });
          _context8.next = 23;
          break;

        case 20:
          _context8.prev = 20;
          _context8.t0 = _context8["catch"](2);
          res.status(500).json(_context8.t0.message);

        case 23:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 20]]);
}); // Route to clear anotherArray

router.post("/clear-dailyworking/:id", function _callee8(req, res) {
  var id, record;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          id = req.params.id;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(User.findById(id));

        case 4:
          record = _context9.sent;

          if (record) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "Record not found"
          }));

        case 7:
          record.dailyworking = [];
          _context9.next = 10;
          return regeneratorRuntime.awrap(record.save());

        case 10:
          res.json({
            message: "Another array cleared successfully",
            record: record
          });
          _context9.next = 16;
          break;

        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](1);
          res.status(500).json({
            message: "Server error",
            error: _context9.t0
          });

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 13]]);
});
router["delete"]("/notification/:id", function _callee9(req, res) {
  var deletedNotification;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(Notifications.findByIdAndDelete(req.params.id));

        case 3:
          deletedNotification = _context10.sent;

          if (deletedNotification) {
            _context10.next = 6;
            break;
          }

          return _context10.abrupt("return", res.status(404).send("Notification not found"));

        case 6:
          res.status(200).json({
            message: "Notification deleted successfully"
          });
          _context10.next = 12;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          res.status(500).json({
            message: _context10.t0.message
          });

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.get('/notifications', function _callee10(req, res) {
  var notifications;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(Notifications.find().sort({
            createdAt: -1
          }));

        case 3:
          notifications = _context11.sent;
          // Sort by timestamp in descending order
          res.status(200).json(notifications);
          _context11.next = 10;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          res.status(500).json({
            message: _context11.t0.message
          });

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/daily-images/:id', function _callee11(req, res) {
  var id, record;
  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          id = req.params.id;
          _context12.prev = 1;
          _context12.next = 4;
          return regeneratorRuntime.awrap(DailyImages.find({
            id: id
          }));

        case 4:
          record = _context12.sent;

          if (record) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", res.status(404).json({
            message: "Record not found"
          }));

        case 7:
          res.status(200).json(record);
          _context12.next = 13;
          break;

        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](1);
          res.status(500).json({
            message: "Server error",
            error: _context12.t0
          });

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
router.post('/message-queue-consume', function _callee13(req, res) {
  var connection, channel, q;
  return regeneratorRuntime.async(function _callee13$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(amqplib.connect('amqps://utgyzrpa:hm9tdxn0T28bYMu9Gt9GTWglydV5lsg5@moose.rmq.cloudamqp.com/utgyzrpa'));

        case 3:
          connection = _context14.sent;
          _context14.next = 6;
          return regeneratorRuntime.awrap(connection.createChannel());

        case 6:
          channel = _context14.sent;
          _context14.next = 9;
          return regeneratorRuntime.awrap(channel.assertQueue('Screenshots'));

        case 9:
          q = _context14.sent;
          console.log(q);
          _context14.next = 13;
          return regeneratorRuntime.awrap(channel.consume('Screenshots', function _callee12(message) {
            var data, dailyimages;
            return regeneratorRuntime.async(function _callee12$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    data = JSON.parse(message.content.toString());
                    dailyimages = new DailyImages({
                      url: data.url,
                      filename: data.filename,
                      id: data.id,
                      time: data.time
                    });
                    _context13.next = 4;
                    return regeneratorRuntime.awrap(dailyimages.save());

                  case 4:
                    channel.ack(message);

                  case 5:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          }));

        case 13:
          return _context14.abrupt("return", res.status(200).json({
            message: "Uploaded successfully"
          }));

        case 16:
          _context14.prev = 16;
          _context14.t0 = _context14["catch"](0);
          return _context14.abrupt("return", res.status(400).json({
            message: "Notification not"
          }));

        case 19:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
module.exports = router;