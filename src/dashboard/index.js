const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;

module.exports = async Client => {
  const app = express();
  const MemoryStore = require("memorystore")(session);

  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use("/static", express.static("resources/static"));
  app.use("/public", express.static("resources/public"));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
  passport.use(
    new Strategy(
      {
        clientID: Client.id,
        clientSecret: Client.secret,
        callbackURL: `http://localhost:${Client.port}/callback`,
        scope: ["identify", "guilds"],
      },
      (accessToken, refreshToken, profile, done) => {
        // eslint-disable-line no-unused-vars
        // On login we pass in profile with no logic.
        process.nextTick(() => done(null, profile));
      }
    )
  );

  // We initialize the memorystore middleware with our express app.
  app.use(
    session({
      store: new MemoryStore({ checkPeriod: 86400000 }),
      secret:
        "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
      resave: false,
      saveUninitialized: false,
    })
  );

  // We initialize passport middleware.
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    req.client = Client;
    req.logger = Client.logger.log;
    next();
  });

  const checkAuth = (req, res, next) => {
    // If authenticated we forward the request further in the route.
    if (req.isAuthenticated()) return next();
    // We redirect user to login endpoint/route.
    res.redirect("/login");
  };

  // Login endpoint.
  app.get(
    "/login",
    (req, res, next) => {
      next();
    },
    passport.authenticate("discord")
  );

  // Callback endpoint.
  app.get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    /* We authenticate the user, if user canceled we redirect him to index. */ (req, res) => {
      // If user had set a returning url, we redirect him there, otherwise we redirect him to index.
      res.redirect("/dashboard/");
    }
  );

  // Logout endpoint.
  app.get("/logout", function (req, res) {
    // We destroy the session.
    req.session.destroy(() => {
      // We logout the user.
      req.logout();
      // We redirect user to index.
      res.redirect("/");
    });
  });

  app.get("/dashboard/", checkAuth, async (req, res) => {
    const clientGuilds = req.user.guilds;

    const guilds = await req.client.getGuilds(clientGuilds.map(x => x.id));

    return res.json({ guilds });
  });

  app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = req.client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");

    const member = await guild.members.fetch(req.user.id);

    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    const storedSettings = await req.client.getGuild(guild.id);
    res.json({ guild, settings: storedSettings });
  });

  app.listen(Client.port, Client.logger.log("Website is ready", "log"));
};
