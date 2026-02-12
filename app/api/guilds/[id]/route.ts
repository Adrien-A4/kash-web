import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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
                { error: 'Guild not found or no access' },
                { status: 404 }
            )
        }
        const permissions = parseInt(targetGuild.permissions)
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
        const botApiUrl =
            process.env.BOT_API_URL || 'http://46.247.108.191:30276'
        const botRes = await fetch(`${botApiUrl}/api/guilds/${guildId}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.DASHBOARD_API_KEY || '',
            },
        })

        let guildData: Record<string, unknown> = {}
        if (botRes.ok) {
            guildData = await botRes.json()
        }
        const isPremium = await checkPremiumStatus(guildId)

        return NextResponse.json({
            success: true,
            guild: {
                id: targetGuild.id,
                name: targetGuild.name,
                icon: targetGuild.icon
                    ? `https://cdn.discordapp.com/icons/${targetGuild.id}/${targetGuild.icon}.png`
                    : null,
                memberCount: guildData.memberCount ?? 0,
                permissions: permissions,
                premium: isPremium,
                ...guildData,
            },
        })
    } catch (error) {
        console.error('Guild API error:', error)
        const isDevelopment = process.env.NODE_ENV === 'development'
        return NextResponse.json(
            {
                error: 'Internal server error',
                ...(isDevelopment && {
                    details:
                        error instanceof Error ? error.message : String(error),
                }),
            },
            { status: 500 }
        )
    }
}

async function checkPremiumStatus(guildId: string): Promise<boolean> {
    try {
        const botApiUrl =
            process.env.BOT_API_URL || 'http://46.247.108.191:30276'
        const res = await fetch(
            `${botApiUrl}/api/ispremium?guildId=${guildId}`,
            {
                headers: {
                    'x-api-key': process.env.DASHBOARD_API_KEY || '',
                },
            }
        )

        if (!res.ok) return false

        const data = await res.json()
        if (data.success) {
            return Boolean(data.isPremium)
        }
        return false
    } catch {
        return false
    }
}
