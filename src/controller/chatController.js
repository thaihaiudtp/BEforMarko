const axios = require("axios");
const Message = require("../model/message");
require("dotenv").config();
const BOT_WEBHOOK = process.env.BOT_WEBHOOK || "https://precisely-national-unicorn.ngrok-free.app/webhook/39f4b370-93dd-43f5-b7f6-220dc9cd041c/chat"

const sendMessage = async (req, res) => {
    console.log("BOT_WEBHOOK:", BOT_WEBHOOK);
    console.log("req.body nhận được:", req.body); // 👀 Xem toàn bộ req.body
    console.log("chatInput trước khi xử lý:", req.body.chatInput);
    const { chatInput } = req.body;
    const { id } = req.user;
    console.log(chatInput)
    try {
        const userMessage = new Message({ userId: id, sender: "user", message: chatInput });
        await userMessage.save();
        const response = await axios.post(BOT_WEBHOOK, {
            chatInput: chatInput,
          }, {
            headers: {
              'Content-Type': 'application/json',  
            }
          });

        if (response.data.output) {


            const botMessage = new Message({ userId: id, sender: "bot", message: response.data.output });
            await botMessage.save();

            return res.json({botMessage});
        }
        const botMessage = new Message({ userId: id, sender: "bot", message: "Bot không phản hồi"});
        await botMessage.save();
        return res.status(500).json({ error: "Bot không phản hồi" });

    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        const botMessage = new Message({ userId: id, sender: "bot", message: error});
        await botMessage.save();
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