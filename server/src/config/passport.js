import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../config/db.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await prisma.user.findUnique({
                where: { email: profile.emails[0].value },
            });


            // Create new user
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        avatarUrl: profile.photos[0]?.value,
                        passwordHash: 'GOOGLE_OAUTH', // No password needed for Google OAuth
                        role: 'MEMBER',
                    },
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

export default passport;