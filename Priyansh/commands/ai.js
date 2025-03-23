const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Google Cloud AI (Gemini) by Priyansh",
    commandCategory: "ai",
    usages: "[ask]",
    cooldowns: 2,
    dependencies: {
        "axios": "1.4.0"
    }
};

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID } = event;
    const query = args.join(" "); // User ka input
    const name = await Users.getNameUser(event.senderID);

    if (!query) return api.sendMessage("Please type a message...", threadID, messageID);

    api.sendMessage("Searching for an answer, please wait...", threadID, messageID);

    try {
        api.setMessageReaction("⌛", event.messageID, () => { }, true);

        // Google Cloud AI (Bard API) Configuration
        const geminiApiKey = "AIzaSyBLJasBu3OUFEzFlVI-E1l1O0GXvbk1cxA"; // Apni Gemini API key yahan dalen
        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;

        const response = await axios.post(geminiApiUrl, {
            contents: [{
                parts: [{
                    text: query // User ka input
                }]
            }]
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const geminiResponse = response.data.candidates[0].content.parts[0].text; // Gemini se mila jawab

        api.sendMessage(geminiResponse, threadID, messageID); // User ko jawab bhejna
        api.setMessageReaction("✅", event.messageID, () => { }, true);
    } catch (error) {
        console.error('Error fetching response from Gemini:', error);
        api.sendMessage("An error occurred while fetching data. Please try again later.", threadID, messageID);
    }
};
