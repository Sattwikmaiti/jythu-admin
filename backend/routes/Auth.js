
const bcrypt = require("bcrypt");

const router = require("express").Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const DailyImages = require("../models/DailyImages");
const Notifications = require("../models/Notification");
const jwt = require("jsonwebtoken");
const JWT_SEC = "mysecretkey101";
const amqplib=require('amqplib')
const redis = require("redis");

let client;

(async () => {
  client =redis.createClient({
    password: "sDX5SrYQgoj3akCxBp5VvyvamhgGijCL",
    socket: {
        host: 'redis-12250.c8.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 12250
    },
   
  });

  client.on("error", (error) => console.error(`Error : ${error}`));

  await client.connect(console.log("Redis connected"));
})();

// const client = await createClient({
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//       host: 'redis-12250.c8.us-east-1-3.ec2.redns.redis-cloud.com',
//       port: 12250
//   },
 
// }).on('error', err => console.log('Redis Client Error', err)).connect(console.log("Redis Connected")).catch((err)=>console.log(err));
// client.connect(console.log("Redis Connected")).catch(console.error);
const defaultExpiration = 600;

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //salt is a random string , generated in  time=10
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      phone: req.body.phone,
      address: req.body.address,
    });
    //saving the new user
    const user = await newUser.save();
    client.del(`user`, function(err, response) {
      if (err) throw err;
      console.log(response);
   });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    //serverside error of user
    !validated && res.status(400).json("Wrong credentials!");
    // except password all the other parmas will be stored in others ...from user._doc as object

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SEC,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;
    const responseData = { accessToken, ...others };
    res.status(200).json(responseData);
  } catch (err) {
    //internal db error

    res.status(500).json(err);
  }
});

// Delete user endpoint
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }


    await client.del('user');
    await client.del(`user-${req.params.id}`)

 
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.get('/users/:id?', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    try {
      const usersFromCache=await client.get('user')
      console.log("users")
      if (usersFromCache) {
        return res.status(200).json(JSON.parse(usersFromCache));
      } else {
        const users = await User.find();
      await client.setEx('user', defaultExpiration, JSON.stringify(users));
        console.log("Cachee")
        return res.status(200).json(users);
      
    } } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  try {
    const userFromCache = await client.get(`user-${id}`)
       
    if (userFromCache) {
      return res.status(200).json(JSON.parse(userFromCache));
    }

    const user = await User.findById(id);
    if (user) {
    await client.setEx(`user-${id}`, defaultExpiration, JSON.stringify(user));
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

const sendVerificationEmail = async (email,rating,date,overall) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "maitisattwik@gmail.com",
          pass: "asiepkljrnykrrhw",
      },
  });

  // Compose email message
  const mailOptions = {
    from: "no-reply@gmail.com",
    to: email,
    subject: `Jythu Report for ${date}`,
    html: `
      <p>You have been rated ${rating} for Date : ${date}. Your Overall Rating is ${overall}.</p>
      <ul>
         <div>Employee Rating Category</div>
        <li><span style="color: #27ae60;">4-5: Excellent Employee</span></li>
        <li><span style="color: #2980b9;">3-3.9: Good Employee</span></li>
        <li><span style="color: #c0392b;">Below 3: Satisfactory Employee</span></li>
      </ul>
    `,
  };

  // Send the email
  try {
      await transporter.sendMail(mailOptions);
      console.log("Attendence email sent successfully");
  } catch (error) {
      console.error("Error sending Attendence email:", error);
  }
};
router.post("/users/attendence-rating/:id", async (req, res) => {
  const { id } = req.params;
  const { date, attendence, rating } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.attendance_rating.push({ date, attendence, rating });
    await user.save();
    const data=user.attendance_rating

    const presentDays = data.filter(item => item.attendence==='Present');
    const totalRating = presentDays.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalRating / presentDays.length;
   
     sendVerificationEmail(user.email,rating,date,averageRating)
    res
      .status(200)
      .json({ message: "Attendance record added successfully", user });
      await client.del(`user-${id}`)
    //   client.del(`user-${id}`, function(err, response) {
    //     if (err) throw err;
    //     console.log(response);
    //  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }




});

