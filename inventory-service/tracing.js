const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");
const { resourceFromAttributes } = require("@opentelemetry/resources");

const exporter = new OTLPTraceExporter({
  url: process.env.OTLP_EXPORTER_ENDPOINT,
});

const sdk = new NodeSDK({
  traceExporter: exporter,
  resource: resourceFromAttributes({
    "service.name": process.env.SERVICE_NAME,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
