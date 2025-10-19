import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messageRouter = createTRPCRouter({
    getMany: baseProcedure
        .query(async () => {
            const messages = await prisma.message.findMany({
                orderBy:{
                    updatedAt:'desc'
                }
            });
            return messages;
        }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string().min(1, {message:"Message is required"}),
                projectId: z.string().min(1, {message:"Project Id is required"})
            })
        )
        .mutation( async ({input}) =>{
            const createdMessage = await prisma.message.create({
                data:{
                    projectId:input.projectId,
                    content:input.value,
                    role: "USER",
                    type: "RESULT"
                }
            });

            try {
                await inngest.send({
                    name:"code-agent/run",
                    data : {
                      value: input.value,
                      projectId: input.projectId
                    }
                })
            } catch (error) {
                console.error("Failed to dispatch code-agent/run event:", error);
                // Consider whether to throw the error or just log it
            }
            return createdMessage;
        })
})