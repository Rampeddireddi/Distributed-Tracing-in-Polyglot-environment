require("./tracing");

const express = require("express");
const { trace } = require("@opentelemetry/api");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

app.post("/check", (req, res) => {
  const span = trace.getActiveSpan();

  if (span) span.addEvent("inventory_checked");

  const sku = req.body.items[0].sku;

if (["OUT", "FAIL", "ERROR"].includes(sku)) {
  span.setAttribute("error", true);  //pass sku=OUT/FAIL/ERROR as attribute to span
  return res.status(400).json({ error: "out of stock" });
}

  res.json({ ok: true });
});

app.listen(8001, () => console.log("inventory_service running"));
