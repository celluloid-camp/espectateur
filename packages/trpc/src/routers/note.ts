import { prisma } from "@celluloid/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const noteRouter = router({
	byProjectId: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { projectId } = input;

			if (!ctx.user?.id) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to view this note",
				});
			}

			const note = await prisma.projectNote.findUnique({
				where: {
					projectId_userId: { projectId: projectId, userId: ctx.user.id },
				},
				select: {
					content: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!note) {
				return null;
			}

			return note;
		}),

	update: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				content: z.any(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.user?.id) {
				const project = await prisma.project.findUnique({
					where: {
						id: input.projectId,
					},
				});

				if (!project) {
					throw new Error("Project not found");
				}

				const result = await prisma.projectNote.upsert({
					where: {
						projectId_userId: {
							projectId: project.id,
							userId: ctx.user.id,
						},
					},
					update: {
						content: input.content,
					},
					create: {
						projectId: project.id,
						userId: ctx.user.id,
						content: input.content,
					},
				});

				return result;
			}
		}),
});
