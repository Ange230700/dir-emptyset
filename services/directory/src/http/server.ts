// services\directory\src\http\server.ts

import { app } from './app.js';

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`[directory] HTTP API listening on http://localhost:${port}`);
});
