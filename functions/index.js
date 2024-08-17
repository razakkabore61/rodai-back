const {initializeApp}=require("firebase-admin/app");
initializeApp()

const updateUser = require("./api/updateUser");
const getUsersDocByUid = require("./api/getUsersDocByUid");
const receiveChatsMessages = require("./api/receiveChatsMessages");
const viewChatMessages = require("./api/viewChatMessages");

exports.updateUser = updateUser.updateUser
exports.getUsersDocByUid = getUsersDocByUid.getUsersDocByUid
exports.receiveChatsMessages= receiveChatsMessages.receiveChatsMessages
exports.viewChatMessages= viewChatMessages.viewChatMessages
