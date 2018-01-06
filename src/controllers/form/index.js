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
  const { user, form } = ctx.state;
  try {
    let { response } = ctx.request.body;
    response = JSON.parse(response);
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
