import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#f0f2f5]">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#25d366]/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#128c7e]/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d1d7db] mb-8 animate-fade-in-up shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-[#25d366] animate-pulse"></span>
                    <span className="text-sm font-bold text-[#128c7e] tracking-wide uppercase">WhatsApp Business Automation</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 animate-fade-in-up delay-100 text-[#1c1e21]">
                    Automate Your Business <br />
                    <span className="text-[#128c7e]">
                        On WhatsApp
                    </span>
                </h1>

                <p className="text-xl text-[#65676b] max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200 leading-relaxed font-medium">
                    Experience the power of <span className="text-[#128c7e] font-bold">Wapzio</span>.
                    Build complex WhatsApp workflows in seconds with a visual canvas that feels intuitive and powerful.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
                    <Link href="/editor">
                        <Button size="lg" className="h-14 px-10 bg-[#128c7e] text-white hover:bg-[#075e54] rounded-xl text-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                            Start 7-Days Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Main Landscape Hero Image Container */}
                <div className="mt-20 md:mt-24 relative mx-auto max-w-5xl animate-fade-in-up delay-400 px-4">
                    <div className="rounded-2xl border border-[#d1d7db] bg-white p-2 md:p-3 shadow-2xl overflow-hidden">
                        <div className="aspect-video md:aspect-[21/9] rounded-xl bg-[#f0f2f5] overflow-hidden border border-[#d1d7db] relative group">
                            <img
                                src="/hero-image.webp"
                                alt="Wapzio Interface"
                                className="w-full h-full object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Decorative glow behind mockup */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-[#128c7e]/10 to-[#25d366]/10 rounded-full blur-[100px] -z-10 opacity-50"></div>
                </div>
            </div>
        </section>
    );
}
