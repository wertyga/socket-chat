import mongoose from 'mongoose';

const { Schema } = mongoose;

const ClientSchema = new Schema({
    token: String
});

export default mongoose.model('Client', ClientSchema);