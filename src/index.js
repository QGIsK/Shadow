require("dotenv").config();

const Discord = require("discord.js");
const fs = require("fs");

const Client = new Discord.Client();
const Levels = require("discord-xp");

const { CREATOR, DEFAULT_PREFIX, BOT_TOKEN, INVITE, MONGO_URI } = process.env;

async function start() {
  Levels.setURL(MONGO_URI);

  //Client utils & variables
  Client.DB = require("./db");
  Client.logger = require("./utils/Logger");
  Client.creator = CREATOR;
  Client.defaultPrefix = DEFAULT_PREFIX;
  Client.inviteLink = INVITE;
  Client.Levels = Levels;
  Client.regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;

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
