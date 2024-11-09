// pages/api/user-data.ts
import { getSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { Octokit } from '@octokit/rest'

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;  // GitHub access token
  }
}

interface GistContent {
  ideas: Array<{
    title: string;
    description: string;
    details: string;
    languages: string[];
    frameworks: string[];
    githubUrl: string;
    createGitHubRepo: boolean;
  }>;
  updatedAt: string;
}

// Gistの説明文として使用する固定の文字列
const GIST_DESCRIPTION = 'Project Ideas Storage'
const GIST_FILENAME = 'project-ideas.json'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req }) as CustomSession | null

    if (!session || !session.user.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const octokit = new Octokit({
      auth: session.user.accessToken
    })

    if (req.method === 'POST') {
      // データを保存
      const newData: GistContent = {
        ideas: req.body.data,
        updatedAt: new Date().toISOString()
      }

      // 既存のGistを検索
      const gists = await octokit.gists.list()
      const existingGist = gists.data.find(
        gist => gist.description === GIST_DESCRIPTION
      )

      if (existingGist) {
        // 既存のGistを更新
        await octokit.gists.update({
          gist_id: existingGist.id,
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(newData, null, 2)
            }
          }
        })
      } else {
        // 新しいGistを作成
        await octokit.gists.create({
          description: GIST_DESCRIPTION,
          public: false,
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(newData, null, 2)
            }
          }
        })
      }

      res.status(200).json({ message: 'Data saved successfully' })
    } else if (req.method === 'GET') {
      // データを取得
      const gists = await octokit.gists.list()
      const existingGist = gists.data.find(
        gist => gist.description === GIST_DESCRIPTION
      )

      if (!existingGist) {
        return res.status(200).json(null)
      }

      const gistData = await octokit.gists.get({
        gist_id: existingGist.id
      })

      const content = gistData.data.files?.[GIST_FILENAME]?.content
      const parsedContent = content ? JSON.parse(content) : null

      res.status(200).json(parsedContent?.ideas || null)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}