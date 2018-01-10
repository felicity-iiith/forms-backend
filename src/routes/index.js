import compose from "koa-compose";

import main from "./main";
import user from "./user";
import form from "./form";
import payment from "./payment";
import generateApiDocs from "./swagger";

const routers = [main, user, form, payment];

if (process.env.NODE_ENV != "production") {
  const docsRouter = generateApiDocs(routers);
  routers.push(docsRouter);
}

export default compose(routers.map(router => router.middleware()));
