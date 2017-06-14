import mongoose from 'mongoose';

const { Schema } = mongoose;

const MessageModel = new Schema({
    user: String,
    messages: Array
});

export default mongoose.model('Message', MessageModel);