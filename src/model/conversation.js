const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConversationSchema = new Schema({
    workflowId: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", required: true },
    title: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model("Conversation", ConversationSchema);
  