'use client'

import { FloatingNavbar } from '@/components/Navbar'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DocSection {
    id: string
    title: string
    content: string
    subsections?: { id: string; title: string; content: string }[]
}

const docs: DocSection[] = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        content:
            'Kash is a precision-built Discord bot designed to streamline your server management. This guide will walk you through everything you need to know to get up and running quickly.',
        subsections: [
            {
                id: 'installation',
                title: 'Installation',
                content:
                    'To add Kash to your Discord server, click the "Add to Discord" button on our homepage. You will be redirected to Discord\'s authorization page. Select the server you want to add Kash to, review the permissions, and click "Authorize". Kash will automatically join your server and begin listening for commands.',
            },
            {
                id: 'initial-setup',
                title: 'Initial Setup',
                content:
                    'Once Kash has joined your server, run /setup to configure the bot for your needs. This will guide you through setting up channels, roles, and default preferences. You can revisit this at any time by running /setup again.',
            },
        ],
    },
    {
        id: 'commands',
        title: 'Commands',
        content:
            'Kash offers a wide range of commands across multiple categories. Each command is designed to be intuitive and easy to use. All commands are triggered using the / prefix.',
        subsections: [
            {
                id: 'utility-commands',
                title: 'Utility Commands',
                content:
                    'Utility commands handle general server tasks. Use /ping to check bot latency, /say to make Kash speak a message, /invite to generate an invite link, and /translate to translate text into another language. These commands are available to all users by default.',
            },
            {
                id: 'transfer-commands',
                title: 'Transfer Commands',
                content:
                    'Transfer commands manage player movements within your server. Use /sign to initiate a transfer, /release to free a player, /freeagent to set a player as a free agent, /transfer to submit an offer, /appoint to assign a manager role, and /disband to dissolve a team.',
            },
            {
                id: 'verification-commands',
                title: 'Verification Commands',
                content:
                    'Verification commands help you manage user identity within your server. /verify allows you to verify a specific user, while /verifypanel opens an interactive panel for managing the verification process.',
            },
        ],
    },
    {
        id: 'verification',
        title: 'Verification',
        content:
            'The verification system in Kash provides a secure way to authenticate users in your server. Once configured, users can verify their identity through an interactive panel.',
        subsections: [
            {
                id: 'setting-up-verification',
                title: 'Setting Up Verification',
                content:
                    'To enable verification, run /setup and follow the verification configuration steps. You will need to designate a verification channel and optionally assign a role that users receive upon successful verification.',
            },
            {
                id: 'managing-verified-users',
                title: 'Managing Verified Users',
                content:
                    'Once verification is active, use /verifypanel to view and manage all verified users. From the panel you can revoke verification, view user details, and re-verify users if needed.',
            },
        ],
    },
    {
        id: 'transfers',
        title: 'Transfers',
        content:
            'The transfer system allows you to simulate or manage player movements within your server ecosystem. It supports the full lifecycle from signing to disbanding.',
        subsections: [
            {
                id: 'how-transfers-work',
                title: 'How Transfers Work',
                content:
                    'Transfers follow a structured flow: a player is signed to a team, can be released or set as a free agent, and managers can submit transfer offers. All actions are logged and can be reviewed at any time.',
            },
            {
                id: 'team-management',
                title: 'Team Management',
                content:
                    'Use /appoint to assign manager roles to users, giving them the ability to submit and accept transfer offers. Use /disband to fully dissolve a team, releasing all associated players automatically.',
            },
        ],
    },
    {
        id: 'premium',
        title: 'Premium',
        content:
            'Kash Premium unlocks the full potential of your bot experience. Upgrade to remove cooldowns, unlock exclusive features, and get priority support.',
        subsections: [
            {
                id: 'premium-features',
                title: 'Premium Features',
                content:
                    "Premium includes: no cooldowns or rate limits, a special premium badge next to your server name, the ability to customize your embed color, the ability to change your bot's avatar and bio per server, and access to priority support.",
            },
            {
                id: 'upgrading',
                title: 'Upgrading',
                content:
                    'To upgrade, run /upgrade or visit the Premium page on our website. Premium is available as a monthly subscription or a one-time lifetime purchase. Once activated, all premium features are immediately available across your servers.',
            },
        ],
    },
    {
        id: 'faq',
        title: 'FAQ',
        content: 'Answers to the most common questions about Kash.',
        subsections: [
            {
                id: 'permissions',
                title: 'What permissions does Kash need?',
                content:
                    "Kash requires Administrator permissions to function fully. This includes the ability to manage roles, send messages, manage channels, and kick or ban users. If certain features are not working, check that Kash's role is positioned high enough in your role hierarchy.",
            },
            {
                id: 'multiple-servers',
                title: 'Can I use Kash in multiple servers?',
                content:
                    'Yes. Kash can be added to as many servers as you like. Each server has its own independent configuration. Premium features are tied to your account and apply across all servers.',
            },
        ],
    },
]

