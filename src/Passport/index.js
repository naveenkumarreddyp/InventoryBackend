// required for passport
app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  ); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions