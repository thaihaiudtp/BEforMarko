const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('./passport');
const router = require('./router/index');
require('dotenv').config();
const connect = require('./db');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_KEY,  // Chuỗi bí mật để mã hóa session
  resave: false,              // Không lưu session nếu không thay đổi
  saveUninitialized: false,    // Không tạo session mới nếu không cần
  cookie: { secure: false }    // Để `true` nếu dùng HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());
connect.connectDB();
router(app);
const PORT = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})