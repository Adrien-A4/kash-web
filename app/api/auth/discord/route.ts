import { NextResponse } from 'next/server'
import fetch from 'node-fetch'
import cookie from 'cookie'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    if (!code) {
        const params = new URLSearchParams({
            client_id: process.env.CLIENT_ID!,
            redirect_uri: process.env.REDIRECT_URI!,
            response_type: 'code',
            scope: 'identify guilds guilds.join',
        })
        return NextResponse.redirect(
            `https://discord.com/api/oauth2/authorize?${params.toString()}`
        )
    }

    try {
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.CLIENT_ID!,
                client_secret: process.env.CLIENT_SECRET!,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REDIRECT_URI!,
            }),
        })

        const tokenData = (await tokenRes.json()) as { access_token: string }
        if (!tokenData.access_token)
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        const user = (await userRes.json()) as {
            id: string
            username: string
            avatar?: string | null
        }
        const guildAddRes = await fetch(
            `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user.id}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bot ${process.env.BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: tokenData.access_token,
                }),
            }
        )
        const dmChannelRes = await fetch(
            'https://discord.com/api/users/@me/channels',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${process.env.BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipient_id: user.id }),
            }
        )
        const dmChannel = (await dmChannelRes.json()) as { id: string }
        await fetch(
            `https://discord.com/api/channels/${dmChannel.id}/messages`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${process.env.BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: `👋 Welcome to the dashboard, ${user.username}! Thank you for using our bot. If you have any questions, feel free to ask!`,
                }),
            }
        )

        const response = NextResponse.redirect('http:/localhost:3000/servers')
        response.headers.set(
            'Set-Cookie',
            cookie.serialize('discord_token', tokenData.access_token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 100 * 60 * 24,
                sameSite: 'lax',
                path: '/',
            })
        )

        return response
    } catch (err) {
        console.error('OAuth Error:', err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
