import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

declare module "next-auth" {
  interface User {
    emailVerified?: Date | null;
    image?: string | null
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  //@ts-ignore
  adapter: PrismaAdapter(prisma),
  session : {
    strategy : "jwt"
  },
  secret : process.env.AUTH_SECRET,
  pages : {
    signIn : "/connexion",
    error: "/error",
  },
  debug : process.env.NODE_ENV === "development",
  providers : [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
   
    Credentials({
      name : "credentials",
      credentials : {
        email: { label: "Email", type: "email" }, // Add these properties
        password: { label: "Password", type: "password" }
      },
      authorize : async(credentials)=>{
          
          if (!credentials?.email || !credentials?.password) {
              // No user found, so this is their first attempt to login
              // meaning this is also the place you could do registration
              throw new Error("Invalid credential.")

          }

          const user = await prisma.user.findUnique({
            where : {
              // @ts-ignore
              email : credentials.email
            }
          })

          if(!user || !user?.password){
            throw new Error('Email ou Mot de passe incorrect')
          }

          // @ts-ignore
          const isCorrectPass = await bcrypt.compare(credentials.password, user.password);
          if (!isCorrectPass) {
            throw new Error("Invalid email or password.");
          }

          // return user object with the their profile data
          return user
      }
  })
  ],

  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
  
      const email = session.user?.email;
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
  
        if (existingUser && existingUser.id !== token.id) {
          // Vérifie et assure que 'provider', 'providerAccountId' et 'type' sont définis
          const provider = typeof token.provider === "string" ? token.provider : "";
          const providerAccountId = typeof token.sub === "string" ? token.sub : "";
  
          if (provider && providerAccountId) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider,
                providerAccountId,
                type: "oauth", // Assure que le type est défini (ajuste si nécessaire)
              },
            });
          }
  
          session.user.id = existingUser.id;
        }
      }
  
      return session;
    },
  
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = account?.provider ?? "";
        token.sub = account?.providerAccountId ?? "";
      }
      return token;
    },
  },
  

})


