// // backend/server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import authRoutes from './routes/authRoutes.js'; // Note the .js extension
// import adminRoutes from './routes/adminRoutes.js'; // Note the .js extension
// import dotenv from 'dotenv'; // Import dotenv
// import path from 'path';
// import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config(); // Load environment variables from .env file

// const app = express();

// // Middleware
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON request bodies

// // MongoDB Connection (using environment variable)
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/teacher-parent-platform"; // Use environment variable or default
// mongoose.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err) => console.error("Failed to connect to MongoDB", err));


// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// // Serve static files (if you have a frontend build)
// if (process.env.NODE_ENV === 'production') {  // Check if in production
//     app.use(express.static(path.join(__dirname, '/frontend/build'))); // Serve static files from build folder
//     app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))); // Serve index.html for all other requests
// } else {
//     app.get('/', (req, res) => {
//         res.send('API is running....'); // Simple message for development
//     });
// }


// // Start the server (using environment variable or default port)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Backend server running on http://localhost:${PORT}`);
// });



import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI; // Get URI from .env

if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not set!");
    process.exit(1); // Exit if URI is missing
}

mongoose.connect(MONGODB_URI).then(() => {  // Removed deprecated options
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit on connection error
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}