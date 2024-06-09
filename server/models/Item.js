const { Schema, model } = require('mongoose');

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    effect: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
);

const Item = model('Item', itemSchema);

module.exports = Item;
