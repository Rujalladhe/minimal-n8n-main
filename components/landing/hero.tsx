import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-glow" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up shadow-xl backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-blue-400/80 tracking-wide uppercase">Next-Gen Automation</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 animate-fade-in-up delay-100">
                    Automating with AI <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 animate-gradient">
                        Light weight, Easy, and Faster
                    </span>
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200 leading-relaxed">
                    Experience the power of <span className="text-white font-semibold">n9n</span>.
                    Build complex AI workflows in seconds with a visual canvas that feels like magic.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
                    <Link href="/editor">
                        <Button size="lg" className="h-14 px-10 bg-white text-black hover:bg-gray-200 rounded-full text-lg font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95">
                            Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Main Landscape Hero Image / Video Container */}
                <div className="mt-24 relative mx-auto max-w-6xl animate-fade-in-up delay-400 px-4">
                    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-3 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] overflow-hidden">
                        <div className="aspect-[21/9] rounded-xl bg-[#0a0a0a] overflow-hidden border border-white/5 relative group">
                            <video
                                src="/hero-video.mp4"
        
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover group-hover:opacity-100 transition-opacity duration-700"
                            />

                            {/* Overlay Gradient for more "Creative" look */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Decorative glow behind mockup */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-full blur-[100px] -z-10 opacity-50"></div>
                </div>
            </div>
        </section>
    );
}
