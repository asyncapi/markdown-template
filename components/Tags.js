import { Text } from '@asyncapi/generator-react-sdk';

import { Header, Table } from './common';

const tagsHeader = ['Name', 'Description', 'Documentation'];
function tagsRenderer(tag) {
  const externalDocs = tag.externalDocs();
  const externalDocsDescription = externalDocs && externalDocs.hasDescription() ? externalDocs.description() : 'Find more info here';
  return [
    tag.name(),
    tag.description() || '-',
    externalDocs ? `[${externalDocsDescription}](${externalDocs.url()})` : '-',
  ];
}

export function Tags({ name = 'Tags', item }) {
  const tags = item?.tags();
  if (!tags || tags.isEmpty()) {
    return null;
  }

  return (
    <Text>
      <Header type={5}>{name}</Header>
      <Table headers={tagsHeader} rowRenderer={tagsRenderer} data={tags.all()} />
    </Text>
  );
}
