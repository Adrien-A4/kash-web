import Image from 'next/image'
import { cn } from '@/lib/utils'

type SpinnerProps = {
    size?: number
    className?: string
}

function Spinner({ size = 9, className }: SpinnerProps) {
    return (
        <Image
            src="/loader.png"
            alt="Loading"
            role="status"
            aria-label="Loading"
            width={size * 2}
            height={size * 2}
            className={cn(`size-${size} animate-spin`, className)}
            priority
        />
    )
}

export { Spinner }
