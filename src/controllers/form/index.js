import Response from "../../models/Response";
import getForm from "./getForm";
import validateResponse from "./validateResponse";

export async function get(ctx) {
  const { formslug } = ctx.params;
  const form = await getForm(formslug);
  if (form) {
    ctx.body = form;
    ctx.body.response = await getResponse(formslug, ctx.state.user);
  } else ctx.status = 404;
}

async function getResponse(formslug, user) {
  try {
    const response = await Response.findOne({
      where: {
        formslug,
        userUsername: user.username
      }
    });
    return response;
  } catch (e) {
    return false;
  }
}

export async function postResponse(ctx) {
  const { formslug } = ctx.params;
  const form = await getForm(formslug);
  if (!form) {
    ctx.status = 404;
    return;
  }
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
      userUsername: ctx.state.user.username
    });
    ctx.body = { success: true, response: responseInDb };
  } catch (e) {
    ctx.status = 400;
  }
}
