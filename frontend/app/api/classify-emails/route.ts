import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: Request) {
    console.log("Received classification request")
    try {
        const { emails } = await req.json()
        const openaiKey = req.headers.get('X-OpenAI-Key')

        console.log("Emails received:", emails.length)
        console.log("OpenAI Key received:", openaiKey ? "Yes" : "No")

        if (!openaiKey) {
            console.error("OpenAI API key is missing")
            return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 400 })
        }

        const openai = new OpenAI({ apiKey: openaiKey });

        console.log("Starting email classification")
        const classifiedEmails = await Promise.all(emails.map(async (email: any) => {
            const prompt = `Classify the following email into one of these categories: Important, Promotions, Social, Marketing, Spam, or General.

Subject: ${email.subject}
From: ${email.from}
Snippet: ${email.snippet}

Category:`

            console.log("Sending prompt to OpenAI:", prompt)
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant that classifies emails." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1,
                n: 1,
                temperature: 0.5,
            })

            const category = completion.choices[0]?.message?.content?.trim() || 'Unclassified'
            console.log("Received category:", category)
            return { ...email, category }
        }))

        console.log("Classification complete")
        return NextResponse.json(classifiedEmails)
    } catch (error) {
        console.error('Error in classification route:', error)
        if (error instanceof Error) {
            console.error('Error details:', error.message, error.stack)
        }
        return NextResponse.json({ error: 'Failed to classify emails', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}