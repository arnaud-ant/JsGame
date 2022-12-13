const mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    content: String,
});

mongoose.model('chat', chatSchema);