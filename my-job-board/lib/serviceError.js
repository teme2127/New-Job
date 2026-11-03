export class ServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
  }
}

export function serviceFailure(error) {
  if (error?.code === "DATABASE_CONFIGURATION") {
    return { code: error.code, error: "Account services are not configured yet. Please contact support." };
  }
  if (error?.code === "SESSION_CONFIGURATION") {
    return { code: error.code, error: "Sign-in is not configured yet. Please contact support." };
  }
  // MongoDB can wrap authentication failures inside a connection error.
  if ([error, error?.cause, error?.reason].some(item => item?.code === 18 || item?.code === 8000 || item?.codeName === "AuthenticationFailed")) {
    return { code: "DATABASE_AUTHENTICATION", error: "Account services cannot access the database. Please contact support." };
  }
  if (["MongoParseError", "MongoInvalidArgumentError"].includes(error?.name)) {
    return { code: "DATABASE_CONFIGURATION", error: "Account services are not configured correctly. Please contact support." };
  }
  if (["MongooseServerSelectionError", "MongoServerSelectionError", "MongoNetworkError", "MongoNetworkTimeoutError"].includes(error?.name)) {
    return { code: "DATABASE_UNAVAILABLE", error: "We can’t connect to the account database right now. Please try again shortly." };
  }
  return { code: "SERVICE_UNAVAILABLE", error: "We couldn’t complete your request right now. Please try again later." };
}
