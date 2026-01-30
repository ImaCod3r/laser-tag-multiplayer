import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User";


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback"
}, async (_accessToken, _refreshToken, profile, done) => {
    const [user] = await User.findOrCreate({
        where: { id: profile.id },
        defaults: {
            username: profile.displayName,
            avatar: profile.photos?.[0]?.value
        }
    }
    );

    await user.update({
        username: profile.displayName,
        avatar: profile.photos?.[0]?.value
    });

    done(null, user.id);
}));

passport.serializeUser((userId, done) => {
  done(null, userId);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});