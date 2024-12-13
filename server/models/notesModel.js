import mongoose from "mongoose";

// Defining the user schema with the fields and their validation rules...
const notesSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: {type: [String], default: []},
    isPinned: {type: Boolean, default: false},
    userId: {type: String, required: true},
    createdOn: {type: Date, default: new Date().getTime()},
});

const notesModal = mongoose.models.notes || mongoose.model('notes', notesSchema);

export default notesModal;