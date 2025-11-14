"use client";

// import LogoAnimated from "@/components/logo-animated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
// import { ProjectList } from "@/modules/home/ui/components/project-list";
// import { ArrowUpRight } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";

const Page = () => {
  // const [scale, setScale] = useState(1);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const newScale = Math.min(1 + window.scrollY / 1000, 1.15);
  //     setScale(newScale);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);
  // let t1 = gsap.timeline();

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="w-full">
        <div className=" flex flex-col items-center justify-start h-lvh space-y-4 pt-[25vh] 2xl:pt-48">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
          {/* <div
            className={cn(
              "absolute inset-0 -z-10",
              "[background-size:60px_60px]",
              "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
              "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
            )}
          /> */}
          {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div> */}
          <div className="bg-white rounded-full p-1 flex items-center justify-between gap-4 border border-[#a385f5]/30">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]">
              <Avatar className="size-[25px]">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="size-[25px]">
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className="size-[25px]">
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <Avatar className="size-[25px]">
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-center  text-black/60 pr-2">
              Developer community
            </span>
          </div>

          <h1 className="headline text-2xl md:text-6xl text-center font-extrabold">
            Builds ideas into reality
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center">
            Turn your ideas into stunnig Website
          </p>
          <ProjectForm />
        </div>
      </section>
      <span className="w-full text-center text-lg">Made with ❤️ by Shafi</span>
      
      {/* <div
        className="bg-muted  h-[74vh] border rounded-xl
        transition-transform duration-100 ease-out
        flex items-center justify-center overflow-hidden bg-clip-content my-30
        "
      >
        <Image
          src={"/product_screen.png"}
          alt="product screen"
          width={1022}
          height={1000}
        />
      </div> */}

      {/* <LogoAnimated /> */}
      {/* <section>
        <div className="h-[100vh] w-full flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-10">
            Lets build your Website with AI
          </h1>
          <ProjectForm />
        </div>
      </section> */}
    </div>
  );
};

export default Page;
