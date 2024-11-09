// pages/api/user-data.ts
import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    githubId?: string;  // GitHub IDを追加
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req }) as CustomSession | null

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const client = await clientPromise
    const db = client.db()

    // ユーザーIDとしてGitHubIDを使用（存在する場合）
    const userId = session.user.githubId || session.user.id

    if (req.method === 'POST') {
      const result = await db.collection('userData').updateOne(
        { userId },
        { 
          $set: { 
            data: req.body.data,
            updatedAt: new Date(),
            provider: 'github'
          } 
        },
        { upsert: true }
      )
      res.status(200).json({ message: 'Data saved successfully', result })
    } else if (req.method === 'GET') {
      const userData = await db.collection('userData').findOne({ userId })
      res.status(200).json(userData ? userData.data : null)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
