const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const theweeklist = require('./models/weekListModels');

dotenv.config();
const app = express();
const port = process.env.PORT;
const mongoKey = process.env.MONGO_DB_URL;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const key = process.env.JWTSECRET_KEY;




app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, age, gender, mobile } = req.body;


    const user = await theweeklist.findOne({ email })
    if (user) {
      return res.status(409).json({
        success: false,
        message: 'You Are Already a User'
      })
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await theweeklist.create(

        { name, email, password: encryptedPassword, age, gender, mobile }
      );

      const token = jwt.sign({ _id: newUser._id }, key, { expiresIn: '1h' });

      res.cookie('token', token, { httpOnly: true, maxAge: 11 * 61 * 1000 }).status(201).json({
        success: true,
        message: 'You Registered Successfully!'
      })
    }

   

  } catch (error) {
    res.json({
      status: 'fail',
      message: "error"
    })
  }
});








// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await theweeklist.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign({_id : user._id}, key)
            return res.status(200).cookie("token", token, {httpOnly : true, maxAge : 11 * 61 * 1000}).json({
                success : true,
                message : 'Logged in successfully'
            })
    
    
    // res.json({ token });
  
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});












app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Health Check api___________________________________________________________
app.get('/health', (req, res) => {

  const serverName = 'the_week_list';
  const currentTime = new Date().toLocaleString();// show time __________________________________________________________
  var serverState = 'active';

  const healthApi = {
    serverName,
    currentTime,
    serverState,
  };

  res.json(healthApi);

});


app.use(function (req, res, next) {

  var auth = false;

  if (auth) {
    next();
  } else {
    return res.status(404).send("Route not found");
  }
});



app.listen(port, () => {

  mongoose.connect(mongoKey)
    .then(console.log(`Server is running on http://localhost:${port}`))
    .catch(err => console.error(err));

});



