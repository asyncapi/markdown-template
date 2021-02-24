import { File, Text } from "@asyncapi/generator-react-sdk";

import { Header, Link, ListItem } from "../components/common";
import { Info, TermsOfService } from "../components/Info";
import { Servers } from "../components/Servers";
import { Channels } from "../components/Channels";
import { FrontMatter } from "../components/FrontMatter";

export default function({ asyncapi, params }) {
  return (
    <File name={params.outFilename || 'asyncapi.md'}>
      <FrontMatter asyncapi={asyncapi} params={params} />
      <Info asyncapi={asyncapi} params={params} />
      <TableOfContents asyncapi={asyncapi} params={params} />
      <TermsOfService asyncapi={asyncapi} />
      <Servers asyncapi={asyncapi} />
      <Channels asyncapi={asyncapi} />
    </File>
  );
}

function TableOfContents({ asyncapi, params }) {
  if (params.slate) return '';
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
