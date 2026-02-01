'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const commandGroups = [
    {
        title: 'Utility',
        items: ['ping', 'say', 'invite', 'setup', 'translate'],
    },
    {
        title: 'Transfers',
        items: [
            'sign',
            'release',
            'freeagent',
            'transfer',
            'appoint',
            'disband',
        ],
    },
    {
        title: 'Verification',
        items: ['verify', 'verifypanel'],
    },
    {
        title: 'AI',
        items: ['generate-code', 'translate', 'gayrate'],
    },
    {
        title: 'Premium',
        items: ['generate', 'upgrade'],
    },
]

export default function CommandsPage() {
    return (
        <main className="min-h-screen bg-linear-to-b from-black via-zinc-950 to-zinc-900 px-6 py-24 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-6xl"
            >
                <h1 className="text-4xl font-bold tracking-tight">Commands</h1>
                <p className="mt-2 text-zinc-400">
                    Structured. Intentional. Built for power users.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {commandGroups.map((group, i) => (
                        <motion.div
                            key={group.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="rounded-3xl border-white/10 bg-white/5 p-6 backdrop-blur">
                                <h3 className="text-lg font-semibold">
                                    {group.title}
                                </h3>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {group.items.map((cmd) => (
                                        <Badge
                                            key={cmd}
                                            variant="secondary"
                                            className="rounded-xl bg-white/10 text-white"
                                        >
                                            /{cmd}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </main>
    )
}
