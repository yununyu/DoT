import React, {useEffect, useRef} from 'react'

export default function useInfinite(callback: () => void) {
    const target = useRef<HTMLDivElement | null>(null)

    const observer = new IntersectionObserver((entries, _observer) => {
        if (entries[0].isIntersecting) {
            console.log('IN!')
            callback()
        }
    })

    useEffect(() => {
        if (target.current) {
            observer.observe(target.current)
        }
        return () => {
            observer.disconnect()
        }
    }, [target])

    return [target, observer] as const
}
