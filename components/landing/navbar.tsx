import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        n9n
                    </span>
                </div>

                <div className="flex items-center gap-4">

                    <Link href="/editor">
                        <Button className="bg-white text-black hover:bg-gray-200 font-medium">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
