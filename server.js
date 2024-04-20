const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const rootRouter = require('./routers');
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'views')));

app.use(express.json()); 
app.use(cors());
app.use("/android", rootRouter);

app.get('/change-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'change-password.html'));
});

const {MONGO_URL} = process.env;

mongoose.connect(MONGO_URL)
  .then(() => console.log('Connect to mongoDB successfully'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(PORT,async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});