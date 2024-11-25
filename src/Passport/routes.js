

router.route("/google").get(
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
    (req, res) => {
      res.send("redirecting to google...");
    }
  );

  router
  .route("/google/callback")
  .get(passport.authenticate("google"), handleSocialLogin);
