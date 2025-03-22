const axios = require("axios");
const Message = require("../model/message");
require("dotenv").config();
const BOT_WEBHOOK = process.env.BOT_WEBHOOK || "https://precisely-national-unicorn.ngrok-free.app/webhook/39f4b370-93dd-43f5-b7f6-220dc9cd041c/chat"

const sendMessage = async (req, res) => {
    console.log("BOT_WEBHOOK:", BOT_WEBHOOK);
    const { chatInput } = req.body;
    const { id } = req.user;

    try {
        const response = await axios.post(BOT_WEBHOOK, {
            chatInput: 'Tạo bài viết về bút bi chì',
          }, {
            headers: {
              'Content-Type': 'application/json',  
            }
          });

        if (response.data.output) {
            const userMessage = new Message({ userId: id, sender: "user", message: chatInput });
            await userMessage.save();

            const botMessage = new Message({ userId: id, sender: "bot", message: response.data.output });
            await botMessage.save();

            return res.json({ userMessage, botMessage });
        }

        return res.status(500).json({ error: "Bot không phản hồi" });

    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        res.status(500).json({ error: "Không thể xử lý yêu cầu" });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const {id} = req.user
        const messages = await Message.find({ userId: id }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử chat:", error);
        res.status(500).json({ error: "Không thể lấy lịch sử chat" });
    }
  };

  module.exports = { sendMessage, getChatHistory };