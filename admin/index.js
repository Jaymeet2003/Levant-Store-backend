// Import necessary modules
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
require("dotenv").config({
  path: path.resolve(__dirname, '.env'),
});
const session = require('express-session');

const app = express();
const port = 4000;

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));


// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/admin',express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

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

// const BlogSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     seoKeywords: { type: [String], required: false },
//     datePosted: { type: Date, default: Date.now }
// });

// Update BlogSchema to include an image field
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    seoKeywords: { type: [String], required: false },
    image: { type: String, required: false }, // New field for storing image path
    datePosted: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
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
    if (req.session.userId) {
        const now = new Date().getTime();
        const lastActivity = req.session.lastActivity || now;

        // If inactive for more than 30 minutes
        if (now - lastActivity > 30 * 60 * 1000) {
            req.session.destroy(err => {
                if (err) console.error('Error destroying session:', err);
                return res.status(401).json({ message: 'Session expired. Please login again.' });
            });
        } else {
            req.session.lastActivity = now; // Update last activity
            next();
        }
    } else {
        return res.status(401).json({ message: 'Access denied. Please login.' });
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

app.get('/admin/blogForm', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blogForm.html'));
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
        console.log('Login request received:', { username });

        const user = await User.findOne({ username });
        if (!user) {
            console.error('User not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Password mismatch');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        req.session.userId = user._id;
        req.session.lastActivity = new Date().getTime();
        console.log('User logged in successfully:', user._id);

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Admin Logout
app.post('/admin/logout', (req, res) => {
    if (!req.session.userId) {
        return res.status(400).json({ message: 'No active session found to log out.' });
    }

    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Server error during logout' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});


// Create a Blog Post (secured route)
// app.post('/blog/create', authenticateUser, async (req, res) => {
//     try {
//         const { title, content, seoKeywords } = req.body;
//         const newBlog = new Blog({ title, content, seoKeywords });
//         await newBlog.save();
//         res.status(201).json({ message: 'Blog post created successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// });

// Update Blog Creation Route
app.post('/blog/create', authenticateUser, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const seoKeywords = req.body.seoKeywords || '';
        const image = req.file ? req.file.filename : null // Get the uploaded file name

        const newBlog = new Blog({ title, content, image, seoKeywords: seoKeywords.split(',').map(keyword => keyword.trim()) });
        await newBlog.save();

        res.status(201).json({ message: 'Blog post created successfully' });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get All Blog Posts (public route)
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ datePosted: -1 });

        // Add default image if `image` is null
        const blogsWithDefaultImage = blogs.map(blog => ({
            ...blog.toObject(),
            image: blog.image || 'img.png'
        }));

        res.status(200).json(blogsWithDefaultImage);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get Single Blog Post (public route)
app.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        res.status(200).json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/admin/edit-blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send('Blog not found');

        // Serve an HTML page or JSON with blog data
        res.sendFile(path.join(__dirname, 'public', 'edit-blog.html'));
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).send('Server error');
    }
});

app.put('/edit-blog/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content, seoKeywords } = req.body;
        const blogId = req.params.id;

        const updatedData = {
            title,
            content,
            seoKeywords: seoKeywords.split(',').map(keyword => keyword.trim()),
        };

        if (req.file) {
            updatedData.image = req.file.filename; // Update the image if provided
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog updated successfully', updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));