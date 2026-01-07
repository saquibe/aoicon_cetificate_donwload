// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Mobile", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.otp) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Use relative URL for better compatibility
          const baseUrl = process.env.NEXTAUTH_URL || "";
          const apiUrl = `${baseUrl}/api/auth/verify-otp`;

          console.log("Calling verify-otp API:", {
            identifier: credentials.identifier,
            otp: credentials.otp,
          });

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.identifier,
              otp: credentials.otp,
            }),
          });

          const data = await response.json();
          console.log("Verify-OTP response:", data);

          if (response.ok && data.success && data.user) {
            console.log("User data received:", {
              name: data.user.name,
              certUrl: data.user.certUrl,
              hasCertUrl: !!data.user.certUrl,
            });

            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              registrationNumber: data.user.registrationNumber,
              mobile: data.user.mobile,
              certUrl: data.user.certUrl, // Make sure this exists
            };
          } else {
            console.log("Auth failed:", data.error);
            return null;
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT - User data:", user);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.registrationNumber = (user as any).registrationNumber;
        token.mobile = (user as any).mobile;
        token.certUrl = (user as any).certUrl;
        console.log("JWT token certUrl:", token.certUrl);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token certUrl:", token.certUrl);
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).name = token.name;
        (session.user as any).email = token.email;
        (session.user as any).registrationNumber = token.registrationNumber;
        (session.user as any).mobile = token.mobile;
        (session.user as any).certUrl = token.certUrl;

        console.log("Session user certUrl:", (session.user as any).certUrl);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
