import { prisma } from "@celluloid/prisma";
import { transcriptsQueue } from "@celluloid/queue";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const transcriptRouter = router({
	byProjectId: publicProcedure
		.input(
			z.object({
				projectId: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const { projectId } = input;

			const transcript = await prisma.projectTranscript.findUnique({
				where: { projectId: projectId },
				select: {
					content: true,
					createdAt: true,
				},
			});

			if (!transcript) {
				return null;
			}

			return transcript;
		}),

	generate: publicProcedure
		.input(
			z.object({
				projectId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const { projectId } = input;

			const job = await transcriptsQueue.add({ projectId: projectId });

			await prisma.project.update({
				where: { id: projectId },
				data: {
					jobs: { create: { type: "transcript", queueJobId: job.id } },
				},
			});

			return job.id;
		}),
});
