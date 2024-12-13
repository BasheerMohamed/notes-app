import express from 'express';
import {register, login, logout, isAuthenticated, addNotes, editNotes, getNotes, deleteNotes, updatePinnedNotes, searchNotes} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter =  express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/add-notes', userAuth, addNotes);
authRouter.put('/edit-notes/:notesId', userAuth, editNotes);
authRouter.get('/get-notes', userAuth, getNotes);
authRouter.delete('/delete-notes/:notesId', userAuth, deleteNotes);
authRouter.put('/update-pin/:notesId', userAuth, updatePinnedNotes);
authRouter.get('/search-notes', userAuth, searchNotes);

export default authRouter;