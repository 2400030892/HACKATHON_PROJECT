require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Connection Error:", err));

// Schema
const InvestmentSchema = new mongoose.Schema({
    fund: String,
    amount: Number,
    mode: String,
});
const Investment = mongoose.model('Investment', InvestmentSchema);

// --- ROUTES ---

// 1. Get Investments
app.get('/getInvestments', async (req, res) => {
    try {
        const data = await Investment.find();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Add Investment
app.post('/addInvestment', async (req, res) => {
    try {
        const newInv = new Investment(req.body);
        await newInv.save();
        res.json(newInv);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 3. Delete Investment
app.delete('/deleteInvestment/:id', async (req, res) => {
    try {
        await Investment.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 4. NEW: Verify Captcha (TEMPORARY BYPASS FOR DEBUGGING)
// 4. NEW: Verify Captcha (FINAL VERSION)
app.post('/verify-captcha', async (req, res) => {
    const { token } = req.body;
    // REPLACE THE SECRET KEY HERE AGAIN. The slightest typo breaks this.
    const SECRET_KEY = "6LeWRRwsAAAAAO0ywXrMAriEMHZK3hxmWv-iqojE"; 

    if (!token) {
        return res.status(400).json({ success: false, message: "No token" });
    }

    try {
        // Vercel sometimes rejects the connection if the secret is wrong.
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
        );

        if (response.data.success) {
            res.json({ success: true, message: "Human verified!" });
        } else {
            // If Google returns failure (e.g., scoring too low)
            res.json({ success: false, message: "Captcha check failed: Bot detected." });
        }
    } catch (error) {
        // This is the error the frontend is seeing. It means Vercel failed to connect to Google.
        // Check your SECRET_KEY on Google's console to ensure it is still active.
        res.status(500).json({ success: false, message: "Error contacting Google for verification." });
    }
});

const PORT = process.env.PORT || 5001;

// Only run the server if we are testing locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

// Export the app for Vercel
module.exports = app;
