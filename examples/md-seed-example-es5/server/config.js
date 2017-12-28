module.exports = {
  env: process.env.NODE_ENV || 'development',

  mongoURL:
    process.env.MONGO_URL || 'mongodb://localhost:27017/md-seed-example-es5',
};
