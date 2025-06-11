const User = require('../model/user');
const Message = require('../model/message');
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');
const Workflow = require('../model/workflow'); // Import Workflow model
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});
const uploadImage = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not found' });
        }

        const file = req.file;
        const fileExt = path.extname(file.originalname);
        const key = `users/${userId}/${Date.now()}${fileExt}`;

        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        await User.findByIdAndUpdate(
            userId,
            { $push: { images: imageUrl } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Image uploaded to S3 and saved',
            imageUrl,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



const getImage = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id).select("images"); 

        if (!user) {
            return res.status(404 ).json({ message: "User not found" });
        }

        return res.status(200).json({ 
          success: true,
          images: user.images 
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const getCurrentUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password -images -product");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  const updateFullname = async (req, res) => {
    try {
      const userId = req.user.id;
      const { fullname } = req.body;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { fullname },
        { new: true, runValidators: true }
      ).select("-password");
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  const changePassword = async (req, res) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
  
      user.password = newPassword;
      await user.save();
  
      res.json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

const renameWorkflow = async (req, res) => {
    try {
        const userId = req.user.id;
        const { workflowId } = req.params;
        const { newName } = req.body;

        const workflow = await Workflow.findOneAndUpdate(
            { _id: workflowId, userId },
            { name: newName },
            { new: true, runValidators: true }
        );

        if (!workflow) {
            return res.status(404).json({ message: "Workflow not found or unauthorized" });
        }

        res.status(200).json({ message: "Workflow renamed successfully", workflow });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteWorkflow = async (req, res) => {
    try {
        const userId = req.user.id;
        const { workflowId } = req.params;
        await Message.deleteMany({ workflow: workflowId, user: userId });
        const workflow = await Workflow.findOneAndDelete({ _id: workflowId, userId });

        if (!workflow) {
            return res.status(404).json({ message: "Workflow not found or unauthorized" });
        }

        res.status(200).json({ message: "Workflow deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
const getObservatios = async (req, res) => {
  try {
    const {id} = req.user;
    const observations = await Message.find({ user: id, sender: "bot" })
      .select("observations")
    if (!observations || observations.length === 0) {
      return res.status(404).json({ message: "No observations found for this user" });
    }
    const allObservations = observations.map(obs => obs.observations);
    res.status(200).json({
      success: true,
      observations: allObservations,
      message: 'Lấy danh sách quan sát thành công',
    });
  } catch (error) {
    console.error('Error fetching observations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
}
module.exports = {
    uploadImage,
    getImage,
    getCurrentUser,
    updateFullname,
    changePassword,
    renameWorkflow,
    deleteWorkflow,
    getObservatios
};