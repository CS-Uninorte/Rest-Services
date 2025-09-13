import { buildApp } from "./app";

const PORT = Number(process.env.PORT || 3000);
const app = buildApp();

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
