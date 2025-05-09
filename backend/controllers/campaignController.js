const Campaign = require('../models/Campaign');
const PartyMember = require('../models/PartyMember');

exports.createCampaign = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const newCampaign = await Campaign.create({
      name,
      description,
      user: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        campaign: newCampaign
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id }).populate('partyMembers');
    res.status(200).json({
      status: 'success',
      data: {
        campaigns
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('partyMembers');
    if (!campaign) {
      return res.status(404).json({
        status: 'fail',
        message: 'Campaign not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        campaign
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.addPartyMemberToCampaign = async (req, res, next) => {
  try {
    const { partyMemberId } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    const partyMember = await PartyMember.findById(partyMemberId);

    if (!campaign || !partyMember) {
      return res.status(404).json({
        status: 'fail',
        message: 'Campaign or Party Member not found'
      });
    }

    campaign.partyMembers.push(partyMember._id);
    await campaign.save();

    res.status(200).json({
      status: 'success',
      data: {
        campaign
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.removePartyMemberFromCampaign = async (req, res, next) => {
  try {
    const { partyMemberId } = req.body;

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        status: 'fail',
        message: 'Campaign not found'
      });
    }

    campaign.partyMembers.pull(partyMemberId);
    await campaign.save();

    res.status(200).json({
      status: 'success',
      data: {
        campaign
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        status: 'fail',
        message: 'Campaign not found'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Campaign deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
