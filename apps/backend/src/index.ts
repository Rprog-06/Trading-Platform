
import { loadEnv } from "./config/env";

loadEnv();
import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Trading Platform API Gateway is running");
});

