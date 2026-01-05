import { Box } from "@mui/material";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
	type Emoji,
	type EmotionRecommended,
	emojisArray,
	mapEmotionToEmojis,
} from "./emoji";
import { useAutoDetectionStore } from "./store";

// import AnnotationService from 'services/AnnotationService';

const OFFSET = 10;

interface EmotionsPaletteProps {
	projectId: string;
	position: number;
	emotion: string | null;
	onEmotionChange(emotion: string | undefined): void;
	sx?: CSSProperties;
}

export function EmotionsPalette({
	position,
	projectId,
	emotion,
	onEmotionChange,
}: EmotionsPaletteProps) {
	const [hoveredComponent, setHoveredComponent] = useState<number | null>(null);
	const [emojis, setEmojis] = useState<Emoji[]>([]);
	const captureIntervalRef = useRef<number | null>(null);
	const startPositionRef = useRef<number>(0);

	const autoDetection = useAutoDetectionStore((state) => state.autoDetection);
	const autoDetectionMode = useAutoDetectionStore(
		(state) => state.autoDetectionMode,
	);

	const detectedEmotion = useAutoDetectionStore(
		(state) => state.detectedEmotion,
	);

	// Update position ref
	useEffect(() => {
		startPositionRef.current = position;
	}, [position]);

	// Others Detection/No Detection
	useEffect(() => {
		const generatePalette = (suggestions: EmotionRecommended[]): Emoji[] => {
			const emojisFlattened: Emoji[] = suggestions.flatMap(
				(emotionRecommended) => mapEmotionToEmojis(emotionRecommended.emotion),
			);

			const palette = Array.from(
				new Set(emojisFlattened.map((obj) => obj.value)),
			)
				.map((value) => emojisFlattened.find((obj) => obj.value === value))
				.filter((item): item is Emoji => item !== undefined);

			return palette;
		};

		const updateEmojis = async () => {
			try {
				let startTimeParam: number = startPositionRef.current;

				if (autoDetectionMode === "auto/reco/me") {
					if (startTimeParam - 10 >= 0) startTimeParam = startTimeParam - 10;
					else startTimeParam = 0;
				} else {
					if (startTimeParam - 5 >= 0) startTimeParam = startTimeParam - 5;
					else startTimeParam = 0;
				}

				const suggestions: EmotionRecommended[] = detectedEmotion
					? [
							{
								emotion: detectedEmotion,
								score: 1,
							},
						]
					: [];
				// await AnnotationService.getRecommendedEmotions(projectId, {
				//   onlyMe: semiAutoAnnotationMe,
				//   startTime: startTimeParam,
				//   offset: OFFSET + 5,
				//   limit: 4,
				// });

				const palette: Emoji[] =
					autoDetectionMode !== "auto" ? generatePalette(suggestions) : [];
				// if (!palette.length) {
				// 	const neutralEmoji = emojisArray.find(
				// 		(emoji) => emoji.value === "neutral",
				// 	);

				// 	if (neutralEmoji) palette.push(neutralEmoji);
				// }

				if (!palette.find((emotion) => emotion.value === "itsStrange"))
					palette.unshift(emojisArray[11]);

				// Always add like and dislike
				if (!palette.find((emotion) => emotion.value === "iDontLike"))
					palette.unshift(emojisArray[1]);

				if (!palette.find((emotion) => emotion.value === "iLike"))
					palette.unshift(emojisArray[0]);

				setEmojis(palette);
			} catch (e) {
				console.log(e);
			}
		};

		if (autoDetection) {
			updateEmojis();
			captureIntervalRef.current = window.setInterval(
				updateEmojis,
				OFFSET * 1000,
			);
		} else setEmojis(emojisArray);

		return () => {
			clearInterval(captureIntervalRef.current as number);
		};
	}, [autoDetectionMode, projectId, detectedEmotion]);

	// UI Code
	const handleHover = (index: number) => {
		setHoveredComponent(index);
	};

	const handleHoverLeave = () => {
		setHoveredComponent(null);
	};

	const elementStyle: CSSProperties = {
		display: "inline-block",
		fontSize: "1.3rem",
		borderRadius: "100%",
		width: "30px",
		height: "30px",
		textAlign: "center",
		cursor: "pointer",
		transition: "transform .3s",
		boxShadow:
			"rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
	};

	return (
		<Box
			display="flex"
			justifyContent="flex-end"
			alignItems="center"
			justifyItems={"center"}
			gap="1px"
			height="2.5rem"
		>
			{emojis.map((emoji, index) => (
				<Box
					key={emoji.value}
					onMouseEnter={() => handleHover(index)}
					onMouseLeave={handleHoverLeave}
					title={emoji.value}
					style={{
						...elementStyle,
					}}
					sx={[
						{
							transform:
								hoveredComponent === index ? "translateY(-20%) scale(2)" : "",
						},
						emotion === emoji.value
							? {
									backgroundColor: "black",
									borderColor: "primary.main",
									borderWidth: 1,
									borderStyle: "solid",
								}
							: {
									backgroundColor: "transparent",
								},
					]}
					onClick={(_e) => {
						if (emoji.value !== emotion) onEmotionChange(emoji.value);
						else onEmotionChange(undefined);
					}}
				>
					<img
						src={`/emojis/${emoji.label}.png`}
						alt={emoji.label}
						style={{ width: 25, height: 25 }}
					/>
				</Box>
			))}
		</Box>
	);
}
