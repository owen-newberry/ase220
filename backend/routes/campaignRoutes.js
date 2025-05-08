const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware.protect, campaignController.createCampaign);
router.get('/', authMiddleware.protect, campaignController.getAllCampaigns);
router.get('/:id', authMiddleware.protect, campaignController.getCampaignById);
router.post('/:id/party-members', authMiddleware.protect, campaignController.addPartyMemberToCampaign);
router.delete('/:id', authMiddleware.protect, campaignController.deleteCampaign);
router.delete('/:id/party-members', authMiddleware.protect, campaignController.removePartyMemberFromCampaign);

module.exports = router;
