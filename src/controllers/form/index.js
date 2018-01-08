import Response from "../../models/Response";
import validateResponse from "./validateResponse";

export async function get(ctx) {
  const { formslug } = ctx.params;
  const { user, form } = ctx.state;
  ctx.body = form;
  ctx.body.response = await getResponse(formslug, user);
}

async function getResponse(formslug, user) {
  const response = await Response.findOne({
    where: {
      formslug,
      userUsername: user.username
    }
  });
  return response;
}

export async function postResponse(ctx) {
  const { formslug } = ctx.params;
  const { user, userinfo, form } = ctx.state;
  if (!form.multipleResponses && (await getResponse(formslug, user))) {
    ctx.body = { success: false, errors: { _meta: "Form already filled" } };
    ctx.status = 403;
    return;
  }
  try {
    let { response } = ctx.request.body;
    response = JSON.parse(response);
    form.fields.forEach(field => {
      if (!field.server) return;
      response[field.name] = userinfo[field.userinfo_attr || field.name];
    });
    const errors = validateResponse(form, response);
    if (errors) {
      ctx.body = { success: false, errors };
      ctx.status = 400;
      return;
    }
    const responseInDb = await Response.create({
      response,
      formslug,
      userUsername: user.username
    });
    ctx.body = { success: true, response: responseInDb };
  } catch (e) {
    ctx.status = 400;
  }
}

export async function getResponses(ctx) {
  const { formslug } = ctx.params;
  const { form } = ctx.state;
  if (!form.isAdmin) {
    ctx.status = 403;
    return;
  } else {
    const responses = await Response.findAll({
      where: {
        formslug
      }
    });
    ctx.body = responses;
  }
}
