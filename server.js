const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const User = require('./models/User');
const Transaction = require('./models/Transaction');

mongoose.connect('mongodb://localhost:27017/finance-tracker', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB', err);
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.send({ token });
});

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const verified = jwt.verify(token, 'secret_key');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

app.post('/transactions', authMiddleware, async (req, res) => {
    const { description, amount, category, type } = req.body;
    const transaction = new Transaction({
        userId: req.user.userId,
        description,
        amount,
        category,
        type,
    });
    try {
        await transaction.save();
        res.status(201).send('Transaction added');
    } catch (error) {
        res.status(400).send('Error adding transaction');
    }
});

app.get('/transactions', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.userId });
        res.send(transactions);
    } catch (error) {
        res.status(400).send('Error fetching transactions');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
