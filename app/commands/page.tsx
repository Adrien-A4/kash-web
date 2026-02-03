'use client'

import { FloatingNavbar } from '@/components/Navbar'
import { useState, useRef, useEffect } from 'react'
interface Command {
    name: string
    desc: string
    premium?: boolean
}

interface CommandCategory {
    title: string
    commands: Command[]
}
const commandCategories: CommandCategory[] = [
    {
        title: 'Utility',
        commands: [
            { name: 'ping', desc: 'Check bot latency' },
            { name: 'say', desc: 'Make the bot speak your message' },
            { name: 'invite', desc: 'Get a bot invite link' },
            { name: 'setup', desc: 'Show setup instructions' },
            { name: 'translate', desc: 'Translate text' },
        ],
    },
    {
        title: 'Transfers',
        commands: [
            { name: 'sign', desc: 'Sign into a transfer' },
            { name: 'release', desc: 'Release a player' },
            { name: 'freeagent', desc: 'Make player a free agent' },
            { name: 'transfer', desc: 'Submit transfer offer' },
            { name: 'appoint', desc: 'Assign manager' },
            { name: 'disband', desc: 'Disband a team' },
        ],
    },
    {
        title: 'Verification',
        commands: [
            { name: 'verify', desc: 'Verify a user' },
            { name: 'verifypanel', desc: 'Open verification panel' },
        ],
    },
    {
        title: 'AI',
        commands: [
            { name: 'generate-code', desc: 'Generate code using AI' },
            { name: 'gayrate', desc: 'Fun rating command' },
        ],
    },
    {
        title: 'Premium',
        commands: [
            { name: 'upgrade', desc: 'Upgrade to premium', premium: true },
        ],
    },
]
const allCommands: Command[] = commandCategories.flatMap((cat) =>
    cat.commands.map((cmd) => ({
        ...cmd,
        premium: cat.title === 'Premium' ? true : cmd.premium,
    }))
)
const filterTabs = ['All', ...commandCategories.map((c) => c.title)]
const SparkleIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            fill="white"
        />
        <path
            d="M19 14L20 17L23 18L20 19L19 22L18 19L15 18L18 17L19 14Z"
            fill="white"
            opacity="0.6"
        />
        <path
            d="M5 14L5.8 16.2L8 17L5.8 17.8L5 20L4.2 17.8L2 17L4.2 16.2L5 14Z"
            fill="white"
            opacity="0.4"
        />
    </svg>
)

const SearchIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        strokeLinecap="round"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)
const PremiumStarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0c040">
        <path d="M12 2l2.9 6.3 6.6.9-4.8 4.7 1.1 6.6L12 16.5l-5.8 3.1 1.1-6.6L2.5 9.2l6.6-.9z" />
    </svg>
)
const CommandCard = ({ name, desc, premium }: Command) => {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '28px 24px',
                transition:
                    'background 0.25s ease, border-color 0.25s ease, transform 0.2s ease',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                borderColor: hovered
                    ? 'rgba(255,255,255,0.14)'
                    : 'rgba(255,255,255,0.07)',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: '10px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.02em',
                    }}
                >
                    {name}
                </span>
                {premium && <PremiumStarIcon />}
            </div>
            <span
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13.5px',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.4,
                }}
            >
                {desc}
            </span>
            <div style={{ marginTop: '4px' }}>
                <span
                    style={{
                        color: 'rgba(255,255,255,0.35)',
                        fontSize: '12.5px',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    Usage:{' '}
                </span>
                <code
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        padding: '3px 9px',
                        fontSize: '12.5px',
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        letterSpacing: '0.02em',
                    }}
                >
                    /{name}
                </code>
            </div>
        </div>
    )
}
export default function KashCommandsPage() {
    const [activeTab, setActiveTab] = useState('All')
    const [search, setSearch] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const getFiltered = (): Command[] => {
        let base =
            activeTab === 'All'
                ? allCommands
                : (commandCategories.find((c) => c.title === activeTab)
                      ?.commands ?? [])

        if (search.trim()) {
            const q = search.toLowerCase()
            base = base.filter(
                (cmd) =>
                    cmd.name.toLowerCase().includes(q) ||
                    cmd.desc.toLowerCase().includes(q)
            )
        }
        return base
    }

    const filtered = getFiltered()

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                rel="stylesheet"
            />
            <FloatingNavbar />
            <div
                style={{
                    minHeight: '100vh',
                    background: '#0a0a0a',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                    paddingTop: '100px',
                    paddingBottom: '80px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '-120px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '700px',
                        height: '400px',
                        background:
                            'radial-gradient(ellipse, rgba(255,255,255,0.035) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        maxWidth: '1100px',
                        margin: '0 auto',
                        padding: '0 24px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1
                            style={{
                                fontSize: 'clamp(40px, 7vw, 72px)',
                                fontWeight: 700,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.1,
                                margin: 0,
                            }}
                        >
                            <span style={{ color: '#ffffff' }}>Commands </span>
                            <span
                                style={{
                                    color: 'rgba(255,255,255,0.35)',
                                }}
                            >
                                Directory
                            </span>
                        </h1>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            marginBottom: '32px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '10px 18px',
                                width: '100%',
                                maxWidth: '420px',
                                transition: 'border-color 0.2s',
                            }}
                        >
                            <SearchIcon />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search commands..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontFamily: "'Inter', sans-serif",
                                    flex: 1,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(240,192,64,0.08)',
                                border: '1px solid rgba(240,192,64,0.2)',
                                borderRadius: '12px',
                                padding: '10px 18px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) =>
                                ((
                                    e.currentTarget as HTMLElement
                                ).style.background = 'rgba(240,192,64,0.14)')
                            }
                            onMouseLeave={(e) =>
                                ((
                                    e.currentTarget as HTMLElement
                                ).style.background = 'rgba(240,192,64,0.08)')
                            }
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 2l2.9 6.3 6.6.9-4.8 4.7 1.1 6.6L12 16.5l-5.8 3.1 1.1-6.6L2.5 9.2l6.6-.9z"
                                    fill="#f0c040"
                                />
                            </svg>
                            <span
                                style={{
                                    fontSize: '14px',
                                    color: '#f0c040',
                                    fontWeight: 500,
                                }}
                            >
                                Premium
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            flexWrap: 'wrap',
                            marginBottom: '36px',
                        }}
                    >
                        {filterTabs.map((tab) => {
                            const active = tab === activeTab
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        background: active
                                            ? 'rgba(255,255,255,0.1)'
                                            : 'transparent',
                                        border: '1px solid',
                                        borderColor: active
                                            ? 'rgba(255,255,255,0.2)'
                                            : 'rgba(255,255,255,0.1)',
                                        borderRadius: '999px',
                                        color: active
                                            ? '#fff'
                                            : 'rgba(255,255,255,0.5)',
                                        fontSize: '13.5px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: active ? 600 : 400,
                                        padding: '8px 18px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        outline: 'none',
                                    }}
                                >
                                    {tab}
                                </button>
                            )
                        })}
                    </div>
                    {filtered.length > 0 ? (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '16px',
                            }}
                        >
                            {filtered.map((cmd, i) => (
                                <div
                                    key={cmd.name}
                                    style={{
                                        animation: `fadeUp 0.35s ease both`,
                                        animationDelay: `${i * 0.04}s`,
                                    }}
                                >
                                    <CommandCard {...cmd} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '80px 0',
                                color: 'rgba(255,255,255,0.25)',
                                fontSize: '15px',
                            }}
                        >
                            No commands found matching "{search}"
                        </div>
                    )}
                </div>
                <style>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          input::placeholder {
            color: rgba(255,255,255,0.3);
          }
        `}</style>
            </div>
        </>
    )
}
