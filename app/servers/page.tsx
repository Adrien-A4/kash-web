'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingNavbar } from '@/components/Navbar'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Cookies from 'js-cookie'

interface Guild {
    id: string
    name: string
    icon: string | null
    owner: boolean
    memberCount: number
}

interface User {
    id: string
    username: string
    avatar?: string | null
}

const SearchIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const ChevronIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
    >
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

const CrownIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="#f0c040"
        stroke="none"
    >
        <path d="M2 18l3-12 5 6 2-8 2 8 5-6 3 12H2z" />
    </svg>
)

export default function ServerSelectorPage() {
    const router = useRouter()
    const [isExiting, setIsExiting] = useState(false)
    const [guilds, setGuilds] = useState<Guild[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [filteredGuilds, setFilteredGuilds] = useState<Guild[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [authenticated, setAuthenticated] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const token = Cookies.get('discord_token')

        if (!token) {
            setAuthenticated(false)
            setLoading(false)
            return
        }

        setAuthenticated(true)
        const fetchUser = async () => {
            try {
                const userRes = await fetch(
                    'https://discord.com/api/users/@me',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                if (!userRes.ok) throw new Error('Failed to fetch user info')
                const userData = await userRes.json()
                setUser({
                    id: userData.id,
                    username: userData.username,
                    avatar: userData.avatar
                        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                        : null,
                })
            } catch (err) {
                console.error('Error fetching user:', err)
            }
        }

        const fetchGuilds = async () => {
            try {
                const res = await fetch('/api/mutual-servers')
                const data = await res.json()
                if (data.success && data.guilds) {
                    setGuilds(data.guilds)
                    setFilteredGuilds(data.guilds)
                } else {
                    setGuilds([])
                    setFilteredGuilds([])
                }
            } catch {
                setGuilds([])
                setFilteredGuilds([])
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
        fetchGuilds()
    }, [])

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredGuilds(guilds)
        } else {
            const timer = setTimeout(() => {
                const filtered = guilds.filter((g) =>
                    g.name.toLowerCase().includes(search.toLowerCase())
                )
                setFilteredGuilds(filtered)
            }, 150)
            return () => clearTimeout(timer)
        }
    }, [search, guilds])

    const handleNavigation = (guildId: string) => {
        setIsExiting(true)
        setTimeout(() => {
            router.push(`/dashboard/${guildId}`)
        }, 300)
    }

    const handleLogout = () => {
        Cookies.remove('discord_token')
        window.location.href = '/login'
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(88,101,242,0.08),transparent_50%)]" />
                    <FloatingNavbar />

                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
                        {authenticated && user && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
                            >
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt="Profile"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                        draggable={false}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-medium">
                                        {user.username[0]}
                                    </div>
                                )}
                                <span className="text-sm font-medium">
                                    Logged in as {user.username}
                                </span>
                                <motion.button
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: '#ef4444',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="ml-2 px-3 py-1 bg-white/10 hover:bg-red-500 rounded-lg text-xs font-medium transition-all"
                                >
                                    Log out
                                </motion.button>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 w-72 backdrop-blur-md"
                        >
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search servers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-full"
                            />
                        </motion.div>
                    </div>

                    <div
                        ref={containerRef}
                        className="relative z-10 h-[calc(100vh-96px)] overflow-hidden"
                    >
                        <div className="min-h-full px-6 py-24">
                            {loading ? (
                                <div className="flex items-center justify-center py-10 w-full">
                                    <motion.div
                                        className="w-5 h-5 rounded-full border-2 border-white/10 border-t-white/60"
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                </div>
                            ) : filteredGuilds.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                                    layout
                                >
                                    <AnimatePresence mode="popLayout">
                                        {filteredGuilds.map((guild, index) => (
                                            <motion.div
                                                key={guild.id}
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: Math.min(
                                                        index * 0.05,
                                                        0.3
                                                    ),
                                                }}
                                                whileHover={{ y: -4 }}
                                                onMouseEnter={() =>
                                                    setHoveredId(guild.id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredId(null)
                                                }
                                                className="relative"
                                            >
                                                <motion.div
                                                    drag
                                                    dragConstraints={
                                                        containerRef
                                                    }
                                                    dragElastic={0.2}
                                                    dragTransition={{
                                                        bounceStiffness: 300,
                                                        bounceDamping: 10,
                                                    }}
                                                    whileDrag={{
                                                        scale: 1.02,
                                                        cursor: 'grabbing',
                                                        zIndex: 50,
                                                    }}
                                                    onDragStart={() =>
                                                        setIsDragging(true)
                                                    }
                                                    onDragEnd={() =>
                                                        setIsDragging(false)
                                                    }
                                                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-5 backdrop-blur-md shadow-xl hover:shadow-2xl cursor-grab active:cursor-grabbing select-none"
                                                >
                                                    <div className="w-14 h-14 rounded-full bg-white/8 flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                                                        {guild.icon ? (
                                                            <Image
                                                                src={guild.icon}
                                                                alt={guild.name}
                                                                width={56}
                                                                height={56}
                                                                className="rounded-full"
                                                            />
                                                        ) : (
                                                            <span className="text-sm font-semibold text-zinc-400">
                                                                {guild.name.charAt(
                                                                    0
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base font-semibold text-white truncate">
                                                                {guild.name}
                                                            </span>
                                                            {guild.owner && (
                                                                <CrownIcon />
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-zinc-400">
                                                            {guild.memberCount.toLocaleString()}{' '}
                                                            members
                                                        </span>
                                                    </div>
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleNavigation(
                                                                guild.id
                                                            )
                                                        }}
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        animate={{
                                                            opacity:
                                                                hoveredId ===
                                                                guild.id
                                                                    ? 1
                                                                    : 0.5,
                                                            x:
                                                                hoveredId ===
                                                                guild.id
                                                                    ? 0
                                                                    : -6,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                                                        disabled={isDragging}
                                                    >
                                                        <ChevronIcon />
                                                    </motion.button>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center py-10 w-full"
                                >
                                    <p className="text-sm text-zinc-600">
                                        {guilds.length === 0
                                            ? 'No servers found'
                                            : 'No matching servers'}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    )
}
