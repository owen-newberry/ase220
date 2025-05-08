const mongoose = require('mongoose');
const { Schema } = mongoose;

const CampaignSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
      },
      description: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      partyMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partyMembers'
      }]
    });

module.exports = mongoose.model('campaigns', CampaignSchema);