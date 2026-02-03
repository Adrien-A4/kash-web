import Image from 'next/image'
import Link from 'next/link'

export function FloatingNavbar() {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="flex items-center gap-4 px-5 py-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-lg">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/kash.png"
                        alt="Kash"
                        width={30}
                        height={30}
                        className="rounded-full"
                        priority
                        draggable={false}
                    />
                </Link>
                <span className="h-5 w-px bg-white/10" />
                <div className="flex items-center gap-5 text-sm text-white/80">
                    <Link
                        href="/commands"
                        className="hover:text-white transition"
                    >
                        Commands
                    </Link>
                    <Link href="/docs" className="hover:text-white transition">
                        Docs
                    </Link>
                    <Link
                        href="/premium"
                        className="hover:text-white transition"
                    >
                        Premium
                    </Link>
                    <Link
                        href="/api/invite"
                        target="_blank"
                        className="hover:text-white transition"
                    >
                        <Image
                            src="/discord.png"
                            alt="Discord"
                            width={25}
                            height={25}
                            className="rounded-full"
                            priority
                        />
                    </Link>
                </div>
            </nav>
        </div>
    )
}
