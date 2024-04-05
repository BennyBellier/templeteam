/**
 * Enumeration of errors when try to login
 */
enum LoginErrors {
  INVALID_PASSWORD = "INVALID_PASSWORD",
  MISSING_PASSWORD = "MISSING_PASSWORD",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_PASSWORD_MISSMATCH = "USER_PASSWORD_MISSMATCH",
}

export default LoginErrors;
