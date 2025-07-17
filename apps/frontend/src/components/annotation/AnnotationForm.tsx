import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import CenterFocusStrongOutlinedIcon from "@mui/icons-material/CenterFocusStrongOutlined";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RateReviewIcon from "@mui/icons-material/RateReview";
import {
	Box,
	Button,
	Checkbox,
	ClickAwayListener,
	FormControlLabel,
	InputBase,
	Tooltip,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, type ZodType } from "zod";
import { Trans, useTranslation } from "react-i18next";

import { useVideoPlayerProgressValue } from "~components/project/useVideoPlayer";
import { type ProjectById, trpc, type UserMe } from "~utils/trpc";

import { ConceptSelector } from "./concept-selector";
import { DurationSlider } from "./DurationSlider";
import {
	useAnnotationFormVisible,
	useContextualEditorPosition,
	useContextualEditorVisibleState,
	useEditAnnotation,
	useEmotionEditor,
} from "./useAnnotationEditor";
import { EmotionsPalette } from "../emotion-detection/emotion-palette";
import {
	useAutoDetectionMode,
	usePlayerModeStore,
} from "../emotion-detection/store";

type AnnotationFormProps = {
	duration: number;
	project: ProjectById;
	user: UserMe;
};

export const AnnotationForm: React.FC<AnnotationFormProps> = (props) => {
	const [showForm, setShowForm] = useAnnotationFormVisible();

	const { t } = useTranslation();

	const handleOpen = () => {
		setShowForm(true);
	};

	const handleClose = () => {
		setShowForm(false);
	};

	if (!showForm) {
		return (
			<Button
				variant="outlined"
				onClick={handleOpen}
				color="secondary"
				sx={{ mx: 5 }}
				startIcon={<RateReviewIcon />}
			>
				{t("annotation.form.add-annotation")}
			</Button>
		);
	}
	return <AnnotationFormContent onClose={handleClose} {...props} />;
};

const annotationSchema = z
	.object({
		startTime: z.number(),
		stopTime: z.number(),
		pause: z.boolean(),
		text: z.string(),
		emotion: z.string().optional(),
		concept: z.string().optional(),
	})
	.refine((data) => data.text.trim() !== "" || data.emotion !== undefined, {
		message: "Either text or emotion must be provided.",
		path: ["text", "emotion"],
	});

type AnnotationFormValues = z.infer<typeof annotationSchema>;

export const AnnotationFormContent: React.FC<
	AnnotationFormProps & { onClose: () => void }
