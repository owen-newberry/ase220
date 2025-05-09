const express = require('express');
const router = express.Router();
const partyMemberController = require('../controllers/partyMemberController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/:campaignId', authMiddleware.protect, partyMemberController.createPartyMember);
router.get('/:campaignId', authMiddleware.protect, partyMemberController.getPartyMembers);
router.get('/id/:id', authMiddleware.protect, partyMemberController.getPartyMemberById);
router.put('/id/:id', authMiddleware.protect, partyMemberController.updatePartyMember);
router.delete('/id/:id', authMiddleware.protect, partyMemberController.deletePartyMember);

module.exports = router;
