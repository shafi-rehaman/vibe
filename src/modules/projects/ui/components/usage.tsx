import Link from "next/link"
import { CrownIcon } from "lucide-react"
import { formatDuration, intervalToDuration } from "date-fns"
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server"
import { useAuth } from "@clerk/nextjs"

interface Props{
    points:number,
    msBeforeNext: number,
}


export const Usage = ({points, msBeforeNext}: Props) => {
    const {has} = useAuth();
    const hasProAccess = has?.({plan:"pro_user"});
    return(
        <div className="rounded-t-xl bg-background border-1 border-b-0 p-2.5 px-4">
            <div className="flex items-center gap-x-1 ">
                <div>
                    <p className="text-sm">
                        {points} { hasProAccess ? "" : "free" } credits remaining
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Resets in {""}
                        {formatDuration(
                            intervalToDuration({
                                start: new Date(),
                                end: new Date(Date.now() + msBeforeNext)
                            }),
                            {format: ['months', 'days', 'hours']}
                        )}
                    </p>
                </div>
                {!hasProAccess &&
                <Button
                    asChild
                    size='sm'
                    variant='tertiary' 
                    className="ml-auto">
                    <Link href='/pricing'><CrownIcon/>Upgrade</Link>
                </Button> 
                }
            </div>
        </div>
    )
}