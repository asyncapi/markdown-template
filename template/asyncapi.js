import { File, Text } from "@asyncapi/generator-react-sdk";

import { Header, Link, ListItem } from "../partials/common";
import { Info, TermsOfService } from "../partials/Info";
import { Servers } from "../partials/Servers";
import { Channels } from "../partials/Channels";

export default function({ asyncapi, params }) {
  return (
    <File name={params.outFilename || 'asyncapi.md'}>
      <Info asyncapi={asyncapi} />
      <TableOfContents asyncapi={asyncapi} />
      <TermsOfService asyncapi={asyncapi} />
      <Servers asyncapi={asyncapi} />
      <Channels asyncapi={asyncapi} />
    </File>
  );
}

function TableOfContents({ asyncapi }) {
  return (
    <>
      <Header type={2}>Table of Contents</Header>
      <Text>
        {asyncapi.info().termsOfService() && 
          <ListItem>
            <Link href="#terms-of-service">Terms of Service</Link>
          </ListItem>
        }
        {asyncapi.hasServers() && 
          <ListItem>
            <Link href="#servers">Servers</Link>
          </ListItem>
        }
        {asyncapi.hasChannels() && 
          <ListItem>
            <Link href="#channels">Channels</Link>
          </ListItem>
        }
      </Text>
    </>
  );
}
