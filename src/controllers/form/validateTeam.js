import Joi from "joi";

export default function validateTeam(field, value) {
  let member_data_val = Joi.object();
  field.data.fields.forEach(
    f =>
      (member_data_val = member_data_val.keys({
        [f]: Joi.string()
          .max(256)
          .required()
      }))
  );
  const team_size = (value && value.team_size) || 1;
  let sc = Joi.object({
    team_size: Joi.number()
      .min(field.data.min)
      .max(field.data.max)
  });
  if (team_size != 1)
    sc = sc.keys({
      member_data: Joi.array()
        .length(team_size - 1)
        .items(member_data_val)
    });
  else sc = sc.keys({ member_data: Joi.array().length(0) });
  return sc;
}
