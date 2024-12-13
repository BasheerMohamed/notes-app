import bcyprt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModal from "../models/userModels.js";
import notesModal from "../models/notesModel.js";

// For New User Registration...
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModal.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcyprt.hash(password, 10);

    const user = userModal({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Register successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// For User Login...
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModal.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcyprt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Login successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// For User Logout...
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logout successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Check If User is Authenticated...
export const isAuthenticated =  async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

// Add new Notes to DB...
export const addNotes = async (req, res) => {
  const {title, content, tags} = req.body;
  const {userId} = req.body;

  if (!title) {
    return res.json({ success: false, message: "Title is required" });
  }

  if (!content) {
    return res.json({ success: false, message: "Content is required" });
  }

  try {
    const notes = notesModal({ title, content, tags: tags || [], userId });
    await notes.save();

    return res.json({ success: true, message: "Notes added successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

// Edit Existing Notes...
export const editNotes = async (req, res) => {
  const {title, content, tags, isPinned} = req.body;
  const {userId} = req.body;
  const { notesId } = req.params;

  if(!title && !content && !tags) {
    return res.json({success: true, message: "No Changes Provided"})
  }

  try {
    const notes  = await notesModal.findOne({_id: notesId, userId: userId});

    if(!notes) {
      return res.json({success: false, message: "Notes not found"})
    }

  if (title) notes.title = title;
  if (content) notes.content = content;
  if (tags) notes.tags = tags;
  if (isPinned) notes.isPinned = isPinned;

  await notes.save();

  return res.json({success: true, message: 'Note updated successfully'});

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

// Get All noted from DB...
export const getNotes = async (req, res) => {
  const {userId} = req.body;

  try {
    const notes = await notesModal.find({ userId }).sort({isPinned: -1});

    return res.json({success: true, notes, message: 'All notes received successfully'});
  } catch (error) {
    return res.json({success: false, message: error.message})
  }
}

// Delete Notes from DB
export const deleteNotes = async (req, res) => {
  const {userId} = req.body;
  const { notesId } = req.params;
  try {
    const notes  = await notesModal.findOne({_id: notesId, userId: userId});

    if(!notes) {
      return res.json({success: false, message: "Notes not found"})
    }

    await notesModal.deleteOne({_id: notesId, userId: userId});

    return res.json({success: true, message: 'Notes Deleted Successfully'});
  } catch (error) {
    return res.json({success: false, message: error.message})
  }
}

// Update Pinned Notes...
export const updatePinnedNotes = async (req, res) => {
  const {userId, isPinned} = req.body;
  const { notesId } = req.params;

  try {
    const notes  = await notesModal.findOne({_id: notesId, userId: userId});

    if(!notes) {
      return res.json({success: false, message: "Notes not found"})
    }

    notes.isPinned = isPinned || false;

    await notes.save();

    return res.json({success: true, message: 'Note updated successfully'});

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

// Search Notes...
export const searchNotes = async (req, res) => {
  const {userId} = req.body;
  const {query} = req.query;

  if(!query) {
    return res.json({success: false, message: "Type Something"})
  }

  try {
    const notes = await notesModal.find({userId, $or: [
      {title: {$regex: new RegExp(query, 'i')}},
      {content: {$regex: new RegExp(query, 'i')}}
    ],})

    return res.json({success: true, notes, message: 'Search Notes received succefully'});
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}