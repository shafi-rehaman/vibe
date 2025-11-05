"use client"

import Link from "next/link"
import {Explora } from "next/font/google";
import {
    SignedIn, SignedOut, SignInButton, SignUpButton
} from "@clerk/nextjs"
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";



const explora = Explora({
    subsets: ["latin"],
    weight: "400", // Explora only has one weight
    variable: "--font-explora",
  });

export const Navbar = () => {
    const isScrolled = useScroll({threshold:10});
    console.log(isScrolled);
    return(
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 p-3 border-b border-white/20 transition-all duration-300",
            "backdrop-blur-xl bg-white/10 supports-[backdrop-filter]:bg-white/10",
            // the custom noise layer
            "before:absolute before:inset-0 before:-z-10 before:opacity-30 before:mix-blend-overlay before:scale-110 before:bg-[url('https://grainy-gradients.vercel.app/noise-large.png')] before:bg-[length:200px_200px] before:bg-repeat",
            isScrolled && "shadow-md bg-white/20 border-white/30 backdrop-blur-2xl before:opacity-40"
          )}
        >
            <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
                <Link href='/' className="flex items-center gap-2"
                >
                    <span className={`font-semibold text-lg ${explora.variable} font-sans`}>Vibe</span>
                </Link>
                <div className="flex justify-between items-center gap-10">
                    <Link 
                    href={'/'}
                    >
                        <span className="">Home</span>
                    </Link>
                    <Link 
                    href={'/'}
                    >
                        <span className="">Work</span>
                    </Link>
                    <Link 
                    href={'/'}
                    >
                        <span className="">About</span>
                    </Link>
                </div>

                <SignedOut>
                    <div className="flex gap-2">
                        <SignUpButton >
                            <Button variant='outline' size='sm' className="">
                                Sign Up
                            </Button>
                        </SignUpButton>
                        <SignInButton>
                            <Button variant='default' size='sm'>
                                Sign In
                            </Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserControl />
                </SignedIn>
            </div>
        </nav>
    )
}