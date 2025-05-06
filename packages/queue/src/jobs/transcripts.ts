import { type PrismaClient, prisma } from "@celluloid/prisma";
import { getPeerTubeCaptions } from "@celluloid/utils";
import { createQueue } from "@mgcrea/prisma-queue";

import { convertCaptionsToTranscript } from "../utils/llm";

type TranscriptJobPayload = { projectId: string };
type JobResult = { status: number };

export const transcriptsQueue = createQueue<TranscriptJobPayload, JobResult>(
	{ name: "transcripts", prisma: prisma as unknown as PrismaClient },
	async (job, prisma) => {
		const { id, payload } = job;
		console.log(
			`Transcript queue processing job#${id} with payload=${JSON.stringify(payload)})`,
		);

		const project = await prisma.project.findUnique({
			where: { id: payload.projectId },
			select: {
				id: true,
				videoId: true,
				host: true,
			},
		});

		if (!project || !project.videoId || !project.host) {
			throw new Error(
				`Project not found or missing video information (id: ${payload.projectId})`,
			);
		}

		await job.progress(10);

		const captions = await getPeerTubeCaptions({
			videoId: project.videoId,
			host: project.host,
		});
		if (!captions.length || !captions[0]) {
			console.log(`No captions found for project ${project.id}`);
			await job.progress(100);
			return { status: 404 };
		}
		const caption = captions[0];

		try {
			const transcript = await convertCaptionsToTranscript(caption);

			console.log("transcript done");
			await prisma.projectTranscript.upsert({
				where: { projectId: project.id },
				update: { content: transcript },
				create: {
					projectId: project.id,
					content: transcript,
					language: caption.language,
					// @ts-ignore
					entries: caption.entries as unknown as JsonValue,
				},
			});

			await job.progress(100);

			console.log("transcript saved");
		} catch (error) {
			console.error("error generating transcript", error);
		}

		const status = 200;

		console.log(`Finished job#${id} with status=${status}`);
		return { status };
	},
);
