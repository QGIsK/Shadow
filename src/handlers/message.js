


module.exports = (Client, message) => {
  // Declaring a reply function for easier replies - we grab all arguments provided into the function and we pass them to message.channel.send function.
  const reply = (...arguments) => message.channel.send(...arguments);

  // Doing some basic command logic.
  if (message.author.bot) return;
  if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
    return;
};
