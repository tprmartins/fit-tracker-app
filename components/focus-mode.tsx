import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown, CheckCircle2, Play, Clock, Volume2, VolumeX, Pause, Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";

interface Exercise {
    id: number;
    name: string;
    sets: string;
    reps: string;
    weight: string;
    videoUrl?: string;
}

interface FocusModeProps {
    exercises: Exercise[];
    onClose: () => void;
    completedExercises: number[];
    onToggleExercise: (id: number) => void;
    onFinish?: () => void;
}

const getVideoEmbedUrl = (url?: string, isMuted: boolean = true) => {
    if (!url) return null;

    const muteParam = isMuted ? "1" : "0";

    // YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=${muteParam}&loop=1&playlist=${ytMatch[1]}&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&muted=${muteParam}&background=1`;
    }

    return url;
};

export function FocusMode({ exercises, onClose, completedExercises, onToggleExercise, onFinish }: FocusModeProps) {
    const t = useTranslations('FocusMode');
    const [activeIndex, setActiveIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                scrollToIndex(activeIndex + 1);
            } else if (e.key === "ArrowUp") {
                scrollToIndex(activeIndex - 1);
            } else if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex]);

    // YouTube/Vimeo postMessage control
    useEffect(() => {
        if (!iframeRef.current) return;

        const sendCommand = (provider: 'youtube' | 'vimeo', command: any) => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(JSON.stringify(command), '*');
            }
        };

        const activeExercise = exercises[activeIndex];
        const isYT = activeExercise.videoUrl?.includes('youtube.com') || activeExercise.videoUrl?.includes('youtu.be');
        const isVimeo = activeExercise.videoUrl?.includes('vimeo.com');

        if (isYT) {
            sendCommand('youtube', { event: 'command', func: isPaused ? 'pauseVideo' : 'playVideo' });
            sendCommand('youtube', { event: 'command', func: isMuted ? 'mute' : 'unMute' });
        } else if (isVimeo) {
            sendCommand('vimeo', { method: isPaused ? 'pause' : 'play' });
            sendCommand('vimeo', { method: 'setVolume', value: isMuted ? 0 : 1 });
        }
    }, [isPaused, isMuted, activeIndex]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPaused) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(() => { });
            }
            videoRef.current.muted = isMuted;
        }
    }, [isPaused, isMuted, activeIndex]);

    const scrollToIndex = (index: number) => {
        if (index >= 0 && index < exercises.length && scrollContainerRef.current) {
            const height = scrollContainerRef.current.clientHeight;
            scrollContainerRef.current.scrollTo({
                top: index * height,
                behavior: "smooth"
            });
            setIsPaused(false); // Auto-play on scroll
        }
    };

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPaused(!isPaused);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const startTimer = (seconds: number) => {
        setTimeLeft(seconds);
        setIsTimerRunning(true);
    };

    const handleToggleExercise = (id: number) => {
        const isNowDone = !completedExercises.includes(id);
        onToggleExercise(id);

        // Check if everything is done to auto-finish
        const willBeAllDone = (isNowDone ? completedExercises.length + 1 : completedExercises.length - 1) === exercises.length;

        if (isNowDone) {
            if (willBeAllDone && onFinish) {
                setTimeout(() => {
                    onFinish();
                }, 1000);
            } else if (activeIndex < exercises.length - 1) {
                // Auto-scroll logic: if marked as done and not the last exercise
                setTimeout(() => {
                    scrollToIndex(activeIndex + 1);
                }, 1000);
            }
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const height = e.currentTarget.clientHeight;
        const newIndex = Math.round(e.currentTarget.scrollTop / height);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Background Blur for Desktop (just in case accessed via direct URL or bypass) */}
            <div className="hidden md:block absolute inset-0 bg-slate-900/50 backdrop-blur-3xl" />

            {/* Main Container */}
            <div className="relative flex-1 flex flex-col mx-auto w-full md:max-w-[450px] bg-black overflow-hidden select-none">
                {/* Header - More premium and compact */}
                <div className="absolute top-0 left-0 right-0 pt-10 pb-4 px-4 flex justify-between items-start z-30 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-white hover:bg-white/20 rounded-full blur-backdrop-sm bg-white/10">
                        <X className="h-6 w-6" />
                    </Button>
                    <div className="text-center px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold leading-none mb-1">Exercício</p>
                        <p className="font-black text-sm italic leading-none">{activeIndex + 1} <span className="text-white/40 not-italic font-medium">/</span> {exercises.length}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 text-white hover:bg-white/20 rounded-full blur-backdrop-sm bg-white/10 border-2 transition-all duration-300 ${isTimerRunning ? "animate-pulse border-blue-500 text-blue-400 bg-blue-500/20" : "border-transparent"}`}
                        onClick={() => startTimer(60)}
                    >
                        <Clock className="h-5 w-5" />
                    </Button>
                </div>

                {/* Timer Overlay */}
                {timeLeft > 0 && (
                    <div className="absolute inset-0 z-50 bg-blue-950/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in zoom-in duration-300">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                            <svg className="w-56 h-56 transform -rotate-90 relative">
                                <circle
                                    cx="112"
                                    cy="112"
                                    r="104"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                <circle
                                    cx="112"
                                    cy="112"
                                    r="104"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={653}
                                    strokeDashoffset={653 - (653 * timeLeft) / 60}
                                    className="text-blue-500 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-7xl font-black italic tracking-tighter">{timeLeft}s</span>
                            </div>
                        </div>
                        <p className="mt-12 text-sm font-black uppercase tracking-[0.3em] text-blue-400/80">Descanso Ativo</p>
                        <Button
                            variant="outline"
                            className="mt-16 border-white/10 hover:bg-white/10 text-white font-bold h-12 px-8 rounded-full bg-white/5"
                            onClick={() => setTimeLeft(0)}
                        >
                            Pular Descanso
                        </Button>
                    </div>
                )}

                {/* Scroll Area */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                    onScroll={handleScroll}
                >
                    {exercises.map((ex, index) => (
                        <div key={ex.id} className="h-full w-full snap-start relative flex flex-col justify-end">
                            {/* Video Background / Placeholder */}
                            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                                {ex.videoUrl && index === activeIndex ? (
                                    (() => {
                                        const embedUrl = getVideoEmbedUrl(ex.videoUrl, true);
                                        const isEmbed = embedUrl?.includes('embed') || embedUrl?.includes('player.vimeo');

                                        if (isEmbed) {
                                            return (
                                                <iframe
                                                    ref={iframeRef}
                                                    src={embedUrl!}
                                                    className="w-full h-full pointer-events-none scale-[2.0] origin-center shadow-2xl"
                                                    allow="autoplay; fullscreen; picture-in-picture"
                                                    frameBorder="0"
                                                />
                                            );
                                        }

                                        return (
                                            <video
                                                ref={videoRef}
                                                src={ex.videoUrl}
                                                autoPlay
                                                loop
                                                muted={isMuted}
                                                playsInline
                                                className="h-full w-full object-cover"
                                            />
                                        );
                                    })()
                                ) : (
                                    <div className="text-center space-y-4 opacity-10">
                                        <Play className="h-24 w-24 mx-auto stroke-[1]" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Sem Vídeo</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                            </div>

                            {/* Video Controls Overlay - MOVED TO THE RIGHT CENTER */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-40">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={togglePlay}
                                    className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-black/60 transition-all border-2 active:scale-95"
                                >
                                    {isPaused ? <Play className="h-7 w-7 fill-current" /> : <Pause className="h-7 w-7 fill-current" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleMute}
                                    className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-black/60 transition-all border-2 active:scale-95"
                                >
                                    {isMuted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
                                </Button>
                            </div>

                            {/* Exercise Details Overlay */}
                            <div className="relative p-8 space-y-6 pb-28">
                                <div className="space-y-3">
                                    <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">{ex.name}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-wider">
                                            {ex.sets}
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-wider">
                                            {ex.reps}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-xl px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40">
                                            <Dumbbell className="h-3 w-3" />
                                            {ex.weight ? `${ex.weight}kg` : "Livre"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <Button
                                        onClick={() => handleToggleExercise(ex.id)}
                                        className={`flex-1 h-16 text-lg font-black italic uppercase transition-all duration-500 rounded-2xl border-2 ${completedExercises.includes(ex.id)
                                            ? "bg-green-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                            : "bg-white text-black border-white shadow-xl hover:scale-[1.02]"
                                            }`}
                                    >
                                        <CheckCircle2 className={`h-6 w-6 mr-2 ${completedExercises.includes(ex.id) ? "animate-bounce" : ""}`} />
                                        {completedExercises.includes(ex.id) ? t('done') : t('mark_done')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Indicators - More minimalist */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
                    {exercises.map((_, i) => (
                        <button
                            key={i}
                            className="group p-1"
                            onClick={() => scrollToIndex(i)}
                        >
                            <div
                                className={`rounded-full transition-all duration-300 ${activeIndex === i ? "h-6 w-1 bg-blue-500" : "h-1 w-1 bg-white/20 group-hover:bg-white/40"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Footer hints */}
                <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-1 text-white/20 animate-pulse pointer-events-none">
                    <ChevronDown className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}
