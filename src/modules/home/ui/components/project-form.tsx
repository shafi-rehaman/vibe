"use client";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutoSize from "react-textarea-autosize";
import { toast } from "sonner";
import { Loader2Icon, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
// import { PROJECT_TEMPLATES } from "@/app/(home)/constant";
import { useClerk } from "@clerk/nextjs";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(1000, { message: "Value is too long" }),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const clerk = useClerk();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/projects/${data.id}`);
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (err) => {
        toast.error(err.message);
        if (err.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
        if (err.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };
  // const onSelect = (value: string) => {
  //   form.setValue("value", value, {
  //     shouldDirty: true,
  //     shouldTouch: true,
  //     shouldValidate: true,
  //   });
  // };

  const [isFocused, setIsFocused] = useState(false);

  const isPending = createProject.isPending;
  const isButtonDisable = isPending || !form.formState.isValid;
  return (
    <Form {...form}>
      <section className="space-y-6 w-3xl max-w-3xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && "shadow-xs"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => {
              return (
                <TextareaAutoSize
                  disabled={isPending}
                  {...field}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  minRows={2}
                  maxRows={8}
                  className="pt-4 resize-none border-none outline-none w-full bg-transparent"
                  placeholder="What would you like to build today?"
                  onKeyDown={(e) => {
                    if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(e);
                    }
                  }}
                />
              );
            }}
          />
          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted border px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
              &nbsp;to submit
            </div>
            <Button
              disabled={isButtonDisable}
              className={cn(
                "size-8 rounded-full flex items-center justify-center",
                isButtonDisable && "bg-muted-foreground border"
              )}
            >
              {isPending ? <Loader2Icon /> : <ArrowUpRight />}
            </Button>
          </div>
        </form>

        {/* <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
                {PROJECT_TEMPLATES.map((template)=>(
                    <Button 
                        key={template.title}
                        variant="outline"
                        size="sm"
                        className="bg-white dark:bg-sidebar"
                        onClick={()=>onSelect(template.prompt)}
                    >
                        {template.emoji} <span/> {template.title}
                    </Button>
                ))}
            </div> */}
      </section>
    </Form>
  );
};
