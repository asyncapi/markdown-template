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

export function Operations({ asyncapi }) {
  const channels = asyncapi.channels();
  if (channels.isEmpty()) {
    return null;
  }

  const operationsList = [];
  channels.all().map(channel => {
    const channelName = channel.address();
    channel.operations().all().forEach(operation => {
      let type;
      if (operation.isSend()) {
        if (operation.reply() !== undefined) {
          type = 'request';
        } else {
          type = 'publish';
        }
      } else if (operation.isReceive()) {
        if (operation.reply() !== undefined) {
          type = 'response';
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
  });

  return (
    <>
      <Header type={2}>
        Operations
      </Header>
      {operationsList}
    </>
  );
}

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
  case 'response':
    renderedType = 'RESPONSE';
    break;
  case 'SUB':
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

function OperationReply({ operation }) {
  const reply = operation.reply();
  if (reply === undefined) {
    return null;
  }
  const replyId = reply.id();
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

      {replyId && <ListItem>Operation reply ID: `{replyId}`</ListItem>}

      {explicitChannel && <ListItem>{type} should be done to channel: `{reply.channel().address()}`</ListItem>}

      <OperationReplyAddress name="Operation reply address" item={reply} />

      <>
        {reply.messages().length > 1 && (
          <Text newLines={2}>
            Accepts **one of** the following messages:
          </Text>
        )}
        {reply.messages().map((msg, idx) => (
          <Message message={msg} key={`message-${idx}`} />
        ))}
      </>
      <Extensions name="Operation reply extensions" item={reply} />
    </Text>
  );
}

/**
 * Check if we need to render
 */
function OperationReplyAddress({ reply }) {
  const address = reply.address();
  if (address === undefined) {
    return null;
  }
  const addressId = address.id();
  const location = address.location();

  return (
    <Text>
      <Header type={4}>
        {'Operation reply address information'}
      </Header>

      {addressId && <ListItem>Operation reply address ID: `{addressId}`</ListItem>}
      <ListItem>Operation reply address location: `{location}`</ListItem>

      {address.hasDescription() && (
        <Text newLines={2}>
          {address.description()}
        </Text>
      )}

      <Extensions name="Operation reply address extensions" item={address} />
    </Text>
  );
}
