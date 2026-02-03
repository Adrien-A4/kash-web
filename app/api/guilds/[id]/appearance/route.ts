import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: guildId } = await params
        const body = await request.json()
        const { avatar, bio, banner } = body

        const cookieStore = await cookies()
        const token = cookieStore.get('discord_token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!userRes.ok) {
            return NextResponse.json(
                { error: 'Invalid Discord token' },
                { status: 401 }
            )
        }
        const guildsRes = await fetch(
            'https://discord.com/api/users/@me/guilds',
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )

        if (!guildsRes.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch user guilds' },
                { status: 500 }
            )
        }

        const guilds = await guildsRes.json()
        const targetGuild = guilds.find((g: any) => g.id === guildId)
        if (!targetGuild) {
            return NextResponse.json(
                {
                    error: 'Guild not found or no access',
                    details: {
                        requestedId: guildId,
                        userGuildCount: guilds.length,
                    },
                },
                { status: 404 }
            )
        }
        const permissions = targetGuild.permissions
        const hasManageGuild = (permissions & 0x20) !== 0
        const hasAdmin = (permissions & 0x8) !== 0
        if (!hasManageGuild && !hasAdmin) {
            return NextResponse.json(
                {
                    error: 'Insufficient permissions',
                    required: 'Manage Server or Administrator',
                },
                { status: 403 }
            )
        }
        const botApiUrl = process.env.BOT_API_URL || 'http://localhost:3001'
        const botRes = await fetch(
            `${botApiUrl}/api/guilds/${guildId}/appearance`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.DASHBOARD_API_KEY || '',
                },
                body: JSON.stringify({ avatar, bio, banner }),
            }
        )

        if (!botRes.ok) {
            const errorData = await botRes.json().catch(() => ({}))
            return NextResponse.json(
                { error: errorData.error || 'Failed to update appearance' },
                { status: botRes.status }
            )
        }

        const data = await botRes.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Appearance API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: guildId } = await params

        const cookieStore = await cookies()
        const token = cookieStore.get('discord_token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }
        const botApiUrl = process.env.BOT_API_URL || 'http://localhost:3001'
        const botRes = await fetch(
            `${botApiUrl}/api/guilds/${guildId}/appearance`,
            {
                headers: {
                    'x-api-key': process.env.DASHBOARD_API_KEY || '',
                },
            }
        )

        if (!botRes.ok) {
            const errorData = await botRes.json().catch(() => ({}))
            return NextResponse.json(
                { error: errorData.error || 'Failed to fetch appearance' },
                { status: botRes.status }
            )
        }

        const data = await botRes.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Appearance API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
