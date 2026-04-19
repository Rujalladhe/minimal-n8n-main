import Link from "next/link";
import { Zap, Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-[#d1d7db] bg-[#f0f2f5] pt-24 pb-12 overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#128c7e]/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-[#128c7e] rounded-lg flex items-center justify-center shadow-sm">
                                <Zap className="h-5 w-5 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-black text-[#128c7e]">
                                Wapzio
                            </span>
                        </div>
                        <p className="text-[#65676b] leading-relaxed max-w-xs font-medium">
                            WhatsApp Business API and chatbot automation platform.
                            Product By Anantkamal Software Labs.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-2 rounded-full bg-white border border-[#d1d7db] text-[#65676b] hover:text-[#128c7e] hover:border-[#128c7e]/50 transition-all shadow-sm">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white border border-[#d1d7db] text-[#65676b] hover:text-[#128c7e] hover:border-[#128c7e]/50 transition-all shadow-sm">
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white border border-[#d1d7db] text-[#65676b] hover:text-[#128c7e] hover:border-[#128c7e]/50 transition-all shadow-sm">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-[#1c1e21] font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-[#65676b] font-medium">
                            <li><Link href="/editor" className="hover:text-[#128c7e] transition-colors">Visual Editor</Link></li>
                            <li><Link href="#" className="hover:text-[#128c7e] transition-colors">WhatsApp Nodes</Link></li>
                            <li><Link href="#" className="hover:text-[#128c7e] transition-colors">Templates</Link></li>
                            <li><Link href="#" className="hover:text-[#128c7e] transition-colors">Documentation</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[#1c1e21] font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-[#65676b] font-medium">
                            <li><Link href="#" className="hover:text-[#128c7e] transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-[#128c7e] transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-[#128c7e] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-[#128c7e] transition-colors">Anantkamal</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="bg-white rounded-2xl p-6 border border-[#d1d7db] shadow-sm">
                        <h4 className="text-[#128c7e] font-bold mb-3 uppercase tracking-wider">Stay Updated</h4>
                        <p className="text-[#65676b] text-sm mb-4 font-medium">Get the latest automation tips delivered to your inbox.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-[#f0f2f5] border border-[#d1d7db] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#128c7e] transition-colors"
                            />
                            <button className="bg-[#128c7e] hover:bg-[#075e54] text-white rounded-lg px-4 py-2 text-sm font-bold transition-transform active:scale-95 shadow-md">
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                {/* Credits Bottom Bar */}
                <div className="pt-12 border-t border-[#d1d7db] flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[#65676b] text-sm font-medium">
                        © {currentYear} Wapzio. Product By Anantkamal Software Labs.
                    </p>
                    <div className="flex items-center gap-2 group cursor-pointer py-2 px-4 rounded-full border border-[#d1d7db] bg-white hover:border-[#128c7e] transition-all duration-300 shadow-sm">
                        <span className="text-[#65676b] text-sm font-bold group-hover:text-[#1c1e21] transition-colors">
                            Made with
                        </span>
                        <Heart className="h-4 w-4 text-[#ea0038] fill-[#ea0038] animate-pulse group-hover:scale-125 transition-transform" />
                        <span className="text-[#128c7e] text-sm font-black tracking-widest uppercase group-hover:text-[#075e54]">
                            By Anantkamal
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
