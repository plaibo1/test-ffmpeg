import { app } from "./app";

const port = 8000;

app.listen(port, () => {
  console.log(`Server get started on ${port} port`);
  console.log(`http://localhost:${port}`);
});
