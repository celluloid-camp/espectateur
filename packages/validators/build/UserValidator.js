"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validator = require("validator");
function validateSignup(payload) {
    var result = { success: true, errors: {} };
    if (!payload || typeof payload.username !== 'string' ||
        payload.username.trim().length === 0) {
        result.success = false;
        result.errors.username = "UsernameMissing";
    }
    if (!payload || typeof payload.email !== 'string' ||
        !validator.isEmail(payload.email)) {
        result.success = false;
        result.errors.email = 'InvalidEmailFormat';
    }
    if (!payload || typeof payload.password !== 'string' ||
        payload.password.trim().length < 8) {
        result.success = false;
        result.errors.password = 'InvalidPasswordFormat';
    }
    return result;
}
exports.validateSignup = validateSignup;
function validateConfirmationCode(code) {
    var codeRegExp = /^[0-9]{6}$/;
    var trimmedCode = code.replace(/\s/g, '');
    return codeRegExp.test(trimmedCode);
}
exports.validateConfirmationCode = validateConfirmationCode;
function validateConfirmResetPassword(payload) {
    var result = {
        success: true,
        errors: {}
    };
    if (!payload || typeof payload.login !== 'string' ||
        payload.login.trim().length === 0) {
        result.success = false;
        result.errors.login = 'MissingLogin';
    }
    if (!payload || typeof payload.password !== 'string' ||
        payload.password.trim().length < 8) {
        result.success = false;
        result.errors.password = 'InvalidPasswordFormat';
    }
    if (!payload || typeof payload.code !== 'string' ||
        !validateConfirmationCode(payload.code)) {
        result.success = false;
        result.errors.code = "InvalidCodeFormat";
    }
    return result;
}
exports.validateConfirmResetPassword = validateConfirmResetPassword;
function validateConfirmSignup(payload) {
    var result = { success: true, errors: {} };
    if (!payload || typeof payload.login !== 'string' ||
        payload.login.trim().length === 0) {
        result.success = false;
        result.errors.email = 'MissingLogin';
    }
    if (!payload || typeof payload.code !== 'string' ||
        !validateConfirmationCode(payload.code)) {
        result.success = false;
        result.errors.code = "InvalidCodeFormat";
    }
    return result;
}
exports.validateConfirmSignup = validateConfirmSignup;
function validateLogin(payload) {
    var result = { success: true, errors: {} };
    if (!payload || typeof payload.login !== 'string' ||
        payload.login.trim().length === 0) {
        result.success = false;
        result.errors.login = "MissingLogin";
    }
    if (!payload || typeof payload.password !== 'string' ||
        payload.password.trim().length === 0) {
        result.success = false;
        result.errors.password = 'MissingPassword';
    }
    return result;
}
exports.validateLogin = validateLogin;
function validateStudentSignup(payload) {
    var result = { success: true, errors: {} };
    if (!payload || typeof payload.shareCode !== 'string' ||
        payload.shareCode.trim().length === 0) {
        result.success = false;
        result.errors.shareCode = "MissingShareCode";
    }
    if (!payload || typeof payload.username !== 'string' ||
        payload.username.trim().length === 0) {
        result.success = false;
        result.errors.username = "MissingUsername";
    }
    if (!payload || typeof payload.password !== 'string' ||
        payload.password.trim().length < 8) {
        result.success = false;
        result.errors.password = 'InvalidPasswordFormat';
    }
    if (!payload || typeof payload.passwordHint !== 'string' ||
        payload.passwordHint.trim().length === 0) {
        result.success = false;
        result.errors.passwordHint = 'MissingPasswordHint';
    }
    return result;
}
exports.validateStudentSignup = validateStudentSignup;
//# sourceMappingURL=UserValidator.js.map