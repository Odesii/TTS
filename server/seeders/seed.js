const db = require('../config/connection');
const { User, Item } = require('../models');
const itemSeeds = require('./itemSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('Item', 'items');

    await Item.insertMany(itemSeeds);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
