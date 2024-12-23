const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schemas
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true }
});

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    seoKeywords: { type: [String], required: false },
    image: { type: String, required: false }, // New field for storing image path
    datePosted: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Token = mongoose.model('Token', TokenSchema);
const Blog = mongoose.model('Blog', BlogSchema);

// Helper Functions
const generateSecureToken = (length = 48) => {
    return crypto.randomBytes(length).toString('hex');
};

const createAuthToken = async (userId) => {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + (75 * 60 * 1000)); // 1 hour 15 minutes from now
    const newToken = new Token({ token, userId, expiresAt });
    await newToken.save();
    return token;
};

// Middleware to check token and inactivity
const authenticateUser = async (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. Please login.' });
    
    try {
        const authToken = await Token.findOne({ token });
        if (!authToken || new Date(authToken.expiresAt) < new Date()) {
            return res.status(401).json({ message: 'Token expired or invalid. Please login again.' });
        }        
        req.user = authToken.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token expired or invalid. Please login again.' });
    }
};

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads')); // Save files to 'public/uploads'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name with extension
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // Allowed file types
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

// Routes

// Serve Admin Login Page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve Admin Registration Page
app.get('/admin/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Serve Admin Dashboard Page (only for authenticated users)
app.get('/admin/dashboard', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Admin Registration
app.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Admin Login
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid username or password' });
        
        const token = await createAuthToken(user._id);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Admin Logout
app.post('/admin/logout', authenticateUser, async (req, res) => {
    try {
        await Token.deleteOne({ token: req.headers['authorization']?.split(' ')[1] });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Create a Blog Post (secured route)
app.post('/blog/create', authenticateUser, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const seoKeywords = req.body.seoKeywords || '';
        const image = req.file ? req.file.filename : null;

        const newBlog = new Blog({ title, content, image, seoKeywords: seoKeywords.split(',').map(keyword => keyword.trim()) });
        await newBlog.save();

        res.status(201).json({ message: 'Blog post created successfully' });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get All Blog Posts (for dashboard)
app.get('/admin/dashboard/data', authenticateUser, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ datePosted: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error });
    }
});

// Edit Blog: Fetch and Update Routes
app.get('/blog/edit/:id', authenticateUser, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog', error });
    }
});

app.put('/blog/edit/:id', authenticateUser, upload.single('image'), async (req, res) => {
    try {
        const updatedData = {
            title: req.body.title,
            content: req.body.content,
            seoKeywords: req.body.seoKeywords ? req.body.seoKeywords.split(',').map(k => k.trim()) : [],
        };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog', error });
    }
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
