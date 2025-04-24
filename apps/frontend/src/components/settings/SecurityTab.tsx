import { LoadingButton } from "@mui/lab";
import { Alert, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { changePassword } from "~/lib/auth-client";

import { PasswordTextField } from "../commun/password-textfield";
import SettingsTabPanel from "./SettingsTabPanel";

export default function SecurityTabForm({
	value,
	index,
}: {
	value: number;
	index: number;
}) {
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();

	const validationSchema = Yup.object().shape({
		oldPassword: Yup.string()
			.required()
			.label(t("profile.security.old-password.label")),
		newPassword: Yup.string()
			.min(8)
			.required()
			.label(t("profile.security.new-password.label")),
		passwordConfirmation: Yup.string()
			.oneOf([Yup.ref("newPassword")], t("password.unmatch"))
			.required()
			.label(t("profile.security.confirmation-password.label")),
	});

	const formik = useFormik({
		initialValues: {
			oldPassword: "",
			newPassword: "",
			passwordConfirmation: "",
			error: null,
		},
		validateOnMount: false,
		validationSchema: validationSchema,
		validateOnBlur: true,
		validateOnChange: true,
		onSubmit: async (values) => {
			try {
				const { error } = await changePassword({
					newPassword: values.newPassword,
					currentPassword: values.oldPassword,
				});

				if (error && error.code === "INVALID_PASSWORD") {
					formik.setFieldError(
						"oldPassword",
						t("profile.security.password-incorrect"),
					);
					return;
				}
				enqueueSnackbar({
					message: t(
						"profile.security.change-password.success",
						"Mot de passe changé avec succès",
					),
					variant: "success",
					key: "user.update.password.success",
				});
				formik.resetForm();
			} catch (e) {
				console.error(e);
			}
		},
	});

	return (
		<SettingsTabPanel value={value} index={index}>
			<form onSubmit={formik.handleSubmit}>
				<Typography variant="h5">
					{t("profile.security.change-password.title")}
				</Typography>

				{formik.errors.error ? (
					<Alert severity="error" sx={{ borderRadius: 0, mt: 0 }}>
						{formik.errors.error}
					</Alert>
				) : null}

				<Box
					sx={{
						width: "50%",
						justifyContent: "flex-start",
						alignContent: "flex-start",
						alignItems: "flex-start",
						display: "flex",
						flexDirection: "column",
						py: 2,
					}}
				>
					<PasswordTextField
						variant="outlined"
						fullWidth
						margin="normal"
						id="oldPassword"
						name="oldPassword"
						value={formik.values.oldPassword}
						placeholder={t("profile.security.old-password.label")}
						onChange={formik.handleChange}
						disabled={formik.isSubmitting}
						inputProps={{
							"data-testid": "oldPassword",
						}}
						onBlur={formik.handleBlur}
						error={
							formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
						}
						helperText={formik.touched.oldPassword && formik.errors.oldPassword}
						label={t("profile.security.old-password.label")}
					/>
					<PasswordTextField
						variant="outlined"
						fullWidth
						margin="normal"
						id="newPassword"
						name="newPassword"
						value={formik.values.newPassword}
						placeholder={t("profile.security.new-password.label")}
						onChange={formik.handleChange}
						disabled={formik.isSubmitting}
						inputProps={{
							"data-testid": "newPassword",
						}}
						onBlur={formik.handleBlur}
						error={
							formik.touched.newPassword && Boolean(formik.errors.newPassword)
						}
						helperText={formik.touched.newPassword && formik.errors.newPassword}
						label={t("profile.security.new-password.label")}
					/>
					<PasswordTextField
						variant="outlined"
						fullWidth
						margin="normal"
						id="passwordConfirmation"
						name="passwordConfirmation"
						value={formik.values.passwordConfirmation}
						placeholder={t("profile.security.confirmation-password.label")}
						onChange={formik.handleChange}
						disabled={formik.isSubmitting}
						inputProps={{
							"data-testid": "passwordConfirmation",
						}}
						onBlur={formik.handleBlur}
						error={
							formik.touched.passwordConfirmation &&
							Boolean(formik.errors.passwordConfirmation)
						}
						helperText={
							formik.touched.passwordConfirmation &&
							formik.errors.passwordConfirmation
						}
						label={t("profile.security.confirmation-password.label")}
					/>
				</Box>
				<LoadingButton
					variant="contained"
					color="primary"
					size="large"
					type="submit"
					data-testid="submit"
					loading={formik.isSubmitting}
					disabled={formik.isSubmitting}
				>
					{t("profile.security.change-password.button")}
				</LoadingButton>
			</form>
		</SettingsTabPanel>
	);
}