const allSections = docs.flatMap((doc) => [
    { id: doc.id, title: doc.title, parentId: null },
    ...(doc.subsections?.map((sub) => ({
        id: sub.id,
        title: sub.title,
        parentId: doc.id,
    })) ?? []),
])

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('getting-started')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [search, setSearch] = useState('')
    const contentRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const filteredDocs = docs
        .map((doc) => ({
            ...doc,
            subsections: doc.subsections?.filter(
                (sub) =>
                    sub.title.toLowerCase().includes(search.toLowerCase()) ||
                    sub.content.toLowerCase().includes(search.toLowerCase())
            ),
            match:
                doc.title.toLowerCase().includes(search.toLowerCase()) ||
                doc.content.toLowerCase().includes(search.toLowerCase()),
        }))
        .filter((doc) => doc.match || (doc.subsections?.length ?? 0) > 0)

    useEffect(() => {
        if (search) return
        const el = contentRefs.current[activeSection]
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [activeSection, search])

    const highlightText = (text: string) => {
        if (!search.trim()) return text
        const parts = text.split(
            new RegExp(
                `(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
                'gi'
            )
        )
        return parts.map((part, i) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <mark
                    key={i}
                    style={{
                        background: 'rgba(88,101,242,0.25)',
                        color: '#fff',
                        borderRadius: '3px',
                        padding: '0 2px',
                    }}
                >
                    {part}
                </mark>
            ) : (
                part
            )
        )
    }

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
                    display: 'flex',
                    paddingTop: '72px',
                }}
            >
                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: sidebarOpen ? '260px' : '0px',
                        opacity: sidebarOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.02)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        position: 'sticky',
                        top: '72px',
                        height: 'calc(100vh - 72px)',
                        flexShrink: 0,
                    }}
                >
                    <div style={{ padding: '24px 20px', width: '260px' }}>
                        {/* Search */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                padding: '10px 14px',
                                marginBottom: '24px',
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#666"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search docs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontFamily: "'Inter', sans-serif",
                                    flex: 1,
                                }}
                            />
                        </div>

                        {/* Nav */}
                        <nav
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                            }}
                        >
                            {docs.map((doc) => (
                                <div key={doc.id}>
                                    <button
                                        onClick={() => setActiveSection(doc.id)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            background:
                                                activeSection === doc.id
                                                    ? 'rgba(88,101,242,0.12)'
                                                    : 'transparent',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '9px 12px',
                                            color:
                                                activeSection === doc.id
                                                    ? '#fff'
                                                    : 'rgba(255,255,255,0.5)',
                                            fontSize: '13.5px',
                                            fontWeight:
                                                activeSection === doc.id
                                                    ? 600
                                                    : 500,
                                            fontFamily: "'Inter', sans-serif",
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <motion.span
                                            animate={{
                                                width:
                                                    activeSection === doc.id ||
                                                    doc.subsections?.some(
                                                        (s) =>
                                                            s.id ===
                                                            activeSection
                                                    )
                                                        ? '3px'
                                                        : '0px',
                                            }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                display: 'block',
                                                height: '14px',
                                                background: '#5865F2',
                                                borderRadius: '2px',
                                                flexShrink: 0,
                                            }}
                                        />
                                        {doc.title}
                                    </button>
                                    <AnimatePresence>
                                        {(activeSection === doc.id ||
                                            doc.subsections?.some(
                                                (s) => s.id === activeSection
                                            )) && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{
                                                    duration: 0.25,
                                                    ease: 'easeInOut',
                                                }}
                                                style={{
                                                    overflow: 'hidden',
                                                    paddingLeft: '23px',
                                                }}
                                            >
                                                {doc.subsections?.map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() =>
                                                            setActiveSection(
                                                                sub.id
                                                            )
                                                        }
                                                        style={{
                                                            width: '100%',
                                                            textAlign: 'left',
                                                            background:
                                                                activeSection ===
                                                                sub.id
                                                                    ? 'rgba(88,101,242,0.08)'
                                                                    : 'transparent',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            padding: '6px 10px',
                                                            color:
                                                                activeSection ===
                                                                sub.id
                                                                    ? 'rgba(255,255,255,0.9)'
                                                                    : 'rgba(255,255,255,0.35)',
                                                            fontSize: '12.5px',
                                                            fontFamily:
                                                                "'Inter', sans-serif",
                                                            fontWeight:
                                                                activeSection ===
                                                                sub.id
                                                                    ? 500
                                                                    : 400,
                                                            cursor: 'pointer',
                                                            transition:
                                                                'all 0.15s ease',
                                                            marginTop: '2px',
                                                            display: 'block',
                                                        }}
                                                    >
                                                        {sub.title}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>
                    </div>
                </motion.aside>

                {/* Toggle button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: sidebarOpen ? '248px' : '8px',
                        transform: 'translateY(-50%)',
                        zIndex: 50,
                        background: 'rgba(20,20,20,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        padding: '6px 5px',
                        cursor: 'pointer',
                        transition: 'left 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <motion.svg
                        animate={{ rotate: sidebarOpen ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </motion.svg>
                </button>

                {/* Content */}
                <main
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '60px 40px 80px',
                        maxWidth: '780px',
                    }}
                >
                    {(search ? filteredDocs : docs).map((doc) => (
                        <div
                            key={doc.id}
                            ref={(el) => {
                                contentRefs.current[doc.id] = el
                            }}
                            style={{ marginBottom: '56px' }}
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    color: '#fff',
                                    marginBottom: '12px',
                                    paddingBottom: '12px',
                                    borderBottom:
                                        '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <img
                                    src="/kash.png"
                                    alt="Kash Logo"
                                    draggable={false}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                    }}
                                />
                                {highlightText(doc.title)}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.05 }}
                                style={{
                                    fontSize: '14.5px',
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 1.7,
                                    marginBottom: '32px',
                                }}
                            >
                                {highlightText(doc.content)}
                            </motion.p>

                            {doc.subsections?.map((sub, i) => (
                                <div
                                    key={sub.id}
                                    ref={(el) => {
                                        contentRefs.current[sub.id] = el
                                    }}
                                    style={{ marginBottom: '32px' }}
                                >
                                    <motion.h3
                                        initial={{ opacity: 0, y: 8 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.35,
                                            delay: i * 0.06,
                                        }}
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            color: 'rgba(255,255,255,0.9)',
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: '3px',
                                                height: '18px',
                                                background: '#5865F2',
                                                borderRadius: '2px',
                                            }}
                                        />
                                        {highlightText(sub.title)}
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0, y: 6 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.35,
                                            delay: i * 0.06 + 0.08,
                                        }}
                                        style={{
                                            fontSize: '14px',
                                            color: 'rgba(255,255,255,0.42)',
                                            lineHeight: 1.8,
                                            paddingLeft: '13px',
                                        }}
                                    >
                                        {highlightText(sub.content)}
                                    </motion.p>
                                </div>
                            ))}
                        </div>
                    ))}

                    {search && filteredDocs.length === 0 && (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '80px 0',
                                color: 'rgba(255,255,255,0.25)',
                                fontSize: '15px',
                            }}
                        >
                            No results found for "{search}"
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                input::placeholder { color: rgba(255,255,255,0.3); }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }
            `}</style>
        </>
    )
}
