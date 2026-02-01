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
                                    className="
                                        bg-[#5865F2]
                                        text-white
                                        border border-[#5865F2]
                                        rounded-2xl
                                        transition-all
                                        duration-300
                                        ease-out
                                        hover:bg-[#4752C4]
                                        hover:shadow-[0_8px_30px_rgba(88,101,242,0.45)]
                                        active:scale-[0.97]
                                    "
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
                                <Button
                                    asChild
                                    variant="default"
                                    size="wide"
                                    className="rounded-4xl border-white text-white"
                                >
                                    <Link
                                        href="/premium"
                                        className="flex items-center gap-2"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleNavigation('/premium')
                                        }}
                                    >
                                        <Image
                                            src="/kash.png"
                                            alt="Premium"
                                            width={33}
                                            height={33}
                                            className="rounded-full"
                                            priority
                                        />
                                        Premium
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.section>

                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-32 border-t border-white/10 py-8 text-center text-sm text-zinc-500"
                    >
                        © {new Date().getFullYear()} Kash
                        <Link
                            href="https://github.com/Adrien-A4/kash-web"
                            className="text-white"
                        >
                            GitHub
                        </Link>
                    </motion.footer>
                </motion.main>
            )}
        </AnimatePresence>
    )
}
