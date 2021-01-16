const mongoose = require("mongoose");

const logger = require("../utils/Logger");
const { MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => logger.log("MongoDB connected", "log"))
  .catch((e) => {
    Client.logger.log(e, "error");
    process.exit(1);
  });

module.exports = {
  Guild: require("./models/Guilds"),
};
