'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoadingPage() {
    const router = useRouter()
    const [shouldFadeOut, setShouldFadeOut] = useState(false)
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        const fadeTimer = setTimeout(() => setShouldFadeOut(true), 2000)
        const redirectTimer = setTimeout(() => router.push('/home'), 2800)

        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(redirectTimer)
        }
    }, [router])

    return (
        <motion.div
            className="w-screen h-screen flex flex-col justify-center items-center gap-6 bg-[#121212] overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: shouldFadeOut ? 0 : 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="rounded-full w-52 h-52 relative mb-13 overflow-hidden"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 20,
                }}
            >
                {!imageError ? (
                    <Image
                        src="/kash.png"
                        alt="Logo"
                        fill
                        sizes="208px"
                        className="object-cover"
                        draggable={false}
                        priority
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">K</span>
                    </div>
                )}
            </motion.div>

            {imageError && (
                <p className="text-yellow-400 text-sm -mt-4">
                    Could not load image
                </p>
            )}

            <motion.svg
                className="w-20 h-20"
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
            >
                <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="white"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="226.2"
                    strokeDashoffset="56.55"
                    strokeLinecap="round"
                />
            </motion.svg>

            <motion.p
                className="text-white text-lg font-medium -mt-4"
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                Loading...
            </motion.p>
        </motion.div>
    )
}
