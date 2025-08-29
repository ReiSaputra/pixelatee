import dotenv from "dotenv";

import { web } from "./application/web";

dotenv.config();

web.listen(process.env.PORT || 3000, () => {
  console.info(`Server started on http://localhost:${process.env.PORT || 3000}`);
});
