const GoogleStrategegy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

async function authenticateGoogleUser(
  accessToken,
  refreshToken,
  profile,
  done
) {
  const newUser = {
    _id: profile.id,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value,
    password: "012345678",
    address: profile.provider,
    country: profile.provider,
    city: profile.provider,
    state: profile.provider,
  };

  let user = await User.findOne({ _id: profile.id });
  if (user == null) {
    user = await User.create(newUser);
  } else {
    done(null, user);
  }
}
function intializeGooglePasssport(passport) {
  passport.use(
    new GoogleStrategegy(
      {
        clientID: process.env.CLIENT_ID_GOOGLE,
        clientSecret: process.env.CLIENT_SECRECT_GOOGLE,
        callbackURL: "http://icrowdtask.herokuapp.com/auth/google/callback",
        // callbackURL: "http://localhost:3000/auth/google/callback",
      },
      authenticateGoogleUser
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    return done(null, user);
  });
}

module.exports = intializeGooglePasssport;
