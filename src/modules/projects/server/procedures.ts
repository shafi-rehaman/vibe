import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import {generateSlug} from 'random-word-slugs';
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({
            id : z.string().min(1, {message:"Id is required"}),
        }))
        .query(async ({input}) => {
            const ExistingProjects = await prisma.project.findUnique({
                where:{
                    id:input.id
                }
            });

        if(!ExistingProjects){
            throw new TRPCError({code:'NOT_FOUND', message:'Project not found'})
        }

        return ExistingProjects;
    }),
    getMany: baseProcedure
        .query(async () => {
            const projects = await prisma.project.findMany({
                orderBy:{
                    updatedAt:'desc'
                }
            });
            return projects;
        }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string()
                .trim()
                .min(1, {message:"Prompt is required"})
                .max(10000, {message:"Prompt is too long"})
            })
        )
        .mutation( async ({input}) =>{
            const createProject = await prisma.project.create({
                data: {
                    name: generateSlug(2, {format:'kebab'}),
                    messages:{
                        create:{
                            content:input.value,
                            role: "USER",
                            type: "RESULT"
                        }
                    }
                }
            })
            
            try {
                await inngest.send({
                    name:"code-agent/run",
                    data : {
                      value: input.value,
                      projectId: createProject.id
                    }
                })
            } catch (error) {
                console.error("Failed to dispatch code-agent/run event:", error);
                // Consider whether to throw the error or just log it
            }
            return createProject;
        })
})