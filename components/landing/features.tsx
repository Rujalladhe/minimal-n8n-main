import {
    Bot,
    Workflow,
    Zap,
    Database,
    Code,
    Shield
} from "lucide-react";

const features = [
    {
        icon: Workflow,
        title: "Visual Workflow Builder",
        description: "Drag and drop nodes to create complex automations in minutes. No coding required."
    },
    {
        icon: Bot,
        title: "AI Integration",
        description: "Built-in support for OpenAI, Anthropic, and Gemini. Generate text, analyze data, and build chatbots."
    },
    {
        icon: Zap,
        title: "Real-time Execution",
        description: "Watch your workflows run in real-time with visual feedback for every step of the process."
    },
    {
        icon: Database,
        title: "Local Database",
        description: "Save and load your workflows locally. Your data stays on your machine, secure and private."
    },
    {
        icon: Code,
        title: "Custom Scripting",
        description: "Extend functionality with custom JavaScript nodes when you need that extra bit of control."
    },
    {
        icon: Shield,
        title: "Secure by Design",
        description: "Open source and self-hostable. You control your infrastructure and your data."
    }
];

export function Features() {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Background elements for creative feel */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tight">
                        Powerful features for <br /> modern automation
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Everything you need to automate your work, integrated into one <span className="text-blue-400 font-medium">seamless platform</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] backdrop-blur-md overflow-hidden"
                        >
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-transparent to-violet-600/0 group-hover:from-blue-600/5 group-hover:to-violet-600/5 transition-all duration-500"></div>

                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 group-hover:border-blue-500/20 transition-all duration-500 shadow-lg">
                                    <feature.icon className="h-7 w-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
