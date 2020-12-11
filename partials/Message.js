import { Text } from "@asyncapi/generator-react-sdk";
import { generateExample, getHeadersExamples, getPayloadExamples } from "@asyncapi/generator-filters";

import { Header, ListItem, CodeBlock } from "../partials/common";
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
          <Example type='headers' message={message} />
        </>
      )}

      {message.payload() && (
        <>
          <Header type={6}>Payload</Header>
          <Schema schema={message.payload()} schemaName='Message Payload' hideTitle={true} />
          <Example type='payload' message={message} />
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

function Tags({ tags = [] }) {
  return (
    <Text>
      {tags.map(tag => (
        <ListItem>{tag.name()}</ListItem>
      ))}
    </Text>
  );
}

function Example({ type = 'headers', message }) {
  if (type === 'headers') {
    const examples = getHeadersExamples(message);
    if (examples) {
      return (
        <>
          <Header type={6}>Examples of headers</Header>
          {examples.map(ex => (
            <Text newLines={2}>
              <CodeBlock language='json'>{JSON.stringify(ex, null, 2)}</CodeBlock>
            </Text>
          ))}
        </>
      );
    }

    return (
      <>
        <Header type={6}>Examples of headers _(generated)_</Header>
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
          <Header type={6}>Examples of payload</Header>
          {examples.map(ex => (
            <Text newLines={2}>
              <CodeBlock language='json'>{JSON.stringify(ex, null, 2)}</CodeBlock>
            </Text>
          ))}
        </>
      );
    }

    return (
      <>
        <Header type={6}>Examples of payload _(generated)_</Header>
        <Text newLines={2}>
          <CodeBlock language='json'>{generateExample(message.payload().json())}</CodeBlock>
        </Text>
      </>
    );
  }
}