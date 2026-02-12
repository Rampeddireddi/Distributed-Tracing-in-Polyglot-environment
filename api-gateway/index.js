require("./tracing");

const express = require("express");
const axios = require("axios");
const { trace } = require("@opentelemetry/api");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

app.post("/api/orders", async (req, res) => {
  try {
    await axios.post("http://inventory_service:8001/check", req.body);
    const order = await axios.post("http://order_service:8002/create", req.body);
    await axios.post("http://notification_service:8003/notify", req.body);

    const span = trace.getActiveSpan();
    const traceId = span.spanContext().traceId;

    res.status(201).json({
      orderId: order.data.orderId,
      status: "CREATED",
      traceId,
    });
  } catch (e) {
    res.status(500).json({ error: "failed" });
  }
});

app.listen(8080, () => console.log("api_gateway running"));
