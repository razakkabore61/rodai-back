const {initializeApp}=require("firebase-admin/app");
initializeApp()

const updateUser = require("./api/updateUser");
const getUsersDocByUid = require("./api/getUsersDocByUid");

exports.updateUser = updateUser.updateUser
exports.getUsersDocByUid = getUsersDocByUid.getUsersDocByUid
