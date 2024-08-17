const functions = require("firebase-functions")
const admin = require("firebase-admin")
const cors = require("cors")({ origin: true })
const db = admin.firestore()

/**
 * Update user identification data
 * @param body {string, object}
 * @returns {string} message success | error
 * @forPlay https://us-central1-tokenanalsv2.cloudfunctions.net/updateUser
 * @documentation https://firebase.google.com/docs/auth/admin/manage-users?hl=fr&authuser=0#update_a_user
 */
exports.viewChatMessages = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const chatId = req.body.chatId;
            const msgIds = req.body.msgIds;

            if (!chatId || !msgIds) {
                return res.status(400).send("UID list is required and should be an array.");
            }

            const msgIdList = () => {
                if (!Array.isArray(msgIds)) {
                    return [msgIds]
                }
                return msgIds
            }

            const batch = db.batch()

            const updatechat = {
                pending: 0,
                "lastMessage.received": true,
                "lastMessage.isView": true,
            };

            const chatDocRef = db.collection("chats").doc(chatId);
            batch.update(chatDocRef, updatechat);
            const msgCollectionRef = chatDocRef.collection("messages"); // Correctement accéder à la collection

            await Promise.all(msgIdList().map(async (id) => {
                const messageRef = msgCollectionRef.doc(id);
                batch.update(messageRef, {
                    received: true,
                    isView: true,
                });
            }));

            await batch.commit()
            const result = true
            res.json({ success: result });
        } catch (error) {
            return res.status(500).send("Internal Server Error");
        }
    });
})