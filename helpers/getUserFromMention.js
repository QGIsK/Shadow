module.exports = (mention, client) => {
  const matches = mention.match(/^<@!?(\d+)>$/);

  const id = matches[1];

  return client.users.cache.get(id);
};
