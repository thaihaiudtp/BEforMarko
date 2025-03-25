const User = require('../model/user');

const path = require('path');
const {google} = require('googleapis');
const fs = require('fs');

const KEYFILEPATH = path.join(__dirname, "image.json");
const scope = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: scope,
  });
  const uploadFileToDrive = async (file) => {
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: file.originalname,
        parents: ['1Ma9p_DBOT8IfXO5gGoTR2_s9nfA0FxPO'] // Thay bằng ID thư mục Drive
    };

    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });
    await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    return `https://drive.google.com/uc?id=${response.data.id}`;
};

const uploadImage = async (req, res) => {
    try {
        console.log("File received:", req.file); 
        console.log("Body received:", req.body);

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const imageUrl = await uploadFileToDrive(req.file);
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { images: imageUrl } }, // Thêm ảnh mới vào mảng
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Upload successful", imageUrl, images: user.images });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const getImage = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id).select("images"); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ images: user.images });
    } catch (error) {
        console.error("Error fetching images:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {uploadImage, getImage}