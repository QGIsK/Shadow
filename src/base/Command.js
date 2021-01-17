class Command {
  constructor(
    client,
    {
      name = null,
      description = "No description provided.",
      category = "Miscellaneous",
      usage = "No usage provided.",
      enabled = true,
      guildOnly = false,
      aliases = new Array(),
      userPermissions = newArray(),
    }
  ) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, userPermissions };
    this.help = { name, description, category, usage };
  }
}
module.exports = Command;
