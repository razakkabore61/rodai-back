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
exports.getUsersDocByUid = functions.https.onRequest((req, res) => {
    const uids = req.body.uids;
    if (!uids || !Array.isArray(uids)) {
        return res.status(500).send("uid list are required");
    }
    return cors(req, res, async () => {
        try {
            const documents = []
            for (const uid in uids) {
                const docRef = db.collection("users").doc(uid);
                const docSnap = docRef.get();
                if (docSnap.exists) {
                    documents.push({ id: (await docSnap).id, ...(await docSnap).data() });
                }
            }
            res.send(documents)
            // const userRecord = await getFirestore()
            // .collection("users").where
            // .get();
            // res.send(userRecord.toJSON());
        } catch (error) {
            res.status(500).send(error);
        }
    });
})