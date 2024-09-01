import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app"
import * as token from '../../../../../vanko-firebase-key.json'

export const authOptions = {
    // Configure one or more authentication providers
    adapter: FirestoreAdapter({
        credential: cert(token)
    }),
	providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "", 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        // ...add more providers here
    ],
    secret : process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

