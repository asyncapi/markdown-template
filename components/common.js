import { Text } from "@asyncapi/generator-react-sdk";

export function Header({ type = 1, childrenContent = "" }) {
  const hashes = Array(type).fill("#").join("");
  return <Text newLines={2}>{`${hashes} ${childrenContent}`}</Text>
}

export function Link({ href = "", childrenContent = "" }) {
  return `[${childrenContent}](${href})`;
}

export function Image({ src = "", desc = "", childrenContent = "" }) {
  return `![${desc || childrenContent}](${src})`;
}

export function ListItem({ type = "*", childrenContent = "" }) {
  return <Text>{`${type} ${childrenContent}`}</Text>;
}

export function Table({ headers = [], rowRenderer = () => [], data = [] }) {
  const row = entry => <Text>{`| ${rowRenderer(entry).join(' | ')} |`}</Text>;
  return (
    <>
      <TableHead headers={headers} />
      {data.map(entry => row(entry))}
    </>
  );
}

export function TableHead({ headers = [] }) {
  const header = `| ${headers.join(' | ')} |`;
  const breaks = `|${Array(headers.length).fill('---|').join('')}`;

  return (
    <>
      <Text>{header}</Text>
      <Text>{breaks}</Text>
    </>
  );
}

export function TableRow({ rowRenderer = () => [], entry }) {
  return <Text>{`| ${rowRenderer(entry).join(' | ')} |`}</Text>;
}

export function CodeBlock({ language = 'json', childrenContent = '' }) {
  return (
    <Text>
      {'```'}{language}{'\n'}
      {childrenContent}{'\n'}
      {'```'}
    </Text>
  );
}

export function BlockQuote({ childrenContent = "" }) {
  return <Text newLines={2}>{`> ${childrenContent}`}</Text>
}

export function Tags({ tags = [] }) {
  return (
    <Text>
      {tags.map(tag => (
        <ListItem>{tag.name()}</ListItem>
      ))}
    </Text>
  );
}
