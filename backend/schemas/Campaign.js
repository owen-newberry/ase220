const mongoose = require('mongoose');
const { Schema } = mongoose;

class Campaign {
    constructor(
        name,
        description,
        partyMembers
    ) {
        this.name = name;
        this.description = description;
        this.partyMembers = partyMembers;
    }
}

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
      },
      description: String,
      partyMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartyMember'
      }]
    });

CampaignSchema.loadClass(Campaign);

module.exports = mongoose.model('campaigns', CampaignSchema);