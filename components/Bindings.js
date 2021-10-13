import { Schema } from "./Schema";

import { SchemaHelpers } from "../helpers/schema"
import { FormatHelpers } from "../helpers/format";

export function Bindings({ name = 'Binding specific information', item }) {
  const bindings = item.bindings();
  if (!bindings || !Object.keys(bindings).length) {
    return null;
  }

  const renderBindings = Object.entries(bindings).map(
    ([bindingName, binding]) => {
      const schema = SchemaHelpers.jsonToSchema(binding);
      const schemaName = `${FormatHelpers.inlineCode(bindingName)} ${name}`;
      return (
        <Schema schemaName={schemaName} schema={schema} key={bindingName} />
      );
    },
  );

  return (
    <>
      {renderBindings}
    </>
  );
}
