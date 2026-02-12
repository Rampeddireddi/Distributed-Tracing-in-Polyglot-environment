from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry import trace
import os

resource = Resource.create({"service.name": os.getenv("SERVICE_NAME")})
provider = TracerProvider(resource=resource)
trace.set_tracer_provider(provider)

processor = BatchSpanProcessor(
    OTLPSpanExporter(endpoint=os.getenv("OTLP_EXPORTER_ENDPOINT"), insecure=True)
)
provider.add_span_processor(processor)
