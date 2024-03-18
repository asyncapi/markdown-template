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
  asyncapi.operations().all().map(operation => {
    const operationId = operation.id();
      if (operation.action() === 'send') {
        operationsList.push(
          <Indent size={2} type={IndentationTypes.SPACES} key={`pub-${operationId}`}>
            <ListItem>
              <Link href={`#pub-${FormatHelpers.slugify(operationId)}-operation`}>PUB {operationId}</Link>
            </ListItem>
          </Indent>
        );
      }
      if (operation.action() === 'receive') {
        operationsList.push(
          <Indent size={2} type={IndentationTypes.SPACES} key={`sub-${operationId}`}>
            <ListItem>
              <Link href={`#sub-${FormatHelpers.slugify(operationId)}-operation`}>SUB {operationId}</Link>
            </ListItem>
          </Indent>
        );
      }
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
