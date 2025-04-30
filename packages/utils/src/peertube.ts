import type { PeerTubeCaptionResponse, PeerTubeVideo } from "@celluloid/types";
import { parse } from "@plussub/srt-vtt-parser";
import type { Entry } from "@plussub/srt-vtt-parser/dist/types";
export type Caption = {
	language: string;
	entries: Entry[];
};
export const getPeerTubeVideoData = async ({
	videoId,
	host,
}: {
	videoId: string;
	host: string;
}): Promise<PeerTubeVideo | null> => {
	const headers = {
		Accepts: "application/json",
	};

	const apiUrl = `https://${host}/api/v1/videos/${videoId}`;

	const response = await fetch(apiUrl, {
		method: "GET",
		headers: new Headers(headers),
	});

	if (response.status === 200) {
		const data = (await response.json()) as PeerTubeVideo;
		return data;
	}
	throw new Error(
		`Could not perform PeerTube API request (error ${response.status})`,
	);
};
export const getPeerTubeCaptions = async ({
	videoId,
	host,
}: {
	videoId: string;
	host: string;
}): Promise<Array<Caption>> => {
	const videoData = await getPeerTubeVideoData({ videoId, host });
	if (!videoData) {
		return [];
	}

	const headers = {
		Accepts: "application/json",
	};

	const apiUrl = `https://${host}/api/v1/videos/${videoId}/captions`;
	const response = await fetch(apiUrl, {
		method: "GET",
		headers: new Headers(headers),
	});

	if (response.status === 200) {
		const captionsResponse = (await response.json()) as PeerTubeCaptionResponse;
		if (!captionsResponse.data.length) {
			console.log("No captions found");
			return [];
		}

		// Fetch content for each caption
		const captions = await Promise.all(
			captionsResponse.data.map(async (caption) => {
				const captionUrl = `https://${host}${caption.captionPath}`;
				const captionResponse = await fetch(captionUrl);
				const content = await captionResponse.text();
				const parsed = parse(content);
				return {
					language: caption.language.id,
					entries: parsed.entries,
				};
			}),
		);

		return captions;
	}

	return [];
};
