import DownloadIcon from "@mui/icons-material/Download";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	colors,
	Stack,
	ToggleButton,
	Typography,
} from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import {
	BubbleMenu,
	EditorContent,
	FloatingMenu,
	useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
import { debounce } from "lodash";
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Markdown } from "tiptap-markdown";

import { trpc } from "~/utils/trpc";

interface Props {
	projectTitle: string;
	projectId: string;
}
export function ProjectNotes({ projectId, projectTitle }: Props) {
	const { t } = useTranslation();
	const [isSaving, setIsSaving] = useState(false);
	const notesRef = useRef<{ getContentAsText: () => string }>(null);

	const [data] = trpc.note.byProjectId.useSuspenseQuery({
		projectId: projectId,
	});

	const utils = trpc.useUtils();
	const updateNote = trpc.note.update.useMutation({
		onSuccess: () => {
			setTimeout(() => {
				setIsSaving(false);
			}, 500);
		},
		onSettled: () => {
			utils.note.byProjectId.invalidate({
				projectId: projectId,
			});
		},
	});

	// Using useCallback to maintain function reference
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedUpdate = useCallback(
		debounce((content: JSON) => {
			setIsSaving(true);
			updateNote.mutate({
				projectId: projectId,
				content: content,
			});
		}, 2000),
		[],
	);

	const handleDownload = () => {
		if (notesRef.current) {
			const textContent = notesRef.current.getContentAsText();
			const blob = new Blob([textContent], {
				type: "text/plain",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${projectTitle}-notes.txt`;
			a.click();
			URL.revokeObjectURL(url);
		}
	};

	const handleUpdate = (content: JSON) => {
		debouncedUpdate(content);
	};

	return (
		<Card
			sx={{
				my: 2,
				backgroundColor: colors.yellow[50],
				borderRadius: 1,
				position: "relative",
				overflow: "visible",
				"&:before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: "1.5rem",
					width: "2px",
					height: "100%",
					backgroundColor: colors.red[200],
					zIndex: 1,
				},
			}}
		>
			<Box
				sx={{
					borderBottom: `1px solid ${colors.grey[300]}`,
					backgroundImage: `repeating-linear-gradient(${colors.blue[50]} 0px, ${colors.blue[50]} 29px, ${colors.grey[300]} 29px, ${colors.grey[300]} 30px)`,
					p: 3,
					pt: 2,
					pb: 1,
					position: "relative",
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography
						variant="h6"
						sx={{
							color: colors.grey[800],
							mb: 1,
							position: "relative",
							zIndex: 2,
							ml: 2,
						}}
					>
						{t("project.note.title", "Notes")}
					</Typography>
					{isSaving ? (
						<Stack direction="row" spacing={1} alignItems="center">
							<CircularProgress size={12} color="primary" />
							<Typography variant="body2" color="text.secondary">
								{t("project.note.saving", "Sauvegarde...")}
							</Typography>
						</Stack>
					) : null}
				</Stack>
				<Box
					sx={{
						ml: 2,
						minHeight: "200px",
						maxHeight: "400px",
						overflow: "auto",
					}}
				>
					<TiptapNotes
						content={data?.content as unknown as JSON}
						onUpdate={handleUpdate}
						ref={notesRef}
					/>
					{data ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "row",
									gap: 1,
								}}
							>
								<Typography variant="caption" color="text.secondary">
									{t("project.note.updateAt", "Dernière modification")}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{dayjs(data?.updatedAt).fromNow()}
								</Typography>
							</Box>
							<Button
								variant="text"
								size="small"
								onClick={handleDownload}
								sx={{ color: colors.grey[800] }}
							>
								<DownloadIcon />
								{t("project.note.button.download", "Télécharger")}
							</Button>
						</Box>
					) : null}
				</Box>
			</Box>
		</Card>
	);
}

const TiptapNotes = forwardRef<
	{ getContentAsText: () => string },
	{ content: JSON; onUpdate: (content: JSON) => void }
>(({ content, onUpdate }, ref) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Strike,
			Placeholder.configure({
				placeholder: "Write something...",
			}),
			Markdown,
		],
		content: content,
		onUpdate: ({ editor }) => {
			onUpdate(editor.getJSON() as unknown as JSON);
		},
	});

	useImperativeHandle(ref, () => ({
		getContentAsText: () => {
			return editor ? editor.getText() : "";
		},
	}));

	return (
		<>
			{editor && (
				<BubbleMenu
					className="bubble-menu"
					tippyOptions={{ duration: 100 }}
					editor={editor}
				>
					<ToggleButton
						size="small"
						value={true}
						selected={editor.isActive("bold")}
						onChange={() => editor.chain().focus().toggleMark("bold").run()}
					>
						<FormatBoldIcon />
					</ToggleButton>
					<ToggleButton
						size="small"
						value={true}
						selected={editor.isActive("italic")}
						onChange={() => editor.chain().focus().toggleMark("italic").run()}
					>
						<FormatItalicIcon />
					</ToggleButton>
					<ToggleButton
						size="small"
						value={true}
						selected={editor.isActive("strike")}
						onChange={() => editor.chain().focus().toggleMark("strike").run()}
					>
						<FormatStrikethroughIcon />
					</ToggleButton>
				</BubbleMenu>
			)}

			{editor && (
				<FloatingMenu
					className="floating-menu"
					tippyOptions={{ duration: 100 }}
					editor={editor}
				>
					<ToggleButton
						size="small"
						value={true}
						selected={editor.isActive("heading", { level: 1 })}
						onChange={() =>
							editor.chain().focus().toggleMark("heading", { level: 1 }).run()
						}
					>
						H1
					</ToggleButton>
					<ToggleButton
						size="small"
						value={true}
						selected={editor.isActive("heading", { level: 2 })}
						onChange={() =>
							editor.chain().focus().toggleMark("heading", { level: 2 }).run()
						}
					>
						H2
					</ToggleButton>
					<ToggleButton
						size="small"
						value={true}
						selected={editor.isActive("bulletList")}
						onChange={() =>
							editor.chain().focus().toggleMark("bulletList").run()
						}
					>
						Bullet list
					</ToggleButton>
				</FloatingMenu>
			)}

			<EditorContent editor={editor} />
		</>
	);
});
