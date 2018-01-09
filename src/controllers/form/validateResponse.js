import Joi from "joi";
import { builder as joiJSON } from "joi-json";
import { capitalize } from "../../utilities";

const joiJSONBuilder = joiJSON();
const parseJoiValidation = val => joiJSONBuilder.build(val);

function typeSchema(field) {
  const type = field.type || "string";
  // Special fields
  switch (field.name) {
    case "email":
      return Joi.string().email();
    case "mobile":
      // https://stackoverflow.com/a/35286734/675101
      return Joi.string().regex(/^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/, "mobile");
  }
  switch (type) {
    case "string":
      return Joi.string().max(256);
  }
}

function formSchema(fields) {
  let schema = {};
  fields.forEach(field => {
    let sc = field.validation
      ? parseJoiValidation(field.validation)
      : typeSchema(field);
    sc = sc.label(field.label || capitalize(field.name));
    if (!field.optional) sc = sc.required();
    schema[field.name] = sc;
  });
  return Joi.object().keys(schema);
}

export default function validateResponse(form, response) {
  const schema = formSchema(form.fields);
  let error = Joi.validate(response, schema, { abortEarly: false }).error;
  let errors = null;
  if (error) {
    errors = {};
    error.details.forEach(detail => {
      let key = detail.path;
      key = Array.isArray(key) ? key[0] : key;
      errors[key] = errors[key]
        ? errors[key] + " " + detail.message + "."
        : detail.message + ".";
    });
  }
  return errors;
}
