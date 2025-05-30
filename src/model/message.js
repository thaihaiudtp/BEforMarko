const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    message: { type: String, required: true },
    observations: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    },
    type: { type: String, default: null, required: false }
  }, {
    timestamps: true
  });
  
  
  module.exports = mongoose.model("Message", MessageSchema);
