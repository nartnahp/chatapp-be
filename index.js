const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketModule = require('./controllers/socket.js');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
require('dotenv').config();

app.use(cors());

app.use(express.json());

global.globalThis.server = app.listen(process.env.PORT, () => {
    console.log(`Chat app started on Port ${process.env.PORT}`)
});

// connect to db
mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongooseDB Connection Successful');
}).catch(() => {
    console.log(err.message);
});

// initialize server socket io
socketModule(global.globalThis.server, process.env.CLIENT_URL);

// user detail
app.use('/api/auth', userRoutes);

// conversations detail
app.use('/api/conversations', conversationRoutes);

// messages detail
app.use('/api/messages', messageRoutes);

// upload detail
app.use('/api/upload', uploadRoutes);



