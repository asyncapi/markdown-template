import { Text } from '@asyncapi/generator-react-sdk';

export function Header({ type = 1, childrenContent = '' }) {
  const hashes = Array(type).fill('#').join('');
  return <Text newLines={2}>{`${hashes} ${childrenContent}`}</Text>;
}

export function Link({ href = '', childrenContent = '' }) {
  return `[${childrenContent}](${href})`;
}

export function Image({ src = '', desc = '', childrenContent = '' }) {
  return `![${desc || childrenContent}](${src})`;
}

export function List({ list = [] }) {
  if (list.length === 0) return null;
  return list.map((item, idx) => (
    <ListItem key={idx}>{item}</ListItem>
  ));
}

export function ListItem({ type = '*', childrenContent = '' }) {
  return <Text>{`${type} ${childrenContent}`}</Text>;
}

export function Table({ headers = [], rowRenderer = () => [], data = [] }) {
  const row = (entry, idx) => <Text key={idx}>{`| ${rowRenderer(entry).join(' | ')} |`}</Text>;
  return (
    <>
      <TableHead headers={headers} />
      {data.map((entry, idx) => row(entry, idx))}
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
  const renderedRow = rowRenderer(entry).map(it => (it || '').replace(/\|/g, '\\|')).join(' | ');
  return <Text>{`| ${renderedRow} |`}</Text>;
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

export function BlockQuote({ childrenContent = '' }) {
  return <Text newLines={2}>{`> ${childrenContent}`}</Text>;
}

export function NewLine({ numbers = 1 }) {
  return Array(numbers).fill('\n').join('');
}
