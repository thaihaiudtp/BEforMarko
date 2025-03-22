const mongoose = require('mongoose');
const { Schema } = mongoose;

const WorkflowSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model("Workflow", WorkflowSchema);
  