const path = require('path'),
      rootPath = path.normalize(`${__dirname}/..`);

const Controllers = (filePath) => {
  return path.normalize(`${rootPath}/controllers/${filePath}`)
};


module.exports = {
  // database
  DATABASE_URL: process.env.DATABASE_URL,
  redis: {
    host: 'localhost',
    port: 6379
  },

  // path
  Controllers: Controllers,

  // token
  VERIFY_TOKEN: process.env.VERIFY_TOKEN,
  FB_TOKEN: process.env.FB_TOKEN,
  GOOGLE_PLACE_KEY: process.env.GOOGLE_PLACE_KEY
};
