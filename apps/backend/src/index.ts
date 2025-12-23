import app from "./app";
import { loadEnv } from "./config/env";

loadEnv();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Trading Platform API Gateway is running");
});