> = ({ duration, project, onClose }) => {
	const utils = trpc.useUtils();
	const addMutation = trpc.annotation.add.useMutation();
	const editMutation = trpc.annotation.edit.useMutation();

	const [contextEditorVisible, setContextualEditorVisible] =
		useContextualEditorVisibleState();

	const [contextualEditorPosition, setContextualEditorPosition] =
		useContextualEditorPosition();

	const [editedAnnotation, setEditedAnnotation] = useEditAnnotation();

	const videoProgress = useVideoPlayerProgressValue();

	const playerMode = usePlayerModeStore((state) => state.mode);

	const { autoDetection, autoDetectionMode } = useAutoDetectionMode();

	const defaultValues: AnnotationFormValues = editedAnnotation
		? {
				startTime: editedAnnotation.startTime,
				stopTime: editedAnnotation.stopTime,
				pause: editedAnnotation.pause,
				text: editedAnnotation.text,
				emotion: editedAnnotation.emotion ?? "",
				concept: editedAnnotation.concept ?? "",
			}
		: {
				startTime: videoProgress,
				stopTime: videoProgress + 600, // 10 minutes
				pause: true,
				text: "",
				emotion: undefined,
				concept: undefined,
			};

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting, isValid },
		reset,
		watch,
	} = useForm<AnnotationFormValues>({
		resolver: zodResolver(annotationSchema),
		defaultValues,
		mode: "onChange",
	});

	const values = watch();

	const onSubmit = async (values: AnnotationFormValues) => {
		if (editedAnnotation) {
			const changedAnnotation = await editMutation.mutateAsync({
				annotationId: editedAnnotation.id,
				projectId: project.id,
				text: values.text,
				startTime: values.startTime,
				stopTime: values.stopTime,
				pause: values.pause,
				extra: contextualEditorPosition ? contextualEditorPosition : {},
			});
			if (changedAnnotation) {
				reset();
				setContextualEditorPosition(undefined);
				setEditedAnnotation(undefined);
				handleClose();
			}
		} else {
			const newAnnotation = await addMutation.mutateAsync({
				projectId: project.id,
				text: values.text || "",
				startTime: values.startTime,
				stopTime: values.stopTime,
				pause: values.pause,
				emotion: values.emotion,
				mode: playerMode,
				detection: autoDetection ? autoDetectionMode : undefined,
				concept: values.concept,
				extra: contextualEditorPosition ? contextualEditorPosition : {},
			});
			if (newAnnotation) {
				reset();
				setContextualEditorPosition(undefined);
				handleClose();
			}
		}
		utils.annotation.byProjectId.invalidate({ id: project.id });
	};

	const handleClickAway = () => {};

	const handleClose = () => {
		setContextualEditorVisible(false);
		onClose();
	};

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{ flexShrink: 0, pt: 5, paddingX: 2 }}
			>
				<Box sx={{ paddingX: 2 }}>
					<Controller
						name="startTime"
						control={control}
						render={({ field }) => (
							<DurationSlider
								duration={duration}
								startTime={field.value}
								stopTime={values.stopTime}
								onChange={(start, stop) => {
									setValue("startTime", start);
									setValue("stopTime", stop);
								}}
							/>
						)}
					/>
				</Box>
				<Box
					sx={{
						p: "2px 4px",
						display: "flex",
						alignItems: "center",
						backgroundColor: grey[800],
						borderRadius: 1,
					}}
				>
					<Controller
						name="text"
						control={control}
						render={({ field }) => (
							<InputBase
								{...field}
								id="text"
								name="text"
								sx={{ ml: 1, flex: 1, color: "white" }}
								placeholder="Saissez votre annotation"
								multiline
								maxRows={5}
								minRows={2}
								error={!!errors.text}
								disabled={isSubmitting}
								inputProps={{
									"aria-label": "Saissez votre annotation",
									maxLength: 250,
								}}
							/>
						)}
					/>
				</Box>

				<EmotionsPalette
					emotion={values.emotion || ""}
					projectId={project.id}
					semiAutoAnnotation={false}
					semiAutoAnnotationMe={false}
					position={videoProgress}
					onEmotionChange={(emotion) => {
						setValue("emotion", emotion, {
							shouldValidate: true,
						});
					}}
				/>

				<Box
					display={"flex"}
					justifyContent={"space-between"}
					alignItems={"center"}
				>
					<Box>
						<Tooltip title="Placer un repère visuel" arrow>
							<FormControlLabel
								label="Contexte"
								sx={{ color: "white" }}
								slotProps={{
									typography: {
										fontSize: {
											xs: "8px",
											sm: "12px",
										},
									},
								}}
								checked={contextEditorVisible}
								onChange={() =>
									setContextualEditorVisible(!contextEditorVisible)
								}
								control={
									<Checkbox
										size="small"
										icon={<CenterFocusStrongOutlinedIcon />}
										checkedIcon={<CenterFocusStrongIcon color="secondary" />}
									/>
								}
							/>
						</Tooltip>

						<Tooltip title={"Pause automatique à l'ouverture"} arrow>
							<Controller
								name="pause"
								control={control}
								render={({ field }) => (
									<FormControlLabel
										sx={{ color: "white" }}
										slotProps={{
											typography: {
												fontSize: {
													xs: "8px",
													sm: "12px",
												},
											},
										}}
										label="Pause"
										control={
											<Checkbox
												size="small"
												color="secondary"
												id="pause"
												checked={field.value}
												onChange={(e) => field.onChange(e.target.checked)}
												icon={<PauseCircleOutlineOutlinedIcon />}
												checkedIcon={<PauseCircleIcon />}
											/>
										}
									/>
								)}
							/>
						</Tooltip>
					</Box>
					<ConceptSelector
						onChange={(concept) => {
							setValue("concept", concept, {
								shouldValidate: true,
							});
						}}
					/>
					<Box sx={{ marginY: 1 }} flexDirection={"row"}>
						<Button
							size="small"
							onClick={handleClose}
							sx={{
								color: grey[500],
							}}
						>
							<Trans i18nKey="annotation.create.cancel">Annuler</Trans>
						</Button>
						<Button
							size="small"
							variant="contained"
							disabled={!isValid || isSubmitting}
							disableElevation
							sx={{
								borderRadius: 10,
								"&:disabled": {
									color: grey[500],
									backgroundColor: grey[700],
								},
							}}
							type="submit"
						>
							{editedAnnotation ? (
								<Trans i18nKey="annotation.edit.send">Modifier</Trans>
							) : (
								<Trans i18nKey="annotation.create.send">Envoyer</Trans>
							)}
						</Button>
					</Box>
				</Box>
			</Box>
		</ClickAwayListener>
	);
};
