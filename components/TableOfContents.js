import { Text, Indent, IndentationTypes } from '@asyncapi/generator-react-sdk';

import { Header, Link, ListItem } from '../components/common';

import { FormatHelpers } from '../helpers/format';

export function TableOfContents({ asyncapi }) {
  const serversList = asyncapi.servers().all().map(server => {
    const serverName = server.id();
    return (
      <Indent size={2} type={IndentationTypes.SPACES} key={serverName}>
        <ListItem>
          <Link href={`#${FormatHelpers.slugify(serverName)}-server`}>{serverName}</Link>
        </ListItem>
      </Indent>
    );
  });

  const operationsList = [];
  asyncapi.channels().all().map(channel => {
    const channelName = channel.address();
    channel.operations().all().forEach(operation => {
      if (operation.action() === 'publish') {
        operationsList.push(
          <Indent size={2} type={IndentationTypes.SPACES} key={`pub-${channelName}`}>
            <ListItem>
              <Link href={`#pub-${FormatHelpers.slugify(channelName)}-operation`}>PUB {channelName}</Link>
            </ListItem>
          </Indent>
        );
      }
      if (operation.action() === 'subscribe') {
        operationsList.push(
          <Indent size={2} type={IndentationTypes.SPACES} key={`sub-${channelName}`}>
            <ListItem>
              <Link href={`#sub-${FormatHelpers.slugify(channelName)}-operation`}>SUB {channelName}</Link>
            </ListItem>
          </Indent>
        );
      }
    });
  });

  return (
    <>
      <Header type={2}>Table of Contents</Header>
      <Text>
        {serversList.length > 0 && (
          <>
            <ListItem>
              <Link href="#servers">Servers</Link>
            </ListItem>
            {serversList}
          </>
        )}
        {operationsList.length > 0 && (
          <>
            <ListItem>
              <Link href="#operations">Operations</Link>
            </ListItem>
            {operationsList}
          </>
        )}
      </Text>
    </>
  );
}
