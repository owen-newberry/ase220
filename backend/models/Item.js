const mongoose = require('mongoose');
const { Schema } = mongoose;

class Item {
    constructor(
        name,
        description,
        properties
    ) {
        this.name = name;
        this.description = description;
        this.properties= properties;
    }
}

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    properties: {
        category: {
            type: String,
            required: true
        },
        itemType: String,
        itemRarity: {
            type: String
        },
        weight: Number,
        cost: String,
        attunement: Boolean
    }
});

ItemSchema.loadClass(Item);

module.exports = mongoose.model('items', ItemSchema);