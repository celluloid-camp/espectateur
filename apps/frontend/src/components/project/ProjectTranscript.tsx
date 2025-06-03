import { Download as DownloadIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CircularProgress,
	colors,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import type { User } from "~/lib/auth-client";
import type { ProjectById } from "~/utils/trpc";
import { trpc } from "~utils/trpc";

import { StyledMarkdown } from "../markdown";

interface Props {
	project: ProjectById;
	user?: User;
}
export function ProjectTranscript({ project, user }: Props) {
	const { t } = useTranslation();

	const utils = trpc.useUtils();
	const [data] = trpc.transcript.byProjectId.useSuspenseQuery({
		projectId: project.id,
	});

	const mutation = trpc.transcript.generate.useMutation({
		onSettled: () => {
			utils.project.byId.invalidate({ id: project.id });
		},
	});

	if (!data && !user) {
		return null;
	}

	const isTranscriptInProgress =
		project.jobs.length > 0
			? project.jobs.find((job) => job.type === "transcript")?.queueJob
					?.progress !== 100
			: false;

	const canGenerateTranscript =
		(user?.role === "ADMIN" || user?.id === project.userId) &&
		!data?.content &&
		!isTranscriptInProgress;

	const downloadTranscript = (content: string) => {
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "transcript.txt";
		a.click();
	};

	return (
		<Card
			sx={{
				my: 2,
				backgroundColor: colors.yellow[50],
				borderRadius: 1,
			}}
		>
			<CardHeader
				sx={{ p: 2, borderBottom: `1px solid ${colors.grey[300]}` }}
				title={t("project.transcript.title", "Transcription")}
			/>
			<CardContent sx={{ p: 3, maxHeight: "300px", overflowY: "auto" }}>
				{isTranscriptInProgress ? (
					<Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 1 }}>
						<CircularProgress size={12} color="primary" />
						<Typography variant="body2">
							{t(
								"project.transcript.generating",
								"La transcription est en cours de génération...",
							)}
						</Typography>
					</Box>
				) : data?.content ? (
					<StyledMarkdown content={data?.content} />
				) : (
					<Typography variant="body2">
						{t(
							"project.transcript.empty",
							"Transcription vidéo non disponible.",
						)}
					</Typography>
				)}
			</CardContent>

			<CardActions
				sx={{
					flexDirection: "column",
					alignItems: "flex-end",
					justifyContent: "space-between",
				}}
			>
				{canGenerateTranscript && (
					<LoadingButton
						variant="contained"
						loading={mutation.isLoading}
						color="primary"
						disabled={mutation.isLoading}
						onClick={async () => {
							mutation.mutate({
								projectId: project.id,
							});
						}}
					>
						{t(
							"project.transcript.button.generate",
							"Générer une transcription",
						)}
					</LoadingButton>
				)}
				{data?.content ? (
					<Button
						onClick={() => downloadTranscript(data?.content ?? "")}
						sx={{ color: colors.grey[800] }}
					>
						<DownloadIcon />

						{t("project.transcript.button.download", "Télécharger")}
					</Button>
				) : null}
			</CardActions>
		</Card>
	);
}
