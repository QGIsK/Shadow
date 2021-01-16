require("dotenv").config();

const Discord = require("discord.js");
const fs = require("fs");

const Client = new Discord.Client();

const { OWNER, DEFAULT_PREFIX, BOT_TOKEN, INVITE } = process.env;

async function start() {
  Client.DB = require("./db");
  Client.logger = require("./utils/Logger");
  Client.owner = OWNER;
  Client.defaultPrefix = DEFAULT_PREFIX;
  Client.inviteLink = INVITE;

  // Command Handler
  Client.cooldowns = new Discord.Collection();
  Client.commands = new Discord.Collection();

  const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    Client.commands.set(command.name, command);
  }

  require("./utils/Guild")(Client);
  require("./events")(Client);

  Client.login(BOT_TOKEN);
}

start();

process.on("unhandledRejection", err => {
  console.error(err);
});
