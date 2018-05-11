var express = require('express');
var router = express.Router();

var db = require('../queries');


router.get('/api/chatusers', db.getUsers);
router.get('/api/chatusers/:id', db.getUser);
router.post('/api/chatusers', db.createUser);
router.post('/api/messages/', db.createMessage);
router.get('/api/messages/', db.getMessages);


module.exports = router;