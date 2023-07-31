import { sample } from 'openapi-sampler';

export class MessageHelpers {
  static getPayloadExamples(message) {
    const examples = message.examples().all();
    if (Array.isArray(examples) && examples.some(e => e.payload())) {
      const messageExamples = examples
        .map(e => {
          if (!e.payload()) return;
          return {
            name: e.name(),
            summary: e.summary(),
            example: e.payload(),
          };
        })
        .filter(Boolean);
  
      if (messageExamples.length > 0) {
        return messageExamples;
      }
    }
  
    const payload = message.payload();
    if (payload?.examples()) {
      return payload.examples().map(example => ({ example }));
    }
  }
  
  static getHeadersExamples(message) {
    const examples = message.examples().all();
    if (Array.isArray(examples) && examples.some(e => e.headers())) {
      const messageExamples = examples
        .map(e => {
          if (!e.headers()) return;
          return {
            name: e.name(),
            summary: e.summary(),
            example: e.headers(),
          };
        })
        .filter(Boolean);
  
      if (messageExamples.length > 0) {
        return messageExamples;
      }
    }
  
    const headers = message.headers();
    if (headers?.examples()) {
      return headers.examples().map(example => ({ example }));
    }
  }

  static generateExample(value, options) {
    return JSON.stringify(sample(value, options || {}) || '', null, 2);
  }
}
