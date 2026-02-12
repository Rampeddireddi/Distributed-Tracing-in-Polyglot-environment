from fastapi import FastAPI
from opentelemetry import trace
import uuid
import tracing

app = FastAPI()
tracer = trace.get_tracer(__name__)

@app.get("/health")
def health():
    return {"status": "UP"}

@app.post("/create")
def create_order(body: dict):
    with tracer.start_as_current_span("process_order") as span:
        order_id = str(uuid.uuid4())
        span.set_attribute("user.id", body["userId"])
        span.set_attribute("order.id", order_id)
        return {"orderId": order_id}
