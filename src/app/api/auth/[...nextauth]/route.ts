// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'read:user gist'  // gistスコープを追加
        }
      }
        })
      ],
      callbacks: {
        async jwt({ token, account }) {
          // アクセストークンをJWTに保存
          if (account) {
            token.accessToken = account.access_token
          }
          return token
        },
        async session({ session, token }: { session: any; token: any }) {
          // セッションにアクセストークンを追加
          session.user.accessToken = token.accessToken
          return session
        }
      },
      pages: {
        signIn: '/auth/signin',
      },
    })
    
    export { handler as GET, handler as POST }
