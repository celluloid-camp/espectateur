import * as React from "react";
import { styled, alpha, keyframes } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { type MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { Box, colors, ListItemText, MenuList, Typography } from "@mui/material";
import Check from "@mui/icons-material/Check";
import { useAutoDetectionStore } from "../emotion-detection/store";
import { AutoDetectionDialog } from "./dialog";
import { grey } from "@mui/material/colors";
import type { ProjectById, UserMe } from "~/utils/trpc";
import { useTranslation } from "react-i18next";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const BlinkingIcon = styled(CameraAltIcon)(({ theme }) => ({
	animation: `${blink} 1.5s ease-in-out infinite`,
}));

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right",
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		borderColor: theme.palette.grey[800],
		color: theme.palette.grey[300],
		"& .MuiMenu-list": {
			padding: "4px 0",
			backgroundColor: theme.palette.background.dark,
		},
		"& .MuiMenuItem-root": {
			"& .MuiSvgIcon-root": {
				fontSize: 16,
				color: theme.palette.grey[300],
				marginRight: theme.spacing(1.5),
			},
			"&:active": {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity,
				),
			},
		},
	},
}));

export default function AutoDetectionMenu({
	project,
	user,
}: {
	project: ProjectById;
	user?: UserMe;
}) {
	const { t } = useTranslation();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const {
		autoDetection,
		setAutoDetection,
		autoDetectionMode,
		setAutoDetectionMode,
	} = useAutoDetectionStore();

	const handleToggleAutoDetection = () => {
		setAutoDetection(!autoDetection);
		setAutoDetectionMode("auto");
		handleClose();
	};

	return (
		<div>
			{autoDetection ? (
				<AutoDetectionDialog project={project} user={user} />
			) : null}
			<Button
				id="demo-customized-button"
				aria-controls={open ? "demo-customized-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				variant="outlined"
				disableElevation
				size="small"
				onClick={handleClick}
				fullWidth
				sx={{
					fontSize: {
						xs: "8px",
						sm: "10px",
					},
				}}
				startIcon={
					autoDetection ? (
						<BlinkingIcon sx={{ color: colors.red[500] }} />
					) : (
						<CameraAltIcon />
					)
				}
			>
				{t("auto-detection.button.title")}
			</Button>
			<StyledMenu
				id="demo-customized-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuList dense>
					<MenuItem onClick={handleToggleAutoDetection}>
						{autoDetection ? <StopCircleIcon /> : <PlayCircleFilledWhiteIcon />}
						<Typography sx={{ fontSize: 12 }}>
							{autoDetection
								? t("auto-detection.button.stop")
								: t("auto-detection.button.start")}
						</Typography>
					</MenuItem>
					<Box
						sx={{
							fontSize: 12,
							color: grey[500],
							justifyContent: "center",
							textAlign: "center",
						}}
					>
						{t("auto-detection.hint")}
					</Box>
					<MenuItem onClick={() => setAutoDetectionMode("auto/reco/allusers")}>
						<ListItemText sx={{ fontSize: 12 }}>
							{t("auto-detection.button.from-all")}
						</ListItemText>
						{autoDetectionMode === "auto/reco/allusers" && <Check />}
					</MenuItem>
					<MenuItem onClick={() => setAutoDetectionMode("auto/reco/me")}>
						<ListItemText sx={{ fontSize: 12 }}>
							{t("auto-detection.button.only-me")}
						</ListItemText>
						{autoDetectionMode === "auto/reco/me" && <Check />}
					</MenuItem>
				</MenuList>
			</StyledMenu>
		</div>
	);
}
