export const TYPE_LOG = "log";
export const TYPE_WARN = "warn";
export const TYPE_ERROR = "error";

function message(logger, type = TYPE_LOG) {
  console[type](logger);
}
export default message;
