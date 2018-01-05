import getForm from "./getForm";

export async function get(ctx) {
  const { formslug } = ctx.params;
  const form = await getForm(formslug);
  if (form) ctx.body = form;
  else ctx.status = 404;
}
