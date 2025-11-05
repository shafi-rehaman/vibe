"use client";

import LogoAnimated from "@/components/logo-animated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
// import { ProjectList } from "@/modules/home/ui/components/project-list";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";



const Page = () => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleScroll = () => {
      const newScale = Math.min(1 + window.scrollY / 1000, 1.15);
      setScale(newScale);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="">
        <div className=" flex flex-col items-center justify-start pt-[25vh] 2xl:pt-48">
          <span className="p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              Dev Save Time With Us
            </span>
          </span>

          <h1 className="text-2xl md:text-6xl text-center font-extrabold">
            Builds ideas into reality
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center my-2">
            Turn your ideas into stunnig Website
          </p>

          <div className="flex items-center justify-around gap-5 my-2">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
            </div>
            <Button className="text-[1rem]">
              Generate your Website <ArrowUpRight />
            </Button>
          </div>
        </div>
        <div
          className="bg-muted  h-[74vh] border-1 rounded-xl
        transition-transform duration-100 ease-out
        flex items-center justify-center overflow-hidden bg-clip-content my-30
        "
          style={{ transform: `scale(${scale})` }}
        >
          <Image
            src={"/product_screen.png"}
            alt="product screen"
            width={1022}
            height={1000}
          />
        </div>
      </section>

      <LogoAnimated />

      <section>
        <div className="h-[100vh] w-full flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-10">
            Lets build your Website with AI
          </h1>
          <ProjectForm />
        </div>
      </section>

    </div>
  );
};

export default Page;

{
  /* <div className="max-w-3xl mx-auto w-full my-10 flex flex-col items-center ">
  <h2 className="text-xl md:text-3xl font-bold text-center m-4">Start building, By typing...</h2>
  <ProjectForm />
</div> */
}
// {/* Features */}
// <section className="w-full h-full">
// <div className="w-full h-full  sm:flex  items-center justify-between gap-5">
//   <div className="w-full h-120 bg-amber-50 rounded-xl border-1 "></div>
//   <div className="w-full h-120 bg-amber-50 rounded-xl border-1 "></div>
//   <div className="w-full h-120 bg-amber-50 rounded-xl border-1 "></div>
// </div>
// </section>
