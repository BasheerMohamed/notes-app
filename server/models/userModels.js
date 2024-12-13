import mongoose from "mongoose";

// Defining the user schema with the fields and their validation rules...
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdOn: {type: Date, default: new Date().getTime()},
});

const userModal = mongoose.models.user || mongoose.model('user', userSchema);

export default userModal;