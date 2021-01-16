const timestamps = require("mongoose-timestamp");
const mongoose = require("mongoose");

const { DEFAULT_PREFIX } = process.env;

const GuildSettingsSchema = mongoose.Schema({
  guildID: { type: String, required: true },
  settings: {
    prefix: {
      type: String,
      default: DEFAULT_PREFIX,
    },
    
  },
});

GuildSettingsSchema.plugin(timestamps);

const Guild = mongoose.model("Guild", GuildSettingsSchema);

module.exports = Guild;
