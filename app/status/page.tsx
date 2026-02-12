'use client'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import Image from 'next/image'

const parseUptime = (uptime: string): number => {
    const [hours, minutes, seconds] = uptime.split(':').map(Number)
    return hours * 3600 + minutes * 60 + seconds
}

const formatUptime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const Button = ({
    size = 'md',
    variant = 'default',
    onClick,
    className = '',
    children,
    disabled = false,
}: {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'outline'
    onClick: () => void
    className?: string
    children: React.ReactNode
    disabled?: boolean
}) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    const variantClasses = {
        default: 'bg-[#5865F2] text-white hover:bg-[#4752C4]',
        outline: 'border border-white/20 text-white/90 hover:bg-white/10',
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        rounded-lg font-medium transition-all duration-200 backdrop-blur-sm
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {children}
        </button>
    )
}

const Status = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<any>(null)
    const [currentUptime, setCurrentUptime] = useState<number | null>(null)

    const fetchStatus = async () => {
        setLoading(true)
        setError(null)
        try {
            let res
            try {
                res = await fetch('/api/status', {
                    method: 'GET',
                    cache: 'no-cache',
                })
            } catch (apiError) {
                res = await fetch('http://46.247.108.191:30276/api/status', {
                    method: 'GET',
                    cache: 'no-cache',
                })
            }

            if (!res.ok) {
                throw new Error(`Status fetch failed: ${res.status}`)
            }

            const json = await res.json()
            setData(json)
            if (json?.bot?.uptime) {
                setCurrentUptime(parseUptime(json.bot.uptime))
            }
        } catch (err: any) {
            setError(
                'Failed to connect to status server. Please ensure the bot is running.'
            )
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStatus()
        const statusId = setInterval(fetchStatus, 30000)
        return () => clearInterval(statusId)
    }, [])

    useEffect(() => {
        if (currentUptime === null) return

        const uptimeId = setInterval(() => {
            setCurrentUptime((prev) => (prev !== null ? prev + 1 : null))
        }, 1000)

        return () => clearInterval(uptimeId)
    }, [currentUptime])

    const [showRaw, setShowRaw] = useState(false)

    const uptimePercent = useMemo(() => {
        if (!data) return null
        return (
            data?.uptime_pct ??
            data?.uptime_percent ??
            (typeof data?.uptime === 'number'
                ? Math.min(100, Math.round(data.uptime))
                : null)
        )
    }, [data])

    const statusColor =
        data?.status === 'online'
            ? '#10B981'
            : data?.status === 'offline'
              ? '#EF4444'
              : data?.status === 'maintenance'
                ? '#F59E0B'
                : '#6B7280'

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-linear-to-br from-black via-zinc-950 to-zinc-900 text-white"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,255,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(88,101,242,0.08),transparent_50%)]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/kash.png"
                                        alt="Kash"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
                                    Kash Status
                                </h1>
                                <p className="text-zinc-400 text-sm">
                                    Live monitoring and system metrics
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="sm"
                                onClick={fetchStatus}
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                ) : (
                                    <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                )}
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowRaw((s) => !s)}
                            >
                                {showRaw ? 'Hide Raw' : 'Show Raw'}
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6 backdrop-blur-xl">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">
                                        Bot Overview
                                    </h2>
                                    <p className="text-zinc-400 text-sm">
                                        Real-time performance metrics
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm text-zinc-400">
                                        Status:
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1 rounded-full font-medium text-sm flex items-center gap-2"
                                        style={{
                                            backgroundColor: `${statusColor}20`,
                                            color: statusColor,
                                        }}
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: statusColor,
                                            }}
                                        />
                                        {data?.status || 'unknown'}
                                    </motion.div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    {
                                        title: 'Bot Tag',
                                        value: data?.bot?.tag ?? '—',
                                        icon: '🏷️',
                                    },
                                    {
                                        title: 'Bot ID',
                                        value: data?.bot?.id ?? '—',
                                        icon: '🆔',
                                    },
                                    {
                                        title: 'Version',
                                        value: data?.version
                                            ? `v${data.version}`
                                            : '—',
                                        icon: '📦',
                                    },
                                    {
                                        title: 'Guilds',
                                        value: data?.bot?.guilds ?? '—',
                                        icon: '🏰',
                                    },
                                    {
                                        title: 'Users',
                                        value: data?.bot?.users ?? '—',
                                        icon: '👥',
                                    },
                                    {
                                        title: 'Latency',
                                        value: data?.bot?.ping
                                            ? `${data.bot.ping}ms`
                                            : '—',
                                        icon: '⚡',
                                    },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                        }}
                                        whileHover={{ y: -2 }}
                                        className="p-4 rounded-xl border border-white/10 bg-white/2 backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="text-lg">
                                                {stat.icon}
                                            </div>
                                            <div className="text-sm font-medium text-zinc-400">
                                                {stat.title}
                                            </div>
                                        </div>
                                        <div className="text-xl font-semibold">
                                            {stat.value}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6 backdrop-blur-xl h-full">
                            <h3 className="text-lg font-semibold mb-4">
                                Uptime
                            </h3>
                            <div className="flex flex-col items-center justify-center h-48">
                                {uptimePercent != null ? (
                                    <>
                                        <div className="relative w-40 h-40">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <RadialBarChart
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="70%"
                                                    outerRadius="100%"
                                                    data={[
                                                        {
                                                            name: 'uptime',
                                                            value: uptimePercent,
                                                        },
                                                    ]}
                                                >
                                                    <RadialBar
                                                        dataKey="value"
                                                        fill="url(#gradient)"
                                                        cornerRadius={10}
                                                        background={{
                                                            fill: 'rgba(255,255,255,0.05)',
                                                        }}
                                                    />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <div className="text-3xl font-bold">
                                                    {uptimePercent}%
                                                </div>
                                                <div className="text-sm text-zinc-400 mt-1">
                                                    uptime
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <div className="text-sm text-zinc-400">
                                                Current uptime
                                            </div>
                                            <div className="text-lg font-mono">
                                                {currentUptime !== null
                                                    ? formatUptime(
                                                          currentUptime
                                                      )
                                                    : '—'}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-zinc-400">
                                        Uptime data unavailable
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold">
                                System Information
                            </h3>
                            <p className="text-zinc-400 text-sm">
                                Detailed system metrics and last update
                            </p>
                        </div>
                        <div className="text-sm text-zinc-400">
                            Auto-refreshes every 30 seconds
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: 'Last Updated',
                                value: data?.timestamp
                                    ? new Date(data.timestamp).toLocaleString()
                                    : '—',
                                icon: '🕒',
                            },
                            {
                                title: 'Memory Usage',
                                value: data?.memory
                                    ? `${Math.round(data.memory.used / 1024 / 1024)}MB`
                                    : '—',
                                icon: '💾',
                            },
                            {
                                title: 'CPU Load',
                                value: data?.cpu ? `${data.cpu}%` : '—',
                                icon: '⚙️',
                            },
                            {
                                title: 'API Version',
                                value: data?.api_version || '—',
                                icon: '🌐',
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.3 + index * 0.05,
                                }}
                                whileHover={{ scale: 1.02 }}
                                className="p-4 rounded-xl border border-white/10 bg-white/2 backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-xl">{stat.icon}</div>
                                    <div className="text-sm font-medium text-zinc-400">
                                        {stat.title}
                                    </div>
                                </div>
                                <div className="text-lg font-semibold">
                                    {stat.value}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {showRaw && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 pt-6 border-t border-white/10"
                            >
                                <h4 className="text-sm font-semibold mb-3 text-zinc-400">
                                    Raw Data
                                </h4>
                                <div className="relative">
                                    <pre className="text-sm bg-black/30 p-4 rounded-lg border border-white/10 overflow-auto max-h-60 font-mono text-zinc-300">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute top-2 right-2"
                                    >
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    JSON.stringify(
                                                        data,
                                                        null,
                                                        2
                                                    )
                                                )
                                            }
                                        >
                                            Copy
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <div className="text-red-300">{error}</div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="ml-auto"
                            >
                                <Button
                                    size="sm"
                                    onClick={fetchStatus}
                                    variant="outline"
                                >
                                    Retry Connection
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>

            <svg width="0" height="0">
                <defs>
                    <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>
        </motion.main>
    )
}

export default Status