router.post("/update-dailyimages/:id", async (req, res) => {
  const { id } = req.params;

  const { url, filename } = req.body;
  const time = new Date();

  try {
    const record = await User.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    record.dailyimages.push({ url, filename, time });
    await record.save();

    res.json({ message: "Daily images updated successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

function formatDateToYYYYMMDD(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns month from 0-11
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

router.get('/wake-up', (req, res) => {
  res.status(200).send('Server is awake!');
});

router.post("/update-dailyworking/:id", async (req, res) => {
  const { id } = req.params;

  const { filename, fileDetails ,starttime,endtime} = req.body;


  try {
    const record = await User.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    const formattedStarttime = formatDateToYYYYMMDD(starttime);
    const formattedEndtime = formatDateToYYYYMMDD(endtime);
    console.log(formattedStarttime)
    record.dailyworking.push({ filename, fileDetails,starttime:formattedStarttime ,endtime:formattedEndtime});
    await record.save();

     console.log("hello")

    const newNotification = new Notifications({

      starttime: starttime,

      endtime: endtime,
      id: id,
    });

    console.log(newNotification)

    await newNotification.save();


    res.json({ message: "Daily working updated successfully", record });
  } catch (error) {
    res.status(500).json(error.message);
  }





});



// Route to clear anotherArray
router.post("/clear-dailyimages/:id", async (req, res) => {
  const { id } = req.params;

  try {
   
    await DailyImages.deleteMany({id:id})

    res.json({ message: "Another array cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});




router.delete("/notification/:id", async (req, res) => {

  try {
    const deletedNotification = await Notifications.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).send("Notification not found");
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})
router.get('/notifications', async (req, res) => {
  
    try {
      const notifications = await Notifications.find().sort({ createdAt: -1 }); // Sort by timestamp in descending order
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }


})


router.delete('/delete-old-images', async (req, res) => {
  try {
  
    const older = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000);
    
   
    const result = await DailyImages.deleteMany({ time: { $lt: older } });

    res.status(200).json({
      message: 'Old images deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

router.get('/daily-images/:id', async (req, res) => {

  const { id } = req.params;
  
 

  try {

    const record = await DailyImages.find({id:id })
    //console.log("recored",record)
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }

})

router.post('/message-queue-consume', async (req, res) => {
  const connection = await amqplib.connect('amqps://pnobhkqa:JS0dSYi04rHRdExqdtDPNa3Qki3xHDF4@octopus.rmq3.cloudamqp.com/pnobhkqa');
  const channel = await connection.createChannel();
  const q=await channel.assertQueue('jythu-screenshots');
 
  try{
    
    console.log(q)
    if(q.messageCount==0)
      return res.status(200).json({ message: "Uploaded successfully" });
         
   await channel.consume('jythu-screenshots', async (message) => {
        
     const data=JSON.parse(message.content.toString())
   
     

        const dailyimages = new DailyImages({
          url: data.url,
          filename: data.filename,
          id: data.id,
          time:data.time
       
          
        })

    await dailyimages.save();
       
    channel.ack(message);  
       
  
    });
 
   return res.status(200).json({ message: "Uploaded successfully" });
  

  }
  catch(err)
  {
    return res.status(400).json({ message: "Notification not" });
  }

 
})



  



// })


// router.post('/message-queue-consume', async (req, res) => {
//   let connection;
//   let channel;
//   connection = await amqplib.connect('amqps://pnobhkqa:JS0dSYi04rHRdExqdtDPNa3Qki3xHDF4@octopus.rmq3.cloudamqp.com/pnobhkqa');
//   channel = await connection.createChannel();
//   await channel.assertQueue('jythu-screenshots');

//   try {
   
 
//     await channel.consume('jythu-screenshots', async (message) => {
//       try {
//         const data = JSON.parse(message.content.toString());

//         const dailyImages = new DailyImages({
//           url: data.url,
//           filename: data.filename,
//           id: data.id,
//           time: data.time
//         });

//         await dailyImages.save();
//         channel.ack(message);
//       } catch (err) {
//         console.error('Error processing message:', err);
//         if (channel) {
//           channel.nack(message);
//         }
//       }
//     });

//     console.log('Message consumer started.');

//   } catch (err) {
//     console.error('Error starting message consumer:', err);

//   } finally {
//     process.on('exit', async () => {
//       if (channel) {
//         try {
//           await channel.close();
//         } catch (err) {
//           console.error('Error closing channel:', err);
//         }
//       }
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (err) {
//           console.error('Error closing connection:', err);
//         }
//       }
//     });

//     process.on('SIGINT', () => process.exit());
//     process.on('SIGTERM', () => process.exit());
//   }

// });

module.exports = router;
