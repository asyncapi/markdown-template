import { Text } from "@asyncapi/generator-react-sdk";
import { SchemaHelpers } from "../helpers/schema";

import { Header } from "./common";
import { Message } from "./Message";
import { Schema } from "./Schema";

export function Channels({ asyncapi }) {
  const channels = Object.entries(asyncapi.channels()).map(([channelName, channel]) => (
    <Channel channelName={channelName} channel={channel} />
  ));

  return (
    <>
      <Header type={2}>
        Channels
      </Header>
      {channels}
    </>
  );
}

function Channel({ channelName, channel }) {
  return (
    <Text>
      <Header type={3}>
        {`**${channelName}** Channel`}
      </Header>
      {channel.hasDescription() && (
        <Text newLines={2}>
          {channel.description()}
        </Text>
      )}
      {channel.hasParameters() && (
        <Parameters parameters={channel.parameters()} />
      )}
      {channel.hasPublish() && (
        <Operation operation={channel.publish()} />
      )}
      {channel.hasSubscribe() && (
        <Operation operation={channel.subscribe()} />
      )}
    </Text>
  );
}

function Parameters({ parameters }) {
  const parametersSchema = SchemaHelpers.parametersToSchema(parameters);
  return (
    <Text>
      <Header type={4}>Channel Parameters</Header>
      <Schema schema={parametersSchema} hideTitle={true} />
    </Text>
  );
}

function OperationMessages({ messages }) {
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
  )
}

function Operation({ operation }) {
  const type = operation.isPublish() ? 'publish' : 'subscribe';
  const hasMessages = operation.hasMultipleMessages() || !!operation.message(0);
  return (
    <Text>
      <Header type={4}>{`\`${type}\` Operation`}</Header>
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
      {hasMessages && (
        <OperationMessages messages={operation.messages()} />
      )}
    </Text>
  );
}
