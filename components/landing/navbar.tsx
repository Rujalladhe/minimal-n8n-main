import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-[#d1d7db] bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#128c7e] rounded-lg flex items-center justify-center shadow-sm">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-[#128c7e]">
                            Wapzio
                        </span>
                        <span className="hidden md:inline ml-2 text-[10px] text-[#65676b] font-medium uppercase tracking-tighter">
                            By Anantkamal
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">

                    <Link href="/editor">
                        <Button className="bg-[#128c7e] text-white hover:bg-[#075e54] font-semibold rounded-lg shadow-sm transition-all active:scale-95">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
