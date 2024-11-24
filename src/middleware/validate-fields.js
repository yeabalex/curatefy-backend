class ValidateFields {
  static validateReqBody = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      next();
    };
  };

  static validateReqQuery = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.query);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      next();
    };
  };
}
module.exports = ValidateFields;
