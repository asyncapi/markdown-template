import { Schema } from './Schema';

import { SchemaHelpers } from '../helpers/schema';

export const Extensions = ({ name = 'Extensions', item }) => {
  const extensions = SchemaHelpers.getCustomExtensions(item) || {};
  if (Object.keys(extensions || {}).length === 0) {
    return null;
  }

  const schema = SchemaHelpers.jsonToSchema(extensions);
  return (
    <Schema schemaName={name} schema={schema} />
  );
};
