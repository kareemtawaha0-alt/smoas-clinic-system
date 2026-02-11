import createError from "http-errors";

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (e) {
      next(createError(400, e.errors?.map(x => x.message).join(", ") || "Validation error"));
    }
  };
}
