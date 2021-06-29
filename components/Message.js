import { Text } from "@asyncapi/generator-react-sdk";
import { generateExample, getPayloadExamples, getHeadersExamples } from "@asyncapi/generator-filters";

import { Header, CodeBlock, BlockQuote, Tags } from "./common";
import { Schema } from "./Schema";

export function Message({ message, title = 'Message' }) {
  return (
    <>
      <Header type={5}>{title}</Header>
      {message.summary() && (
        <Text newLines={2}>
          *{message.summary()}*
        </Text>
      )}
      {message.hasDescription() && (
        <Text newLines={2}>
          {message.description()}
        </Text>
      )}

      {message.headers() && (
        <>
          <Header type={6}>Headers</Header>
          <Schema schema={message.headers()} schemaName='Message Headers' hideTitle={true} />
          <Examples type='headers' message={message} />
        </>
      )}

      {message.payload() && (
        <>
          <Header type={6}>Payload</Header>
          <Schema schema={message.payload()} schemaName='Message Payload' hideTitle={true} />
          <Examples type='payload' message={message} />
        </>
      )}

      {message.hasTags() && (
        <>
          <Header type={6}>Tags</Header>
          <Tags tags={message.tags()} />
        </>
      )}
    </>
  )
}

function Examples({ type = 'headers', message }) {
  if (type === 'headers') {
    const examples = getHeadersExamples(message);
    if (examples) {
      return (
        <>
          <BlockQuote>Examples of headers</BlockQuote>
          <Example examples={examples} />
        </>
      );
    }

    return (
      <>
        <BlockQuote>Examples of headers _(generated)_</BlockQuote>
        <Text newLines={2}>
          <CodeBlock language='json'>{generateExample(message.headers().json())}</CodeBlock>
        </Text>
      </>
    );
  } else {
    const examples = getPayloadExamples(message);
    if (examples) {
      return (
        <>
          <BlockQuote>Examples of payload</BlockQuote>
          <Example examples={examples} />
        </>
      );
    }

    return (
      <>
        <BlockQuote>Examples of payload _(generated)_</BlockQuote>
        <Text newLines={2}>
          <CodeBlock language='json'>{generateExample(message.payload().json())}</CodeBlock>
        </Text>
      </>
    );
  }
}

function Example({ examples = [] }) {
  if (examples.length === 0) {
    return null;
  }
  
  return examples.map(ex => (
    <Text newLines={2}>
      {ex.name && <Text newLines={2}>**{ex.name}**</Text>}
      {ex.summary && <Text newLines={2}>{ex.summary}</Text>}
      <CodeBlock language='json'>{JSON.stringify(ex.example, null, 2)}</CodeBlock>
    </Text>
  ))
}
