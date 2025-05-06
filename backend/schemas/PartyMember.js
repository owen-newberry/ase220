const mongoose = require('mongoose');
const { Schema } = mongoose;

class PartyMember {
    constructor(
        name,
        playerClass,
        xp,
        level,
        bonus,
        health,
        items
    ) {
        this.name = name;
        this.playerClass = playerClass;
        this.xp = xp;
        this.level = level;
        this.bonus = bonus;
        this.health = health;
        this.items = items;
    }
}

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
    items: {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }
});

PartyMemberSchema.loadClass(PartyMember);

module.exports = mongoose.model('partyMembers', PartyMemberSchema);