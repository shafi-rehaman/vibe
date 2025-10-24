import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import TextareaAutoSize from "react-textarea-autosize"
import {z} from "zod"
import { toast } from "sonner"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Usage } from "./usage"
import { useRouter } from "next/navigation"

interface messageFormProps{
    projectId: string,
}

const formSchema = z.object({
    value: z.string()
            .min(1, {message:"Value is required"})
            .max(1000, {message:"Value is too long"}),
})

export const MessageForm = ({projectId}: messageFormProps) => {
    const trpc = useTRPC();
    const router = useRouter()
    const {data: usage} = useQuery(trpc.usage.status.queryOptions())
    const queryClient = useQueryClient();
    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess:(data)=>{
            form.reset();
            queryClient.invalidateQueries(
                trpc.messages.getMany.queryOptions({projectId})
            )
            queryClient.invalidateQueries(
                trpc.usage.status.queryOptions()
            )
        },
        onError:(err)=>{
            toast.error(err.message)

            if(err.data?.code === 'TOO_MANY_REQUESTS'){
                router.push('/pricing');
            }
        }
    }));
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            value:""
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId 
        })
    }
    
    const [isFocused, setIsFocused] = useState(false);
    const showUsage = !!usage;
    const isPending = createMessage.isPending;
    const isButtonDisable = isPending || !form.formState.isValid;
    return(
        <Form {...form}>
            {showUsage && (<Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext}/>)}
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                    isFocused && "shadow-xs",
                    showUsage && "rounded-t-none"
                )}

            >
                <FormField
                    control={form.control}
                    name="value"
                    render={({field}) => {
                        return <TextareaAutoSize
                            disabled={isPending}
                            {...field}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)} 
                            minRows={2}
                            maxRows={8}
                            className="pt-4 resize-none border-none outline-none w-full bg-transparent"
                            placeholder="What would you like to build today?"
                            onKeyDown={(e)=>{
                                if(e.key == 'Enter' && (e.ctrlKey || e.metaKey)){
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)(e);
                                }
                            }}
                            />
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
                            "size-8 rounded-full",
                            isButtonDisable && "bg-muted-foreground border"
                        )}
                    >
                        {isPending ? <Loader2Icon/> : <ArrowUpIcon />}
                        
                    </Button>
                </div>
            </form>
        </Form>
    )
}