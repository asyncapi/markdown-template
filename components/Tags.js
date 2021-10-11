import { IndentationTypes, Text } from "@asyncapi/generator-react-sdk";

import { ListItem, Link } from "./common";

export function Tags({ tags = [] }) {
  if (tags.length === 0) {
    return null
  }

  return (
    <>
      {tags.map(tag => (
        <Tag tag={tag} key={tag.name()} />
      ))}
    </>
  );
}

function Tag({ tag }) {
  const description = tag.description();
  const externalDocs = tag.externalDocs();

  return (
    <>
      <Text>
        <ListItem>{tag.name()}</ListItem>
      </Text>
      {description && (
        <Text indent={2} type={IndentationTypes.SPACES}>
          {description}
        </Text>
      )}
      {externalDocs && (
        <Text indent={2} type={IndentationTypes.SPACES}>
          <Link
            href={externalDocs.url()}
          >
            {externalDocs.hasDescription() ? externalDocs.description() : 'Find more info here.'}
          </Link>
        </Text>
      )}
    </>
  );
}
