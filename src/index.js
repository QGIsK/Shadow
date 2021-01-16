"use strict";

require("dotenv").config();

const { CommandoClient } = require("discord.js-commando");
const path = require("path");

const { OWNER, DEFAULT_PREFIX, BOT_TOKEN, INVITE, MONGO_URI } = process.env;

const Client = new CommandoClient({
  commandPrefix: DEFAULT_PREFIX,
  owner: OWNER,
  invite: INVITE,
});

const MessageHandler = require("./handlers/message");

Client.db = require("./db/");
Client.logger = require("./utils/Logger");

Client.registry
  // Registers your custom command groups
  .registerGroups([])

  // Registers all built-in groups, commands, and argument types
  .registerDefaults()

  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, "commands"));

Client.on("message", (message) =>
  require("./handlers/message")(Client, message)
);

Client.on("disconnect", () =>
  Client.logger.log("Bot is disconnecting...", "warn")
)
  .on("ready", () => {
    Client.logger.log("Bot is online", "log");
    require("./dashboard/")(Client);
  })
  .on("reconnecting", () => Client.logger.log("Bot reconnecting...", "log"))
  .on("error", (e) => Client.logger.log(e, "error"))
  .on("warn", (info) => Client.logger.log(info, "warn"));

Client.login(BOT_TOKEN);

process.on("unhandledRejection", (err) => {
  console.error(err);
});
