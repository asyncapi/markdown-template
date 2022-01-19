import { Text } from '@asyncapi/generator-react-sdk';

import { Header, Table } from './common';

export function Tags({ name = 'Tags', tags = [] }) {
  if (tags.length === 0) {
    return null;
  }

  const tagsHeader = ['Name', 'Description', 'Documentation'];
  const tagsRenderer = (tag) => {
    const externalDocs = tag.externalDocs();
    const externalDocsDescription = externalDocs && externalDocs.hasDescription() ? externalDocs.description() : 'Find more info here';
    return [
      tag.name() || '-',
      tag.description() || '-',
      externalDocs ? `[${externalDocsDescription}](${externalDocs.url()})` : '-',
    ];
  };

  return (
    <Text>
      <Header type={5}>{name}</Header>
      <Table headers={tagsHeader} rowRenderer={tagsRenderer} data={tags} />
    </Text>
  );
}
