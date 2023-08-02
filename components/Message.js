import { IndentationTypes, Text } from '@asyncapi/generator-react-sdk';

import { Bindings } from './Bindings';
import { Extensions } from './Extensions';
import { Schema } from './Schema';
import { Tags } from './Tags';
import { Header, ListItem, Link, BlockQuote, CodeBlock, NewLine } from './common';

import { MessageHelpers } from '../helpers/message';

export function Message({ message }) { // NOSONAR
  if (!message) {
    return null;
  }

  // check typeof as fallback for older version than `2.4.0`
  const messageId = typeof message.messageId === 'function' && message.messageId();
  const headers = message.headers();
  const payload = message.payload();
  const correlationId = message.correlationId();
  const contentType = message.contentType();
  const externalDocs = message.externalDocs();
  const showInfoList = contentType || externalDocs;

  let header = 'Message';
  if (message.title()) {
    header += ` ${message.title()}`;
  }
  const id = message.messageId() || message.name() || message.id();
  if (id) {
    header += ` \`${id}\``;
  }

  return (
    <>
      <Header type={4}>{header}</Header>

      {message.summary() && (
        <Text newLines={2}>
          *{message.summary()}*
        </Text>
      )}

      {showInfoList ? (
        <Text>
          {messageId && <ListItem>Message ID: `{messageId}`</ListItem>}
          {contentType && (
            <ListItem>
              Content type:{' '}
              <Link
                href={`https://www.iana.org/assignments/media-types/${contentType}`}
              >
                {contentType}
              </Link>
            </ListItem>
          )}
          {correlationId && (
            <>
              <ListItem>
                Correlation ID: `{correlationId.location()}`
              </ListItem>
              {correlationId.hasDescription() && (
                <>
                  <NewLine />
                  <Text indent={2} type={IndentationTypes.SPACES}>
                    {correlationId.description()}
                  </Text>
                </>
              )}
            </>
          )}
        </Text>
      ) : null}

      {message.hasDescription() && (
        <Text newLines={2}>
          {message.description()}
        </Text>
      )}

      {externalDocs && (
        <Text newLines={2}>
          <Link
            href={externalDocs.url()}
          >
            {externalDocs.description() || 'Find more info here.'}
          </Link>
        </Text>
      )}

      {headers && (
        <>
          <Header type={5}>Headers</Header>
          <Schema schema={headers} hideTitle={true} />
          <Examples type='headers' message={message} />
        </>
      )}

      {payload && (
        <>
          <Header type={5}>Payload</Header>
          <Schema schema={payload} hideTitle={true} />
          <Examples type='payload' message={message} />
        </>
      )}

      <Bindings
        name="Message specific information"
        item={message}
      />
      <Extensions name="Message extensions" item={message} />

      <Tags name="Message tags" item={message} />
    </>
  );
}

function Examples({ type = 'headers', message }) {
  if (type === 'headers') {
    const ex = MessageHelpers.getHeadersExamples(message);
    if (ex) {
      return (
        <>
          <BlockQuote>Examples of headers</BlockQuote>
          <ExamplesRenderer examples={ex} />
        </>
      );
    }

    const headers = message.headers();
    if (!headers) {
      return null;
    }

    return (
      <>
        <BlockQuote>Examples of headers _(generated)_</BlockQuote>
        <Text newLines={2}>
          <CodeBlock language='json'>{MessageHelpers.generateExample(headers.json())}</CodeBlock>
        </Text>
      </>
    );
  } 
  
  const examples = MessageHelpers.getPayloadExamples(message);
  if (examples) {
    return (
      <>
        <BlockQuote>Examples of payload</BlockQuote>
        <ExamplesRenderer examples={examples} />
      </>
    );
  }

  const payload = message.payload();
  if (!payload) {
    return null;
  }

  return (
    <>
      <BlockQuote>Examples of payload _(generated)_</BlockQuote>
      <Text newLines={2}>
        <CodeBlock language='json'>{MessageHelpers.generateExample(payload.json())}</CodeBlock>
      </Text>
    </>
  );
}

function ExamplesRenderer({ examples }) {
  if (examples.length === 0) {
    return null;
  }
  
  return examples.map((ex, idx) => (
    <Text newLines={2} key={idx}>
      {ex.name && <Text newLines={2}>_{ex.name}_</Text>}
      {ex.summary && <Text newLines={2}>{ex.summary}</Text>}
      <CodeBlock language='json'>{JSON.stringify(ex.example, null, 2)}</CodeBlock>
    </Text>
  ));
}
