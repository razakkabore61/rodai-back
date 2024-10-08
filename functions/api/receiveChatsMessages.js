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
exports.receiveChatsMessages = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const uid = req.body.uid; // Pour POST -> req.body.uids, pour GET -> req.query.uids
            const chatsId = req.body.chatsId;

            if (!uid || !chatsId) {
                return res.status(400).send("UID list is required and should be an array.");
            }
            const idList = () => {
                if (!Array.isArray(chatsId)) {
                    return [chatsId]
                }
                return chatsId
            }

            const batch = db.batch()

            await Promise.all(idList().map(async (id) => {
                const updatechat = {
                    "lastMessage.received": true
                };

                const docRef = db.collection("chats").doc(id);
                batch.update(docRef, updatechat);

                const msgCollectionRef = docRef.collection("messages"); // Correctement accéder à la collection
                const snapshot = await msgCollectionRef.where("received", "!=", true).where("rUid","==",uid).get();
                snapshot.forEach((doc) => {
                    if (doc.exists) {
                        const msg = doc.data();
                        const messageRef = msgCollectionRef.doc(msg.id);
                        batch.update(messageRef, { received: true });
                    }
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