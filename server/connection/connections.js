mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/WHATEVER WE NAME THE DATABASE');

module.exports = mongoose.connection;
