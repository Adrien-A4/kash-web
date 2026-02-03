'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingNavbar } from '@/components/Navbar'
import { useState } from 'react'
import Image from 'next/image'
const ShieldIcon = () => (
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)
export default function LoginPage() {
    const router = useRouter()
    const [isExiting, setIsExiting] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

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
                    className="relative min-h-screen overflow-hidden bg-linear-to-br from-black via-zinc-950 to-zinc-900 text-white flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,255,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(88,101,242,0.08),transparent_50%)]" />

                    <FloatingNavbar />

                    <motion.div
                        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(88,101,242,0.15),transparent_70%)] blur-xl pointer-events-none"
                        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(120,120,255,0.1),transparent_70%)] blur-xl pointer-events-none"
                        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <div className="relative z-10 w-full max-w-lg px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="rounded-4xl border border-white/8 bg-white/3 backdrop-blur-sm px-10 py-30 shadow-lg"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center mb-12"
                            >
                                <Image
                                    src="/kash.png"
                                    width={160}
                                    height={160}
                                    alt="Kash"
                                    draggable={false}
                                    className="rounded-full"
                                />
                                <h1 className="mt-4 text-2xl font-bold tracking-tight">
                                    Kash
                                </h1>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Welcome! Please log in to continue.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-center gap-2 mb-6"
                            >
                                <ShieldIcon />
                                <span className="text-xs text-zinc-500">
                                    Secure authentication via Discord
                                </span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <button
                                    onClick={() =>
                                        handleNavigation('/api/auth/discord')
                                    }
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className="relative w-full overflow-hidden rounded-xl border border-[#5865F2] bg-[#5865F2] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-[#4752C4] hover:shadow-[0_8px_30px_rgba(88,101,242,0.4)] active:scale-[0.97]"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]"
                                        animate={{ opacity: isHovered ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10 flex items-center justify-center gap-2.5">
                                        <Image
                                            src="/discord.png"
                                            width={20}
                                            height={20}
                                            alt="Discord"
                                            draggable={false}
                                        />
                                        Authorize with Discord
                                    </span>
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.45 }}
                                className="mt-6 flex flex-col items-center gap-4"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Image
                                        src="/discord.png"
                                        width={18}
                                        height={18}
                                        draggable={false}
                                        alt="Discord"
                                    />
                                    <span className="text-xs text-zinc-600">
                                        By logging in, you agree to join the
                                        Kash support server.
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 text-center"
                        >
                            <button
                                onClick={() => handleNavigation('/')}
                                className="text-xs text-zinc-600 transition-colors duration-200 hover:text-zinc-400"
                            >
                                ← Back to home
                            </button>
                        </motion.div>
                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    )
}
