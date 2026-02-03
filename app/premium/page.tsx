'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingNavbar } from '@/components/Navbar'
import { useState } from 'react'
import Image from 'next/image'

const DISCORD_AUTH_URL =
    'https://discord.com/oauth2/authorize?client_id=1231552173104693249&scope=bot+applications.commands&permissions=8'

const CheckIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6bcb77"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const CrossIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const LinkIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
)

const StarIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

interface Feature {
    label: string
    free: boolean
}

const features: Feature[] = [
    { label: 'All free features', free: true },
    { label: 'Cooldowns & limits', free: true },
    { label: 'Special role', free: false },
    { label: 'Default embed color', free: true },
    { label: 'Ability to change avatar and bio for your server.', free: false },
    { label: 'Priority support', free: false },
]

const premiumFeatures = [
    'All free & premium features',
    'No cooldowns & limits',
    'Special role',
    'Ability to change avatar and bio for your server.',
    'Priority support',
]

export default function PremiumPage() {
    const router = useRouter()
    const [isExiting, setIsExiting] = useState(false)

    const handleNavigation = (href: string) => {
        setIsExiting(true)
        setTimeout(() => {
            if (href.startsWith('http')) {
                window.location.href = href
            } else {
                router.push(href)
            }
        }, 300)
    }

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative min-h-screen overflow-hidden bg-linear-to-br from-black via-zinc-950 to-zinc-900 text-white"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,255,0.12),transparent_60%)]" />
                    <FloatingNavbar />

                    <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center mb-16"
                        >
                            <h1 className="flex items-center gap-5 text-6xl font-bold tracking-tight sm:text-7xl pl-12">
                                <Image
                                    src="/kash.png"
                                    width={72}
                                    height={72}
                                    alt="Kash"
                                    draggable={false}
                                    className="rounded-full"
                                />
                                <span className="text-zinc-500">Premium</span>
                            </h1>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="rounded-2xl border border-white/8 bg-white/3 p-8 flex flex-col"
                            >
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <Image
                                            src="/kash.png"
                                            width={50}
                                            height={50}
                                            alt="Kash"
                                            draggable={false}
                                            className="rounded-full"
                                        />
                                        <h2 className="text-2xl font-bold text-white">
                                            Free Plan
                                        </h2>
                                    </div>
                                    <p className="text-sm text-zinc-500 ml-10.75">
                                        Start your journey with Kash
                                    </p>
                                </div>

                                <ul className="flex-1 flex flex-col gap-4">
                                    {features.map((f) => (
                                        <li
                                            key={f.label}
                                            className="flex items-center gap-3.5"
                                        >
                                            {f.free ? (
                                                <CheckIcon />
                                            ) : (
                                                <CrossIcon />
                                            )}
                                            <span
                                                className={`text-sm ${f.free ? 'text-zinc-300' : 'text-zinc-600'}`}
                                            >
                                                {f.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={DISCORD_AUTH_URL}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleNavigation(DISCORD_AUTH_URL)
                                    }}
                                    className="mt-8 flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/4 px-6 py-3.5 text-sm font-medium text-zinc-300 transition-all duration-250 hover:bg-white/[0.07] hover:border-white/18"
                                >
                                    <LinkIcon />
                                    Invite Kash
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative rounded-2xl border border-white/10 bg-white/4 p-8 flex flex-col"
                            >
                                <div className="absolute -top-3.5 right-6">
                                    <span className="rounded-full border border-white/15 bg-white/8 px-4 py-1 text-xs font-medium text-zinc-300">
                                        Recommended
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <Image
                                            src="/kash.png"
                                            width={50}
                                            height={50}
                                            alt="Kash"
                                            draggable={false}
                                            className="rounded-full"
                                        />
                                        <h2 className="text-2xl font-bold text-white">
                                            Premium Plan
                                        </h2>
                                    </div>
                                    <p className="text-sm text-zinc-500 ml-10.75">
                                        Unlock the full potential
                                    </p>
                                </div>

                                <ul className="flex-1 flex flex-col gap-4">
                                    {premiumFeatures.map((label) => (
                                        <li
                                            key={label}
                                            className="flex items-center gap-3.5"
                                        >
                                            <CheckIcon />
                                            <span className="text-sm text-zinc-300">
                                                {label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="mt-8 flex items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-white/6 px-6 py-3.5 text-sm font-medium text-zinc-300 transition-all duration-250 hover:bg-white/10 hover:border-white/20"
                                >
                                    <StarIcon />
                                    Get Premium ($1.99/mo or $10/lifetime)
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    )
}
