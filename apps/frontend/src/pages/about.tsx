import { Box, Grid, Link, Typography } from "@mui/material";
import type * as React from "react";
import { Trans, useTranslation } from "react-i18next";

import larochelUniv from "../images/about/lr.png";
import logoErasmus from "../images/about/logo-Erasmus-500x281.png";
import logoCRHIA from "../images/about/logo-crhia.jpg";
import logoNA from "../images/about/logo-nl.jpg";
import logoUP from "../images/about/logo-up.png";

import { CelluloidLogo } from "~images/CelluloidLogo";

export const About: React.FC = () => {
	const { t } = useTranslation();

	return (
		<div
			style={{
				padding: 48,
				maxWidth: 1024,
				margin: "0 auto",
			}}
		>
			<Typography variant="h2" gutterBottom={true}>
				{t("about.title")}
			</Typography>
			<Typography variant="subtitle1" gutterBottom={true}>
				<Trans i18nKey={"about.intro"}>
					<b />
					<Link
						href="https://www.huma-num.fr/les-consortiums-hn/"
						target="_blank"
						rel="noreferrer"
					/>
				</Trans>
			</Typography>
			{/* <Typography variant="subtitle1" gutterBottom={true}>
				{t("about.support")}
			</Typography> */}
			<Typography variant="subtitle1" gutterBottom={true} pt={1}>
				<Trans i18nKey={"about.opensource.prefix"}>
					<Link
						href="https://canevas.hypotheses.org/a-propos"
						target="_blank"
						rel="noreferrer"
					/>
					<Link
						href="https://www.mshparisnord.fr/programmes/consortium-humanum-cannevas/"
						target="_blank"
						rel="noreferrer"
					/>
				</Trans>
			</Typography>

			<div
				style={{
					padding: 48,
					textAlign: "center",
				}}
			>
				<Grid container spacing={2} bgcolor={"white"}>
					<Grid item>
						<a
							href="https://www.univ-larochelle.fr/"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src={larochelUniv}
								height="60px"
								alt="Université de la Rochelle"
							/>
						</a>
					</Grid>
					<Grid item={true}>
						<a href="https://www.crhia.fr/" target="_blank" rel="noreferrer">
							<img
								src={logoCRHIA}
								height="60px"
								alt="Fondation Saint-Matthieu"
							/>
						</a>
					</Grid>
					<Grid item={true} display="flex" justifyContent="center">
						<Box
							width={200}
							display="flex"
							justifyContent="center"
							alignItems="center"
						>
							<a href="https://celluloid.me/" target="_blank" rel="noreferrer">
								<CelluloidLogo />
							</a>
						</Box>
					</Grid>
					<Grid item={true}>
						<a
							href="https://info.erasmusplus.fr/"
							target="_blank"
							rel="noreferrer"
						>
							<img src={logoErasmus} height="60px" alt="Le site de Huma-num" />
						</a>
					</Grid>
					<Grid item={true}>
						<a
							href="https://www.nouvelle-aquitaine.fr/"
							target="_blank"
							rel="noreferrer"
						>
							<img src={logoNA} height="60px" alt="Le site de Huma-num" />
						</a>
					</Grid>

					<Grid item={true}>
						<a
							href="https://www.univ-poitiers.fr/"
							target="_blank"
							rel="noreferrer"
						>
							<img src={logoUP} height="60px" alt="Le site de Huma-num" />
						</a>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};
