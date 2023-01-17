const server = require('./src/app.js');
require('dotenv').config();
const { PORT } = require("./config.js")

server.listen(PORT, () => {
  console.log(`%s listening at ${PORT} `); // eslint-disable-line no-console
});

