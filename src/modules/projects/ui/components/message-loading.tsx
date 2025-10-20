import Image from "next/image"
import { useEffect, useState } from "react"

const ShrimMessages = () => {
    const [currentMessageInd, setCurrentMessageInd] = useState(0);
    const messages = [
        "Thinking...",
        "Loading...",
        "Generating...",
        "Analyzing your request...",
        "Building your website...",
        "Crafting components...",
        "Optimizing layout...",
        "Adding final touches...",
        "Almost ready...",
    ];
    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrentMessageInd((prev) => (prev+1) % messages.length);
        }, 4000);
        
        return () => clearInterval(interval);
    }, [messages.length]);

    return(
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
                {messages[currentMessageInd]}</span>
        </div>
    )
}

export const MessageLoading = ()=>{
    return (
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 pl-2 nb-2">
                <Image
                    src='/logo.svg'
                    height={18}
                    width={18}
                    alt="vibe"
                    className="shrink-0"
                />
                <span className="text-sm font-medium">Vibe</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4 ">
                <ShrimMessages />
            </div>
        </div>
    )
}