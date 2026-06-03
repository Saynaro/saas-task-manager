import { useEffect, useRef } from "react"

export default function LightRays({
    color = "#ffffff",
    speed = 0.6,
}) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resize()
        window.addEventListener("resize", resize)

        let t = 0
        let mouseX = canvas.width / 2
        let mouseY = canvas.height / 2

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
        })

        const draw = () => {
            t += speed * 0.01

            //  soft fade (Stripe-style trail)
            ctx.fillStyle = "rgba(10, 10, 20, 0.12)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const originX = canvas.width / 2 + (mouseX - canvas.width / 2) * 0.05
            const originY = canvas.height / 2 + (mouseY - canvas.height / 2) * 0.05

            const rays = 80

            for (let i = 0; i < rays; i++) {
                const angle = (i / rays) * Math.PI * 2 + t

                const length = 300 + Math.sin(t + i) * 80

                const x = originX + Math.cos(angle) * length
                const y = originY + Math.sin(angle) * length

                //  Stripe-like gradient glow
                const gradient = ctx.createLinearGradient(originX, originY, x, y)

                gradient.addColorStop(0, "rgba(255,255,255,0.12)")
                gradient.addColorStop(0.5, "rgba(255,255,255,0.05)")
                gradient.addColorStop(1, "rgba(255,255,255,0)")

                ctx.beginPath()
                ctx.moveTo(originX, originY)
                ctx.lineTo(x, y)

                ctx.strokeStyle = gradient
                ctx.lineWidth = 1
                ctx.stroke()
            }

            requestAnimationFrame(draw)
        }

        draw()

        return () => window.removeEventListener("resize", resize)
    }, [speed])

    return (
        <>
            {/* background base */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "radial-gradient(circle at center, #0b0b12 0%, #050507 100%)",
                }}
            />

            {/* canvas rays */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
        </>
    )
}