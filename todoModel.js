const mongoose = require('mongoose');

const todoModel = mongoose.model("todo",new mongoose.Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['to-do', 'in-progress', 'done'] }


}));

module.exports = todoModel;
