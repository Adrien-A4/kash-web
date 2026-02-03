import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const response = await fetch('http://localhost:3001/api/status')

        if (!response.ok) {
            throw new Error(`External API failed: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
