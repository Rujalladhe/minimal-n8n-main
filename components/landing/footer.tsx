import Link from "next/link";
import { Zap, Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-white/10 bg-[#050505] pt-24 pb-12 overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                                <Zap className="h-5 w-5 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                                n9n
                            </span>
                        </div>
                        <p className="text-gray-500 leading-relaxed max-w-xs">
                            Automating with AI: Light weight, Easy, and Faster.
                            The next generation of visual workflow engineering.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/50 transition-all">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/50 transition-all">
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/50 transition-all">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link href="/editor" className="hover:text-blue-400 transition-colors">Visual Editor</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">AI Nodes</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Custom Templates</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">API Reference</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Brand Assets</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                        <h4 className="text-white font-bold mb-3 italic text-lg uppercase tracking-wider">Join the future</h4>
                        <p className="text-gray-500 text-sm mb-4">Get the latest automation tips delivered to your inbox.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-bold transition-transform active:scale-95">
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                {/* Credits Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-600 text-sm italic">
                        © {currentYear} n9n. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 group cursor-pointer py-2 px-4 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group shadow-lg">
                        <span className="text-gray-400 text-sm font-medium tracking-tight group-hover:text-white transition-colors">
                            Made with
                        </span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse group-hover:scale-125 transition-transform" />
                        <span className="text-white text-sm font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 group-hover:from-blue-300 group-hover:to-violet-300">
                            By Rujal ladhe
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
