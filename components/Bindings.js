import { Schema } from './Schema';

import { SchemaHelpers } from '../helpers/schema';
import { FormatHelpers } from '../helpers/format';

export function Bindings({ name = 'Binding specific information', item }) {
  const bindings = item.bindings();
  if (bindings.isEmpty()) {
    return null;
  }

  const renderBindings = bindings.all().map(binding => {
    const protocol = binding.protocol();
    const schema = SchemaHelpers.jsonToSchema(binding);
    const schemaName = `${FormatHelpers.inlineCode(protocol)} ${name}`;
    return (
      <Schema schemaName={schemaName} schema={schema} key={protocol} />
    );
  });

  return (
    <>
      {renderBindings}
    </>
  );
}
