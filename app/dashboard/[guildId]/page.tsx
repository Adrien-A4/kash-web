'use client'

import { useState, useEffect, use } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingNavbar } from '@/components/Navbar'
import Image from 'next/image'
import Cookies from 'js-cookie'

interface Guild {
    id: string
    name: string
    icon: string | null
    memberCount: number
    permissions: number
    premium: boolean
}

interface User {
    id: string
    username: string
    avatar?: string | null
}

const MenuIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)

const ChevronLeftIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const ChevronRightIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

const CheckIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10B981"
        strokeWidth="2.5"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const CrossIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#EF4444"
        strokeWidth="2.5"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const ManageIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M12 15l8.385-8.415a2.1 2.1 0 0 0-2.97-2.97L9 12" />
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
)

const AppearanceIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

const CommandsIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
)

export default function DashboardPage() {
    const params = useParams()
    const guildId = params?.guildId

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [guild, setGuild] = useState<Guild | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasPermission, setHasPermission] = useState(false)
    const [activeTab, setActiveTab] = useState('commands')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [bio, setBio] = useState('')
    const [banner, setBanner] = useState('')
    const [lastSaved, setLastSaved] = useState<number | null>(null)
    const [saving, setSaving] = useState<string | null>(null)

    useEffect(() => {
        const token = Cookies.get('discord_token')

        if (!token) {
            setError('Not authenticated')
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                const userRes = await fetch(
                    'https://discord.com/api/users/@me',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )

                if (!userRes.ok) throw new Error('Failed to fetch user')
                const userData = await userRes.json()
                setUser({
                    id: userData.id,
                    username: userData.username,
                    avatar: userData.avatar
                        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                        : null,
                })

                const guildRes = await fetch(`/api/guilds/${guildId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (!guildRes.ok) throw new Error('Failed to fetch guild data')
                const guildData = await guildRes.json()

                if (guildData.success) {
                    setGuild(guildData.guild)

                    const permissions = guildData.guild.permissions
                    const hasManageGuild = (permissions & 0x20) !== 0
                    const hasAdmin = (permissions & 0x8) !== 0

                    setHasPermission(hasManageGuild || hasAdmin)
                } else {
                    setError(guildData.error || 'Failed to load guild')
                }

                // Fetch current appearance settings
                try {
                    const appearanceRes = await fetch(
                        `/api/guilds/${guildId}/appearance`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )
                    if (appearanceRes.ok) {
                        const appearanceData = await appearanceRes.json()
                        if (appearanceData.avatar)
                            setAvatarUrl(appearanceData.avatar)
                        if (appearanceData.bio) setBio(appearanceData.bio)
                        if (appearanceData.banner)
                            setBanner(appearanceData.banner)
                    }
                } catch {
                    // Ignore appearance fetch errors
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [guildId])

    const handleAppearanceSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!guild?.premium) {
            setError('Premium feature only')
            return
        }

        // Check rate limit (5 minutes = 300000 ms)
        if (lastSaved && Date.now() - lastSaved < 300000) {
            const remaining = Math.ceil(
                (300000 - (Date.now() - lastSaved)) / 1000
            )
            setError(`Please wait ${remaining} seconds before changing again`)
            return
        }

        setSaving('all')
        try {
            const token = Cookies.get('discord_token')
            const res = await fetch(`/api/guilds/${guildId}/appearance`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    avatar: avatarUrl || null,
                    bio: bio || null,
                    banner: banner || null,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update appearance')
            }

            setLastSaved(Date.now())
            // Clear inputs on success
            setAvatarUrl('')
            setBanner('')
        } catch (err: any) {
            setError(err.message || 'Failed to update appearance')
        } finally {
            setSaving(null)
        }
    }

    const handleResetAppearance = async () => {
        if (!guild?.premium) {
            setError('Premium feature only')
            return
        }

        if (
            !confirm(
                'Are you sure you want to reset all appearance settings to default?'
            )
        ) {
            return
        }

        setSaving('reset')
        try {
            const token = Cookies.get('discord_token')
            const res = await fetch(`/api/guilds/${guildId}/appearance`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    avatar: '',
                    bio: '',
                    banner: '',
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to reset appearance')
            }

            setLastSaved(Date.now())
            setAvatarUrl('')
            setBio('')
            setBanner('')
        } catch (err: any) {
            setError(err.message || 'Failed to reset appearance')
        } finally {
            setSaving(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (!hasPermission) {
        return (
            <div className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center">
                <div className="text-center max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <CrossIcon />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-zinc-400 mb-6">
                        You need{' '}
                        <span className="text-white font-medium">
                            Manage Server
                        </span>{' '}
                        permission to access this dashboard.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen bg-linear-to-br from-black via-zinc-950 to-zinc-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,255,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(88,101,242,0.08),transparent_50%)]" />
            <FloatingNavbar />

            <div className="flex relative z-10 pt-16">
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ duration: 0.3 }}
                            className="w-64 border-r border-white/10 bg-black/30 backdrop-blur-xl"
                        >
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {guild?.icon ? (
                                            <Image
                                                src={guild.icon}
                                                alt={guild.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-zinc-400">
                                                {guild?.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold truncate">
                                            {guild?.name}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div
                                                className={`w-2 h-2 rounded-full ${guild?.premium ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            />
                                            <span className="text-xs text-zinc-400">
                                                {guild?.premium
                                                    ? 'Premium'
                                                    : 'Free'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab('commands')}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeTab === 'commands' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <CommandsIcon />
                                        Commands
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveTab('appearance')
                                        }
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeTab === 'appearance' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <AppearanceIcon />
                                        Appearance
                                    </button>
                                </nav>
                            </div>

                            {user && (
                                <div className="p-4 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                        {user.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.username}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                <span className="text-sm font-medium">
                                                    {user.username[0]}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {user.username}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Admin
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.aside>
                    )}
                </AnimatePresence>

                <main className="flex-1">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                {sidebarOpen ? (
                                    <ChevronLeftIcon />
                                ) : (
                                    <MenuIcon />
                                )}
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="text-sm text-zinc-400">
                                    Manage Server permission:{' '}
                                    <span className="text-green-400 font-medium">
                                        ✓ Granted
                                    </span>
                                </div>
                                {guild?.premium ? (
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/30">
                                        Premium
                                    </span>
                                ) : (
                                    <button className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors">
                                        Upgrade
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            {activeTab === 'commands' ? (
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                                    <h2 className="text-2xl font-bold mb-2">
                                        Commands
                                    </h2>
                                    <p className="text-zinc-400 mb-8">
                                        Configure and customize bot commands
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            {
                                                name: 'Moderation',
                                                enabled: true,
                                                premium: false,
                                            },
                                            {
                                                name: 'Fun',
                                                enabled: true,
                                                premium: false,
                                            },
                                            {
                                                name: 'Economy',
                                                enabled: guild?.premium,
                                                premium: true,
                                            },
                                            {
                                                name: 'Custom Commands',
                                                enabled: guild?.premium,
                                                premium: true,
                                            },
                                            {
                                                name: 'Music',
                                                enabled: false,
                                                premium: true,
                                            },
                                            {
                                                name: 'Leveling',
                                                enabled: guild?.premium,
                                                premium: true,
                                            },
                                        ].map((cmd) => (
                                            <div
                                                key={cmd.name}
                                                className="p-4 rounded-xl border border-white/10 bg-white/2"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">
                                                        {cmd.name}
                                                    </span>
                                                    {cmd.enabled ? (
                                                        <CheckIcon />
                                                    ) : (
                                                        <CrossIcon />
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`text-xs ${cmd.premium ? 'text-yellow-400' : 'text-zinc-500'}`}
                                                    >
                                                        {cmd.premium
                                                            ? 'Premium'
                                                            : 'Free'}
                                                    </span>
                                                    <button
                                                        disabled={!cmd.enabled}
                                                        className={`text-xs px-2 py-1 rounded ${cmd.enabled ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 text-zinc-600 cursor-not-allowed'}`}
                                                    >
                                                        Configure
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                                    <h2 className="text-2xl font-bold mb-2">
                                        Appearance
                                    </h2>
                                    <p className="text-zinc-400 mb-8">
                                        Customize the bot's appearance for your
                                        server
                                        {!guild?.premium && (
                                            <span className="text-yellow-400 ml-2">
                                                (Premium only)
                                            </span>
                                        )}
                                    </p>

                                    <form
                                        onSubmit={handleAppearanceSubmit}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <span>Bot Avatar</span>
                                            </h3>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/avatar.png"
                                                value={avatarUrl}
                                                onChange={(e) =>
                                                    setAvatarUrl(e.target.value)
                                                }
                                                disabled={!guild?.premium}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <span>Bot Bio</span>
                                            </h3>
                                            <textarea
                                                placeholder="Custom bio for your server..."
                                                value={bio}
                                                onChange={(e) =>
                                                    setBio(e.target.value)
                                                }
                                                disabled={!guild?.premium}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed h-32"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <span>Bot Banner</span>
                                            </h3>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/banner.png"
                                                value={banner}
                                                onChange={(e) =>
                                                    setBanner(e.target.value)
                                                }
                                                disabled={!guild?.premium}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex gap-3">
                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            !guild?.premium ||
                                                            saving === 'all'
                                                        }
                                                        className="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {saving === 'all'
                                                            ? 'Saving...'
                                                            : 'Save Changes'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleResetAppearance
                                                        }
                                                        disabled={
                                                            !guild?.premium ||
                                                            saving === 'reset'
                                                        }
                                                        className="px-6 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {saving === 'reset'
                                                            ? 'Resetting...'
                                                            : 'Reset'}
                                                    </button>
                                                </div>
                                                {lastSaved && (
                                                    <span className="text-sm text-zinc-400">
                                                        Last saved:{' '}
                                                        {new Date(
                                                            lastSaved
                                                        ).toLocaleTimeString()}
                                                    </span>
                                                )}
                                            </div>
                                            {!guild?.premium && (
                                                <p className="text-sm text-zinc-500 mt-4">
                                                    Upgrade to premium to
                                                    customize the bot's
                                                    appearance for your server.
                                                </p>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
