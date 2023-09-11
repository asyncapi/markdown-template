import { Text } from '@asyncapi/generator-react-sdk';
import { Bindings } from './Bindings';
import { Extensions } from './Extensions';
import { Message } from './Message';
import { Schema } from './Schema';
import { Security } from './Security';
import { Tags } from './Tags';
import { Header, ListItem, Link } from './common';
import { SchemaHelpers } from '../helpers/schema';
import { FormatHelpers } from '../helpers/format';

// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocumentInterface, OperationInterface, OperationReplyInterface, ChannelInterface } from '@asyncapi/parser';

/**
 * @param {{asyncapi: AsyncAPIDocumentInterface}} param0 
 */
export function Operations({ asyncapi }) {
  const channels = asyncapi.channels();
  if (channels.isEmpty()) {
    return null;
  }

  const operationsList = [];
  for (const channel of channels.all()) {
    const channelName = channel.address();
    const operations = channel.operations().all();
    operations.map(operation => {
      let type;
      if (operation.isSend()) {
        if (operation.reply() !== undefined) {
          type = 'request';
        } else {
          type = 'publish';
        }
      } else if (operation.isReceive()) {
        if (operation.reply() !== undefined) {
          type = 'reply';
        } else {
          type = 'subscribe';
        }
      }
      operationsList.push(
        <Operation
          key={`${operation.action()}-${channelName}`}
          type={type}
          asyncapi={asyncapi}
          operation={operation}
          channelName={channelName}
          channel={channel}
        />
      );
    });
  }

  return (
    <>
      <Header type={2}>
        Operations
      </Header>
      {operationsList}
    </>
  );
}

/**
 * @param {{asyncapi: AsyncAPIDocumentInterface, type: string, operation: OperationInterface, channelName: string, channel: ChannelInterface}} param0 
 */
function Operation({ asyncapi, type, operation, channelName, channel }) { // NOSONAR
  if (!operation || !channel) {
    return null;
  }

  const operationId = operation.operationId();
  const externalDocs = operation.externalDocs();
  const applyToAllServers = asyncapi.servers().all().length === channel.servers().all().length;
  const servers = applyToAllServers ? [] : channel.servers().all();
  const security = operation.security();
  let renderedType;
  switch (type) {
  case 'request':
    renderedType = 'REQUEST';
    break;
  case 'publish':
    renderedType = 'PUB';
    break;
  case 'reply':
    renderedType = 'REPLY';
    break;
  case 'subscribe':
    renderedType = 'SUB';
    break;
  }
  const showInfoList = operationId || (servers && servers.length);

  return (
    <Text>
      <Header type={3}>
        {`${renderedType} \`${channelName}\` Operation`}
      </Header>

      {operation.summary() && (
        <Text newLines={2}>
          *{operation.summary()}*
        </Text>
      )}

      {showInfoList ? (
        <Text>
          {operationId && <ListItem>Operation ID: `{operationId}`</ListItem>}
          {servers && servers.length && (
            <ListItem>
              Available only on servers:{' '}
              {servers.map(s => {
                const serverId = s.id();
                const slug = FormatHelpers.slugify(serverId);
                return `[${serverId}](#${slug}-server)`;
              }).join(', ')}
            </ListItem>
          )}
        </Text>
      ) : null}

      {channel.hasDescription() && (
        <Text newLines={2}>
          {channel.description()}
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
            {externalDocs.description() || 'Find more info here.'}
          </Link>
        </Text>
      )}

      <Tags name="Operation tags" item={operation} />

      <OperationParameters channel={channel} />

      <Security security={security} header='Additional security requirements' />

      <Bindings
        name="Channel specific information"
        item={channel}
      />
      <Bindings
        name="Operation specific information"
        item={operation}
      />

      <Extensions name="Channel extensions" item={channel} />
      <Extensions name="Operation extensions" item={operation} />

      <OperationMessages operation={operation} />

      <OperationReply operation={operation} />
    </Text>
  );
}
/**
 * @param {{channel: ChannelInterface}} param0 
 */
function OperationParameters({ channel }) {
  const parameters = SchemaHelpers.parametersToSchema(channel.parameters().all());
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
/**
 * @param {{operation: OperationInterface}} param0 
 */
function OperationMessages({ operation }) {
  const messages = operation.messages().all();
  if (messages.length === 0) {
    return null;
  }

  return (
    <>
      {messages.length > 1 && (
        <Text newLines={2}>
          Accepts **one of** the following messages:
        </Text>
      )}
      {messages.map((msg, idx) => (
        <Message message={msg} key={`message-${idx}`} />
      ))}
    </>
  );
}

/**
 * @param {{operation: OperationInterface}} param0 
 */
function OperationReply({ operation }) {
  const reply = operation.reply();
  if (reply === undefined) {
    return null;
  }
  const explicitChannel = reply.channel();

  let type;
  if (operation.isSend()) {
    type = 'Request';
  } else if (operation.isReceive()) {
    type = 'Response';
  }

  return (
    <Text>
      <Header type={4}>
        {`${type} information`}
      </Header>

      {explicitChannel && <ListItem>{type} should be done to channel: `{explicitChannel.address()}`</ListItem>}

      <OperationReplyAddress name="Operation reply address" reply={reply} />

      <>
        {reply.messages().length > 1 && (
          <Text newLines={2}>
            Accepts **one of** the following messages:
          </Text>
        )}
        {reply.messages().length > 1 && reply.messages().map((msg, idx) => (
          <Message message={msg} key={`message-${idx}`} />
        ))}
      </>
      <Extensions name="Operation reply extensions" item={reply} />
    </Text>
  );
}

/**
 * @param {{reply: OperationReplyInterface}} param0 
 */
function OperationReplyAddress({ reply }) {
  const address = reply.address();
  if (address === undefined) {
    return null;
  }
  const location = address.location();

  return (
    <Text>
      <Header type={4}>
        {'Operation reply address information'}
      </Header>

      {address.hasDescription() && (
        <Text newLines={2}>
          {address.description()}
        </Text>
      )}

      <ListItem>Operation reply address location: `{location}`</ListItem>

      <Extensions name="Operation reply address extensions" item={address} />
    </Text>
  );
}
