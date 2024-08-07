const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, enum: ['income', 'expense'] },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
