const express = require("express");
const router = express.Router();
const {getCurrentUser, changePassword, renameWorkflow, deleteWorkflow, getObservatios} = require('../controller/userController')
const {verifyToken} = require('../middleware/verifyToken')
router.get('/get-user', verifyToken, getCurrentUser)
router.get('/get-observations', verifyToken, getObservatios)
router.put('/change-pass', verifyToken, changePassword)
router.put('/update-fullname/:workflowId', verifyToken, renameWorkflow)
router.delete('/delete-workflow/:workflowId', verifyToken, deleteWorkflow)
module.exports = router;