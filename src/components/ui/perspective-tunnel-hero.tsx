"use client";

import {
    animate,
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useSpring,
    MotionValue,
    type AnimationPlaybackControls,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&auto=format&fit=crop`;

export type TunnelImage = { src: string; title: string };

const IMAGES: TunnelImage[] = [
    { src: UNSPLASH("1523275335684-37898b6baf30"), title: "Chroma I" },
    { src: UNSPLASH("1505740420928-5e560c06d30e"), title: "Prism III" },
    { src: UNSPLASH("1526170375885-4d8ecf77b99f"), title: "Ether IV" },
    { src: UNSPLASH("1542291026-7eec264c27ff"), title: "Quantum V" },
    { src: UNSPLASH("1572635196237-14b3f281503f"), title: "Nebula VI" },
    { src: UNSPLASH("1585386959984-a4155224a1ad"), title: "Cyber VII" },
    { src: UNSPLASH("1553062407-98eeb64c6a62"), title: "Flux VIII" },
    { src: UNSPLASH("1546868871-7041f2a55e12"), title: "Aether IX" },
    { src: UNSPLASH("1491553895911-0055eca6402d"), title: "Chroma X" },
];

// Where the tunnel rests after its opening glide: the first cards are already in flight.
const REST_PROGRESS = 0.14;

interface TunnelCardData {
    item: TunnelImage;
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

const buildCards = (images: TunnelImage[]): TunnelCardData[] => images.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    const radiusFactorX = 0.28 + (i % 3) * 0.08;
    const radiusFactorY = 0.26 + (i % 2) * 0.09;

    return {
        item,
        angleCos: Math.cos(goldenAngle),
        angleSin: Math.sin(goldenAngle),
        radiusFactorX,
        radiusFactorY,
        rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
        index: i,
    };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (card.index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1200 : -1700;
    const nearZ = stage.isMobile ? 350 : 500;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

    const cardWidth = stage.isMobile
        ? Math.max(130, Math.min(180, stage.width * 0.38))
        : Math.max(180, Math.min(270, stage.width * 0.18));

    const baseX = card.angleCos * (stage.width * card.radiusFactorX);
    const baseY = card.angleSin * (stage.height * card.radiusFactorY);
    const panStrength = stage.isMobile ? 20 : 45;

    const transform = useTransform(
        [z, pointer.x, pointer.y],
        ([currZ, px, py]: number[]) => {
            const offsetX = baseX - px * panStrength;
            const offsetY = baseY - py * panStrength;
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
        }
    );

    return (
        <motion.div
            style={{
                width: cardWidth,
                transform,
                opacity,
                zIndex: card.index + 1,
            }}
            className="absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none"
        >
            <div className="flex h-full w-full flex-col rounded-[22px] bg-paper p-2 shadow-[0_2px_4px_rgba(17,17,17,0.04),0_30px_60px_-20px_rgba(17,17,17,0.28)] ring-1 ring-black/5">
                <div className="relative flex-1 overflow-hidden rounded-[16px] bg-well">
                    <img
                        src={card.item.src}
                        alt=""
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
                <span className="truncate px-2 pb-1 pt-2.5 text-[11px] font-medium text-ink sm:text-xs">
                    {card.item.title}
                </span>
            </div>
        </motion.div>
    );
}

interface PerspectiveTunnelHeroProps {
    images?: TunnelImage[];
    /** Optional small line above the title. Omit for none. */
    eyebrow?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    /** Primary action shown under the subtitle (e.g. a link to the collection). */
    action?: ReactNode;
    className?: string;
}

export default function PerspectiveTunnelHero({
    images = IMAGES,
    eyebrow,
    title = (
        <>
            INTO THE
            <br />
            ETHER.
        </>
    ),
    subtitle = "Scroll your trackpad or mouse wheel to fly through the spatial 3D corridor.",
    action,
    className,
}: PerspectiveTunnelHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const cards = useMemo(() => buildCards(images), [images]);

    const [stage, setStage] = useState<StageDimensions>({
        width: 1440,
        height: 900,
        isMobile: false,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setStage({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768,
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Raw motion value controlled directly by mouse wheel / touch trackpad
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.0001,
    });

    // Opening glide: the first cards sail in from the far end and settle in flight.
    const intro = useRef<AnimationPlaybackControls | null>(null);
    useEffect(() => {
        if (reduce) {
            rawProgress.set(REST_PROGRESS);
            return;
        }
        intro.current = animate(rawProgress, REST_PROGRESS, { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 });
        return () => intro.current?.stop();
    }, [reduce, rawProgress]);

    // Wheel / touch drive the tunnel while the page is at the top. Once the tunnel is
    // finished (or rewound to the start) the gesture is released so the page scrolls
    // normally, which lets the hero sit above other content.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const advance = (deltaY: number, speed: number, e: Event) => {
            intro.current?.stop();
            const current = rawProgress.get();
            const leaving = (current >= 1 && deltaY > 0) || (current <= 0 && deltaY < 0);
            if (leaving || window.scrollY > 2) return;
            e.preventDefault();
            rawProgress.set(Math.min(1, Math.max(0, current + deltaY * speed)));
        };

        const handleWheel = (e: WheelEvent) => advance(e.deltaY, 0.0008, e); // Adjust speed of tunnel travel here

        let lastY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            lastY = e.touches[0].clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const y = e.touches[0].clientY;
            advance(lastY - y, 0.0025, e);
            lastY = y;
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
        };
    }, [rawProgress]);

    const pointer = useCameraParallax(!reduce);

    const titleScale = useTransform(smoothProgress, [0, REST_PROGRESS, 0.6, 1], [1, 1, 1.1, 1.3]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.85, 1], [1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [REST_PROGRESS, REST_PROGRESS + 0.1], [1, 0]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex h-[100svh] w-full select-none items-center justify-center overflow-hidden bg-canvas text-ink",
                className,
            )}
        >
            {/* Soft studio backdrop: a faint dot field and a cool sweep of light */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(17,17,17,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,#000_40%,transparent_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(31,92,74,0.08)_0%,transparent_70%)]" />

            {/* Depth rings */}
            <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-ink/[0.06]" />
            <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-ink/[0.04]" />

            {/* Depth haze: far cards converge on the vanishing point behind the title, so the centre
                is softened in the page colour to keep the headline crisp over any photo. */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_38%_34%_at_50%_52%,rgba(250,250,248,0.95)_0%,rgba(250,250,248,0.8)_55%,rgba(250,250,248,0)_100%)]" />

            {/* Central Anchor Typography */}
            <motion.div
                style={{ scale: titleScale, opacity: titleOpacity }}
                className="pointer-events-none relative z-20 flex max-w-4xl flex-col items-center px-6 text-center"
            >
                {eyebrow && (
                    <p className="label mb-5">{eyebrow}</p>
                )}
                <motion.h1
                    className="display text-[clamp(3.25rem,9vw,6rem)] text-ink"
                    initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className="mt-6 max-w-[40ch] text-base text-ink-soft sm:text-lg"
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                    {subtitle}
                </motion.p>
                {action && (
                    <motion.div
                        className="pointer-events-auto mt-9"
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                    >
                        {action}
                    </motion.div>
                )}
            </motion.div>

            {/* Scroll Prompt */}
            <motion.div
                style={{ opacity: promptOpacity }}
                className="label pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-3"
            >
                <span>Scroll to explore</span>
                <span className="relative h-9 w-[22px] rounded-full border border-ink/25">
                    <motion.span
                        className="absolute left-1/2 top-1.5 h-2 w-[3px] -translate-x-1/2 rounded-full bg-ink/60"
                        animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                </span>
            </motion.div>

            {/* 3D Z-Space Plane. Perspective lives here, not on the hero, so the plane flattens into
                its own layer and the title (z-20) always reads above the cards. */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
            >
                {cards.map((card, i) => (
                    <TunnelCard
                        key={i}
                        card={card}
                        progress={smoothProgress}
                        pointer={pointer}
                        total={cards.length}
                        stage={stage}
                    />
                ))}
            </div>
        </div>
    );
}
