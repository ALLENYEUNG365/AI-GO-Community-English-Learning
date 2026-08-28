import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (process.env.NODE_ENV === 'production') {
  if (!nextAuthSecret || nextAuthSecret.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be set to a random value of at least 32 characters in production.');
  }

  if (!googleClientId || !googleClientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured in production.');
  }
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers: [
    GoogleProvider({
      clientId: googleClientId || '',
      clientSecret: googleClientSecret || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};
