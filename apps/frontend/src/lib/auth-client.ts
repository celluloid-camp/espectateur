import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import type { auth } from "@celluloid/auth";
import { signupAsStudentClient } from "@celluloid/auth/plugins"


export const authClient = createAuthClient({
  plugins: [signupAsStudentClient(), usernameClient(), emailOTPClient(), inferAdditionalFields<typeof auth>()],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

export const { signIn, signUp, signOut, useSession } = authClient;
