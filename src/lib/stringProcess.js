const extractImageUrlFromChatInput = (chatInput) => {
  const lines = chatInput.trim().split("\n");
  const possibleUrl = lines[lines.length - 1].trim();

  const isImageUrl = /^https?:\/\/.*\.(png|jpg|jpeg|webp|gif|svg|bmp)(\?.*)?$/i.test(possibleUrl);

  if (isImageUrl) {
    // Nếu dòng cuối là ảnh thì tách ra
    const messageOnly = lines.slice(0, -1).join("\n").trim();
    return {
      cleanInput: messageOnly,
      imageUrl: possibleUrl,
    };
  } else {
    // Không có ảnh
    return {
      cleanInput: chatInput,
      imageUrl: null,
    };
  }
};
module.exports = {
  extractImageUrlFromChatInput,
};
