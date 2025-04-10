const express = require('express');
const cors = require('cors');
const { conn } = require('./config/gridfsConnection.js');
const { dbConnect } = require('./config/database.js');
const fileRoute = require('./routes/file.route.js')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors())

app.use('/code', fileRoute)

dbConnect()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})