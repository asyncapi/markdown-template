export function getPayloadExamples(msg) {
  const examples = msg.examples();
  if (Array.isArray(examples) && examples.some(e => e.payload)) {
    const messageExamples = examples
      .flatMap(e => {
        if (!e.payload) return;
        return {
          name: e.name,
          summary: e.summary,
          example: e.payload,
        };
      })
      .filter(Boolean);

    if (messageExamples.length > 0) {
      return messageExamples;
    }
  }

  const payload = msg.payload();
  if (payload && payload.examples()) {
    return payload.examples().map(example => ({ example }));
  }

  return;
}

export function getHeadersExamples(msg) {
  const examples = msg.examples();
  if (Array.isArray(examples) && examples.some(e => e.headers)) {
    const messageExamples = examples
      .flatMap(e => {
        if (!e.headers) return;
        return {
          name: e.name,
          summary: e.summary,
          example: e.headers,
        };
      })
      .filter(Boolean);

    if (messageExamples.length > 0) {
      return messageExamples;
    }
  }

  const headers = msg.headers();
  if (headers && headers.examples()) {
    return headers.examples().map(example => ({ example }));
  }

  return;
}
