import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
    const invitelink = 'https://discord.gg/pX8eyBuCxf'
    return NextResponse.redirect(invitelink)
}
