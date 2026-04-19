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
        <section className="py-24 md:py-32 relative overflow-hidden bg-white">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#25d366]/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#128c7e]/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#1c1e21] tracking-tight">
                        Powerful features for <br /> WhatsApp automation
                    </h2>
                    <p className="text-[#65676b] text-lg max-w-2xl mx-auto leading-relaxed">
                        Everything you need to automate your WhatsApp business, integrated into one <span className="text-[#128c7e] font-bold">seamless platform</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-3xl bg-[#f0f2f5] border border-[#d1d7db] hover:border-[#128c7e] hover:bg-white transition-all duration-500 hover:shadow-xl overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-6 border border-[#d1d7db] group-hover:scale-110 group-hover:border-[#25d366] transition-all duration-500 shadow-sm">
                                    <feature.icon className="h-7 w-7 text-[#128c7e] group-hover:text-[#25d366] transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-[#1c1e21] tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-[#65676b] leading-relaxed transition-colors">
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
