'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FloatingNavbar } from '@/components/Navbar'
import { useState } from 'react'

export default function HomePage() {
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,255,0.15),transparent_60%)]" />
                    <FloatingNavbar />
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute top-6 right-6 z-50"
                    >
                        <Link
                            href="/login"
                            onClick={(e) => {
                                e.preventDefault()
                                handleNavigation('/login')
                            }}
                            className="group relative flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-5 py-2.5 text-sm font-medium text-zinc-300 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 ease-out hover:border-white/25 hover:bg-white/8 hover:text-white hover:shadow-[0_0_24px_rgba(120,120,255,0.18)] active:scale-[0.96]"
                        >
                            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(120,120,255,0.08),transparent_70%)]" />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="relative z-10 text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="8" r="4" />
                            </svg>
                            <span className="relative z-10">Dashboard</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="relative z-10 -mr-1 w-0 overflow-hidden text-zinc-500 transition-all duration-300 group-hover:w-3.25 group-hover:mr-0 group-hover:text-zinc-300"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </motion.div>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="/kash.png"
                                alt="Kash"
                                width={180}
                                height={180}
                                className="rounded-full border border-white/10 shadow-xl"
                                priority
                                draggable={false}
                            />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl"
                        >
                            Kash
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="mt-4 max-w-xl text-lg text-zinc-400"
                        >
                            A precision-built Discord bot engineered for your
                            server's needs.
                        </motion.p>

                        <div>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="mt-4 max-w-xl text-lg"
                            >
                                <span className="text-zinc-400">
                                    assisting{' '}
                                </span>
                                <span className="text-white font-medium">
                                    x
                                </span>
                                <span className="text-zinc-400">
                                    {' '}
                                    guilds and{' '}
                                </span>
                                <span className="text-white font-medium">
                                    x
                                </span>
                                <span className="text-zinc-400"> users</span>
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 flex gap-4"
                        >
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Button
                                    asChild
                                    size="wide"
                                    className="bg-[#5865F2] text-white border border-[#5865F2] rounded-2xl transition-all duration-300 ease-out hover:bg-[#4752C4] hover:shadow-[0_8px_30px_rgba(88,101,242,0.45)] active:scale-[0.97]"
                                >
                                    <Link
                                        href="https://discord.com/oauth2/authorize?client_id=1231552173104693249&scope=bot+applications.commands&permissions=8"
                                        className="flex items-center gap-2"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleNavigation(
                                                'https://discord.com/oauth2/authorize?client_id=1231552173104693249&scope=bot+applications.commands&permissions=8'
                                            )
                                        }}
                                    >
                                        <Image
                                            src="/discord.png"
                                            alt="Discord"
                                            width={25}
                                            height={25}
                                            className="rounded-full"
                                            priority
                                        />
                                        Add to Discord
                                    </Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Link
                                    href="/premium"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleNavigation('/premium')
                                    }}
                                    className="group flex items-center gap-2.5 rounded-2xl border border-[rgba(240,192,64,0.2)] bg-[rgba(240,192,64,0.08)] px-5 py-2.5 transition-all duration-250 hover:bg-[rgba(240,192,64,0.14)] hover:border-[rgba(240,192,64,0.35)]"
                                >
                                    <Image
                                        src="/kash.png"
                                        alt="Premium"
                                        width={25}
                                        height={25}
                                        className="rounded-full"
                                        priority
                                    />
                                    <span className="text-sm font-medium text-[#f0c040]">
                                        Premium
                                    </span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.section>

                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-32 border-t border-white/10 py-8 text-center text-sm text-zinc-500"
                    >
                        <Link
                            href="https://github.com/Adrien-A4/kash-web"
                            className="text-zinc-500 hover:text-zinc-400 font-medium"
                            target="_blank"
                        >
                            Kash
                        </Link>
                        <div>
                            © {new Date().getFullYear()} Adrien-A4. All rights
                            reserved.
                        </div>
                    </motion.footer>
                </motion.main>
            )}
        </AnimatePresence>
    )
}
