const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  enableIndex: process.env.ENABLE_INDEX_FILE || false,
  port: process.env.PORT || 3030
};