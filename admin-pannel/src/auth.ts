import NextAuth, { User } from "next-auth";
import credentials from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signOut, signIn } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        return { id: "1", name: "admin" };
      },
    }),
  ],
  session: { strategy: "jwt" },
});
