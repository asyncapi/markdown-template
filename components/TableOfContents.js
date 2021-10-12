import { Text, Indent, IndentationTypes } from "@asyncapi/generator-react-sdk";

import { Header, Link, ListItem } from "../components/common";

import { FormatHelpers } from "../helpers/format";

export function TableOfContents({ asyncapi }) {
  const serversList = Object.keys(asyncapi.servers()).map(serverName => {
    return (
      <Indent size={2} type={IndentationTypes.SPACES} key={serverName}>
        <ListItem>
          <Link href={`#${FormatHelpers.slugify(serverName)}-server`}>{serverName}</Link>
        </ListItem>
      </Indent>
    );
  });
  const operationsList = [];
  Object.entries(asyncapi.channels()).map(([channelName, channel]) => {
    if (channel.hasPublish()) {
      operationsList.push(
        <Indent size={2} type={IndentationTypes.SPACES} key={`pub-${channelName}`}>
          <ListItem>
            <Link href={`#pub-${FormatHelpers.slugify(channelName)}-operation`}>PUB {channelName}</Link>
          </ListItem>
        </Indent>
      );
    }
    if (channel.hasSubscribe()) {
      operationsList.push(
        <Indent size={2} type={IndentationTypes.SPACES} key={`sub-${channelName}`}>
          <ListItem>
            <Link href={`#sub-${FormatHelpers.slugify(channelName)}-operation`}>SUB {channelName}</Link>
          </ListItem>
        </Indent>
      );
    }
  });

  return (
    <>
      <Header type={2}>Table of Contents</Header>
      <Text>
        {asyncapi.hasServers() && 
          <ListItem>
            <Link href="#servers">Servers</Link>
          </ListItem>
        }
        {serversList.length > 0 && serversList}
        {asyncapi.hasChannels() && 
          <ListItem>
            <Link href="#operations">Operations</Link>
          </ListItem>
        }
        {operationsList.length > 0 && operationsList}
      </Text>
    </>
  );
}
