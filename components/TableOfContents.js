import { Text, Indent, IndentationTypes } from '@asyncapi/generator-react-sdk';

import { FormatHelpers } from '../helpers/format';
import { CommonHelpers } from '../helpers/common';

import { Header, Link, ListItem } from './common';

export function TableOfContents({asyncapi}) {
  const servers = asyncapi.servers().all();
  const operations = asyncapi.operations().all();
  const isV3Doc = CommonHelpers.isV3(asyncapi);

  return (
    <>
      <Header type={2}>Table of Contents</Header>
      <Text>
        {servers.length > 0 && (
          <>
            <ListItem>
              <Link href="#servers">Servers</Link>
            </ListItem>
            {servers.map((server) => {
              const serverName = server.id();
              return (
                <Indent
                  size={2}
                  type={IndentationTypes.SPACES}
                  key={serverName}
                >
                  <ListItem>
                    <Link href={`#${FormatHelpers.slugify(
                      serverName)}-server`}>
                      {serverName}
                    </Link>
                  </ListItem>
                </Indent>
              );
            })}
          </>
        )}
        {operations.length > 0 && (
          <>
            <ListItem>
              <Link href="#operations">Operations</Link>
            </ListItem>
            {operations.map((operation) => {
              const channel = operation.channels().all()[0];
              const channelAddress = channel?.address() ?? '';
              const type = CommonHelpers.getOperationType(operation, asyncapi);
              const typeToRender = isV3Doc ? type : type.slice(0, 3);

              return (
                <Indent
                  size={2}
                  type={IndentationTypes.SPACES}
                  key={`${typeToRender}-${channelAddress}`}
                >
                  <ListItem>
                    <Link
                      href={`#${typeToRender}-${FormatHelpers.slugify(
                        channelAddress)}-operation`}
                    >
                      {typeToRender.toUpperCase()} {channelAddress}
                    </Link>
                  </ListItem>
                </Indent>
              );
            })}
          </>
        )}
      </Text>
    </>
  );
}
