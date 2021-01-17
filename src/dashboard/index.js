const Express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

module.exports = async Client => {
  const app = Express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(expressSanitizer());
  app.use(express.json());

  app.use("/static", express.static("resources/static"));
  app.use("/public", express.static("resources/public"));

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use((req, res, next) => {
    req.client = Client;
    next();
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/resources/views/index.html"));
  });

  app.use("/api", require("./routes/"));

  app.listen(Client.port, Client.logger.log("Website is ready", "log"));
};
