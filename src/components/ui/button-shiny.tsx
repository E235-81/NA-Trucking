import * as React from "react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    className?: string;
}

function ButtonCta({ label = "Get a Quote", className, ...props }: ButtonCtaProps) {
    return (
        <Button
            variant="ghost"
            className={cn(
                "group relative overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-2xl",
                "w-fit min-w-[220px] h-16 px-8 rounded-xl",
                "bg-gradient-to-r from-white via-gray-100 to-white",
                "hover:from-gray-50 hover:via-white hover:to-gray-50",
                "border-2 border-white/20 hover:border-white/40",
                "shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]",
                "focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-4 focus-visible:ring-offset-black",
                "transform-gpu will-change-transform",
                className
            )}
            {...props}
        >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

            <div className="relative flex items-center justify-center gap-3 z-10">
                {/* Quote icon */}
                <svg 
                    className="w-5 h-5 text-black group-hover:text-gray-800 transition-colors duration-300" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3l-2 4z"/>
                </svg>
                
                <span className="text-xl font-bold text-black group-hover:text-gray-800 transition-colors duration-300 tracking-wide">
                    {label}
                </span>
                
                {/* Arrow icon */}
                <svg 
                    className="w-5 h-5 text-black group-hover:text-gray-800 transition-all duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {/* Pulsing border effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Button>
    );
}

export { ButtonCta }