import type { Metadata } from 'next'
import { Geist, Geist_Mono, Figtree } from 'next/font/google'
import './globals.css'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'kash',
    description:
        'multipurpose discord bot, with features like moderation, transfer system and more!',
    openGraph: {
        title: 'kash',
        description:
            'multipurpose discord bot, with features like moderation, transfer system and more!',
        images: [
            {
                url: '',
            },
        ],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={figtree.variable}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    )
}
