import { OutlinedInput } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useConceptsQuery } from "~utils/concepts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export function ConceptSelector({
	onChange,
}: {
	onChange?: (concept: string) => void;
}) {
	const { data } = useConceptsQuery();
	const [concept, setConcept] = React.useState("");

	const { t } = useTranslation();
	const handleChange = (event: SelectChangeEvent) => {
		setConcept(event.target.value);
		onChange?.(event.target.value);
	};

	return (
		<FormControl
			sx={{
				m: 1,
				maxWidth: 100,
				minWidth: { xs: 80, sm: 100 },
				width: { xs: 80, sm: 100 },
			}}
			size="small"
		>
			<Select
				labelId="concept-select-label"
				id="concept-select"
				value={concept}
				label={t("annotation.concept.label")}
				hiddenLabel
				onChange={handleChange}
				slotProps={{
					root: {
						sx: {
							fontSize: {
								xs: "8px",
								sm: "12px",
							},
						},
					},
				}}
				displayEmpty
				input={<OutlinedInput />}
				renderValue={(selected) => {
					if (selected === "") {
						return (
							<span style={{ color: "white" }}>
								{t("annotation.concept.label")}
							</span>
						);
					}
					return (
						<span
							style={{
								color: "white",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								display: "block",
								maxWidth: "100%",
							}}
						>
							{selected}
						</span>
					);
				}}
				MenuProps={MenuProps}
				inputProps={{ "aria-label": "Without label" }}
			>
				<MenuItem disabled value="">
					<em>{t("annotation.select-concept")}</em>
				</MenuItem>
				{data?.map((concept) => (
					<MenuItem key={concept.concept} value={concept.concept}>
						{concept.concept}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
