import { Text, Indent, IndentationTypes } from "@asyncapi/generator-react-sdk";

import { Header, Link, ListItem } from "../components/common";

export function TableOfContents({ asyncapi }) {
  const serversList = Object.keys(asyncapi.servers()).map(serverName => {
    return (
      <Indent size={2} type={IndentationTypes.SPACES} key={serverName}>
        <ListItem>
          <Link href={`#${slugify(serverName)}-server`}>{serverName}</Link>
        </ListItem>
      </Indent>
    );
  });
  const channelsList = Object.keys(asyncapi.channels()).map(channelName => {
    return (
      <Indent size={2} type={IndentationTypes.SPACES} key={channelName}>
        <ListItem>
          <Link href={`#${slugify(channelName)}-channel`}>{channelName}</Link>
        </ListItem>
      </Indent>
    );
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
            <Link href="#channels">Channels</Link>
          </ListItem>
        }
        {channelsList.length > 0 && channelsList}
      </Text>
    </>
  );
}

/**
 * Slugify the url part of a markdown link.
 *
 * @param  {String} `str` The string to slugify
 * @return {String}
 */
function slugify(str) {
  str = getTitle(str);
  str = str.toLowerCase();

  str = str.split(' ').join('-');
  str = str.split(/\t/).join('--');
  str = str.split(/<\/?[^>]{1,100}>/).join('');
  str = str.split(/[|$&`~=\\\/@+*!?({[\]})<>.,;:'"^]/).join('');
  str = str.split(/[。？！，、；：【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/).join('');

  return str;
}

/**
 * Get the "title" from a markdown link
 *
 * @param  {String} `str` The string to retrieve title
 * @return {String}
 */
function getTitle(str) {
  if (/^\[[^\]]+\]\(/.test(str)) {
    var m = /^\[([^\]]+)\]/.exec(str);
    if (m) return m[1];
  }
  return str;
}
