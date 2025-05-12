const User = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Workflow = require('../model/workflow'); // Import Workflow model

const uploadImage = async (req, res) => {
    try {
        const userId = req.user.id; 
        if(!req.file){
            return res.status(400).json({ success: false, message: 'No file uploaded'})
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not found' });
        }
        const imagePath = req.file.path; 
        await User.findByIdAndUpdate(
            userId,
            { $push: { images: imagePath } },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: 'Image uploaded and saved',
            imageUrl: imagePath,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


const getImage = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id).select("images"); 

        if (!user) {
            return res.status(404 ).json({ message: "User not found" });
        }

        return res.status(200).json({ images: user.images });
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

module.exports = {
    uploadImage,
    getImage,
    getCurrentUser,
    updateFullname,
    changePassword,
    renameWorkflow,
    deleteWorkflow
};