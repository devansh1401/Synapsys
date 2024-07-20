import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { google } from 'googleapis'
import { Session } from 'next-auth'

export async function GET(req: Request) {
    const session = await auth() as Session & { accessToken?: string }

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: session.accessToken })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    try {
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 15 // Fetch last 10 emails
        })

        const emails = await Promise.all(
            (response.data.messages || []).map(async (message) => {
                const emailData = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id as string
                })
                return {
                    id: emailData.data.id,
                    subject: emailData.data.payload?.headers?.find((h: any) => h.name === 'Subject')?.value,
                    from: emailData.data.payload?.headers?.find((h: any) => h.name === 'From')?.value,
                    snippet: emailData.data.snippet
                }
            })
        )

        return NextResponse.json(emails)
    } catch (error) {
        console.error('Error fetching emails:', error)
        return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
    }
}