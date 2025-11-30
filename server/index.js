require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- GLOBAL MIDDLEWARE ---
// Allows access from your deployed Netlify site
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// MONGO_URI must be set in Vercel Environment Variables
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Connection Error:", err));

// --- MONGODB SCHEMA ---
const InvestmentSchema = new mongoose.Schema({
    fund: String,
    amount: Number,
    mode: String,
});
const Investment = mongoose.model('Investment', InvestmentSchema);

// --- API ROUTES (CRUD) ---

// 1. GET: Fetch all investments
app.get('/getInvestments', async (req, res) => {
    try {
        const data = await Investment.find();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. POST: Add a new investment
app.post('/addInvestment', async (req, res) => {
    try {
        const newInv = new Investment(req.body);
        await newInv.save();
        res.json(newInv);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 3. DELETE: Remove an investment by ID
app.delete('/deleteInvestment/:id', async (req, res) => {
    try {
        await Investment.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 4. POST: Verify Captcha (Uses Env Var)
app.post('/verify-captcha', async (req, res) => {
    const { token } = req.body;
    // Uses the Environment Variable you must set in Vercel
    const SECRET_KEY = process.env.RECAPTCHA_SECRET; 

    if (!token || !SECRET_KEY) {
        return res.status(400).json({ success: false, message: "Missing token or secret key" });
    }

    try {
        // Send request to Google for verification
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
        );

        if (response.data.success) {
            res.json({ success: true, message: "Human verified!" });
        } else {
            res.json({ success: false, message: "Bot detected!" });
        }
    } catch (error) {
        // This catches the network error (e.g., Vercel failing to reach Google)
        res.status(500).json({ success: false, message: "Error contacting Google for verification." });
    }
});


// --- SERVER EXPORT (FOR VERCEL) ---
const PORT = process.env.PORT || 5001;

// Only run server if testing locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

// Export the app for Vercel Serverless Functions
module.exports = app;
