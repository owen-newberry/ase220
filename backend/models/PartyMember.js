const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartyMemberSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    playerClass: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
        min: 0
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 20
    },
    bonus: {
        type: Number,
        default: 2
    },
    health: {
        current: Number,
        max: Number
    },
    items: [{
        name: String,
        description: String,
        properties: Schema.Types.Mixed,
        publisher: String,
        book: String,
        quantity: {
            type: Number,
            default: 1
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'campaigns',
        required: true
    }
});

module.exports = mongoose.model('partyMembers', PartyMemberSchema);