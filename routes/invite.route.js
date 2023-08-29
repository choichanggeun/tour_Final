const express = require('express');
const inviterouter = express.Router();

const InviteController = require('../controllers/invite.controller');
const Auth = require('../middlewares/auth');
const inviteController = new InviteController();

inviterouter.get('/invite/:tour_id', Auth, inviteController.findInvite);

inviterouter.post('/invite/:tour_id', Auth, inviteController.createInvite);

inviterouter.delete('/invite/:tour_id/:invite_id', Auth, inviteController.deleteInvite);

module.exports = inviterouter;
