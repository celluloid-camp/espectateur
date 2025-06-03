import { Typography } from "@mui/material";
import { memo } from "react";
import Markdown from "react-markdown";

export const StyledMarkdown = memo(({ content }: { content: string }) => {
	return (
		<Markdown
			components={{
				p: (props) => {
					return <Typography variant="body2" {...props} />;
				},
			}}
		>
			{content}
		</Markdown>
	);
});
