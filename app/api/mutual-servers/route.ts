import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const token = req.cookies.get('discord_token')?.value
    if (!token)
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )

    try {
        const backendRes = await fetch(
            'http://localhost:3001/api/mutual-servers',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!backendRes.ok) {
            const text = await backendRes.text()
            console.error('Backend error:', text)
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to fetch mutual servers from backend',
                },
                { status: 500 }
            )
        }

        const data = await backendRes.json()
        return NextResponse.json(data)
    } catch (err: any) {
        console.error('Proxy error:', err)
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        )
    }
}
