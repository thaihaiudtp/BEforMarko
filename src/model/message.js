const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    message: { type: String, required: true },
  }, {
    timestamps: true
  });
  
  
  module.exports = mongoose.model("Message", MessageSchema);
  