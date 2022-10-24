import { Credentials, SigninResult, StudentSignupData, TeacherConfirmData, TeacherConfirmResetPasswordData, TeacherSignupData } from '@celluloid/types';
export declare function validateSignup(payload: TeacherSignupData): SigninResult;
export declare function validateConfirmationCode(code: string): boolean;
export declare function validateConfirmResetPassword(payload: TeacherConfirmResetPasswordData): SigninResult;
export declare function validateConfirmSignup(payload: TeacherConfirmData): SigninResult;
export declare function validateLogin(payload: Credentials): SigninResult;
export declare function validateStudentSignup(payload: StudentSignupData): SigninResult;
