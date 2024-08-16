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
    cors(req, res, async () => {
        try {
            const uids = req.query.uids; // Pour POST -> req.body.uids, pour GET -> req.query.uids
            const limit = parseInt(req.query.limit, 10); // Limite par défaut: le nombre total de UIDs
            const startAfter = req.query.startAfter; // ID du document à partir duquel commencer

            if (!uids) {
                return res.status(400).send("UID list is required and should be an array.");
            }

            const startAfterIndex = Array.isArray(uids) ? uids.indexOf(startAfter) : 0
            const limitedUids = () => {
                if (!Array.isArray(uids)) {
                    return [uids]
                }

                if (limit) {
                    if (startAfterIndex) {
                        return uids.slice(startAfterIndex + 1, startAfterIndex + 1 + limit)
                    }
                    return uids.slice(0, limit + 1)
                };
                return uids
            }

            // Récupérer les documents en parallèle
            const documentPromises = limitedUids().map(async (uid) => {
                const docRef = db.collection("users").doc(uid);
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    return { id: docSnap.id, ...docSnap.data() };
                } else {
                    return null; // Document non trouvé
                }
            });

            const documents = await Promise.all(documentPromises);

            // Filtrer les documents null (ceux qui n'ont pas été trouvés)
            const filteredDocuments = documents.filter(doc => doc !== null);

            return res.status(200).json(filteredDocuments);
        } catch (error) {
            console.error("Error retrieving documents:", error);
            return res.status(500).send("Internal Server Error");
        }
    });
})