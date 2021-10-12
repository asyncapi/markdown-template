import { Text } from "@asyncapi/generator-react-sdk";

import { Header, ListItem } from "./common";

import { SchemaHelpers } from "../helpers/schema";

export function Operations({ asyncapi }) {
  const channels = asyncapi.channels();
  if (!Object.keys(channels).length) {
    return null;
  }

  const operationsList = [];
  Object.entries(channels).forEach(([channelName, channel]) => {
    if (channel.hasPublish()) {
      operationsList.push(
        <Operation
          key={`pub-${channelName}`}
          type='publish'
          operation={channel.publish()}
          channelName={channelName}
          channel={channel}
        />
      );
    }
    if (channel.hasSubscribe()) {
      operationsList.push(
        <Operation
          key={`sub-${channelName}`}
          type='subscribe'
          operation={channel.subscribe()}
          channelName={channelName}
          channel={channel}
        />
      );
    }
  });

  return (
    <>
      <Header type={2}>
        Operations
      </Header>
      {channels}
    </>
  );
}

function Operation({ type, operation, channelName, channel }) {
  if (!operation || !channel) {
    return null;
  }

  const operationId = operation.id();
  const externalDocs = operation.externalDocs();
  // check typeof as fallback for older version than `2.2.0`
  const servers = typeof channel.servers === 'function' && channel.servers();
  const renderedType = type === 'publish' ? 'PUB' : 'SUB';

  return (
    <Text>
      <Header type={3}>
        {`${renderedType} \`${channelName}\` Operation`}
      </Header>

      {operationId || (servers && servers.length) ? (
        <Text>
          {operationId && <ListItem>Operation ID: `{operationId}`</ListItem>}
          {/* make link to server and reuse FormatHelpers */}
          {servers && servers.length && <ListItem>Available only on servers: {servers.map(s => `\`${s}\``)}</ListItem>}
        </Text>
      ) : null}

      {channel.hasDescription() && (
        <Text newLines={2}>
          {channel.description()}
        </Text>
      )}
      {operation.summary() && (
        <Text newLines={2}>
          *{operation.summary()}*
        </Text>
      )}
      {operation.hasDescription() && (
        <Text newLines={2}>
          {operation.description()}
        </Text>
      )}

      {externalDocs && (
        <Text newLines={2}>
          <Link
            href={externalDocs.url()}
          >
            {externalDocs.hasDescription() ? externalDocs.description() : 'Find more info here.'}
          </Link>
        </Text>
      )}

      {operation.hasTags() && (
        <>
          <Header type={6}>Tags</Header>
          <Tags tags={operation.tags()} />
        </>
      )}

      <OperationParameters channel={channel} />
      <OperationMessages operation={operation} />
    </Text>
  );
}

function OperationParameters({ channel }) {
  const parameters = SchemaHelpers.parametersToSchema(channel.parameters());
  if (!parameters) {
    return null;
  }

  return (
    <Text>
      <Header type={4}>Parameters</Header>
      <Schema schema={parameters} hideTitle={true} />
    </Text>
  );
}

function OperationMessages({ operation }) {
  const hasMessages = operation.hasMultipleMessages() || !!operation.message(0);
  if (!hasMessages) {
    return null;
  }
  const messages = operation.messages();

  return (
    <>
      {messages.length > 1 && 
        <Text newLines={2}>
          Accepts **one of** the following messages:
        </Text>
      }
      {messages.map(msg => (
        <Message title={`Message \`${msg.uid()}\``} message={msg} />
      ))
      }
    </>
  );
}