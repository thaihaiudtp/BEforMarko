const axios = require("axios");
const Message = require("../model/message");
require("dotenv").config();
const BOT_WEBHOOK = process.env.BOT_WEBHOOK 
const BOT_WEBHOOK_IMAGE = process.env.BOT_WEBHOOK_IMAGE
const Workflow = require('../model/workflow');

const createWorkflow = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.user; 
    if (!name) {
      return res.status(400).json({ error: 'Tên workflow là bắt buộc' });
    }

    const newWorkflow = new Workflow({
      userId: id,
      name: name
    });

    await newWorkflow.save();

    res.status(201).json({
      message: 'Tạo workflow thành công',
      success: true
    });
  } catch (error) {
    console.error('Lỗi tạo workflow:', error);
    res.status(500).json({ error: 'Không thể tạo workflow' });
  }
};
const getWorkflowsByUser = async (req, res) => {
  try {
    const { id } = req.user; 
    const workflows = await Workflow.find({ userId: id }).exec();
    if (!workflows || workflows.length === 0) {
      return res.status(200).json({ 
        workflows: [],
        message: 'No workflows found for this user' 
      });
    }

    res.status(200).json({
      workflows: workflows,
      message: 'Lấy danh sách workflow thành công',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const sendMessage = async (req, res) => {
  console.log("BOT_WEBHOOK:", BOT_WEBHOOK);
  console.log("req.body nhận được:", req.body); 

  const { chatInput, urlImage, workflowId } = req.body;
  const { id  } = req.user;

  try {
      const userMessage = new Message({ 
          user: id, 
          url: urlImage || null,
          workflow: workflowId,
          sender: "user", 
          message: chatInput 
      });
      await userMessage.save();

      const response = await axios.post(BOT_WEBHOOK, {
          sessionId: workflowId,
          chatInput: chatInput,
      }, {
          headers: { 'Content-Type': 'application/json' }
      });

      const botContent = response?.data?.output || "Bot không phản hồi";
      // Extract all observation_* fields
      const observations = {};
      if (response && response.data) {
        Object.keys(response.data).forEach(key => {
          if (key.startsWith('observation_')) {
            observations[key] = response.data[key]; // giữ nguyên kiểu dữ liệu
          }
        });
      }
      const type = response?.data?.type 
      const botMessage = new Message({
          user: id,
          workflow: workflowId,
          sender: "bot",
          message: botContent,
          observations: observations,
          type: type
      });
      await botMessage.save();

      if (response?.data?.output) {
          // Return botMessage and observations
          return res.json({ botMessage});
      } else {
          return res.status(500).json({ error: "Bot không phản hồi" });
      }

  } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      const errorMessage = new Message({
          user: id,
          workflow: workflowId,
          sender: "bot",
          message: error.message || "Đã xảy ra lỗi khi gửi tin nhắn",
      });
      await errorMessage.save();

      res.status(500).json({ error: "Không thể xử lý yêu cầu" });
  }
};


const getChatHistory = async (req, res) => {
  try {
      const { workflowId } = req.params;
      const { id} = req.user;

      const messages = await Message.find({ 
          workflow: workflowId, 
          user: id 
      }).sort({ timestamp: 1 });

      res.status(200).json({
        messages: messages,
        message: "ok"
      });
  } catch (error) {
      console.error("Lỗi khi lấy lịch sử chat:", error);
      res.status(500).json({ error: "Không thể lấy lịch sử chat" });
  }
};

const sendImage = async (req, res) => {
  const {url, context} = req.body
  if(!url){
    return res.status(400).json({error: 'url không được để trống'})
  }
  try {
    const response = await axios.post(BOT_WEBHOOK_IMAGE, {
      url: url,
      context: context
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
  
module.exports = { sendMessage, getChatHistory, sendImage, createWorkflow, getWorkflowsByUser};