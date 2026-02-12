from fastapi import FastAPI
import tracing

from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

app = FastAPI()

FastAPIInstrumentor.instrument_app(app)


@app.get("/health")
def health():
    return {"status": "UP"}


@app.post("/notify")
def notify(body: dict):
    return {"sent": True}
