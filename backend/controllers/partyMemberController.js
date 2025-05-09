const PartyMember = require('../models/PartyMember');
const Campaign = require('../models/Campaign');

exports.createPartyMember = async (req, res) => {
  try {
    const { name, playerClass, xp, level, bonus, health, items } = req.body;
    const campaignId = req.params.campaignId;

    const newPartyMember = await PartyMember.create({
      name,
      playerClass,
      xp,
      level,
      bonus,
      health,
      items,
      user: req.user._id,
      campaign: req.params.campaignId,
    });

    await Campaign.findByIdAndUpdate(campaignId, {
      $push: { partyMembers: newPartyMember._id }
    });

    res.status(201).json({
      status: 'success',
      data: {
        partyMember: newPartyMember,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getPartyMembers = async (req, res) => {
  try {
    const partyMembers = await PartyMember.find({
      campaign: req.params.campaignId,
      user: req.user.id
    });

    res.status(200).json({
      status: 'success',
      data: {
        partyMembers,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getPartyMemberById = async (req, res) => {
  try {
    const partyMember = await PartyMember.findById(req.params.id);

    if (!partyMember) {
      return res.status(404).json({
        status: 'fail',
        message: 'Party member not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        partyMember,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updatePartyMember = async (req, res) => {
  try {
    const partyMember = await PartyMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!partyMember) {
      return res.status(404).json({
        status: 'fail',
        message: 'Party member not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        partyMember,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deletePartyMember = async (req, res) => {
  try {
    const partyMember = await PartyMember.findByIdAndDelete(req.params.id);

    if (!partyMember) {
      return res.status(404).json({
        status: 'fail',
        message: 'Party member not found',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Party member deleted successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
