import { Text } from '@asyncapi/generator-react-sdk';

import { Header, TableHead, TableRow } from './common';

import { SchemaHelpers } from '../helpers/schema';

const headers = ['Name', 'Type', 'Description', 'Value', 'Constraints', 'Notes'];

export function Schema({ schema, schemaName, hideTitle = false }) {
  return (
    <Text>
      {schemaName && hideTitle === false ? <Header type={4}>{schemaName}</Header> : null}
      <TableHead headers={headers} />
      <SchemaPropRow schema={schema} path='' nameNote='root' />
      <SchemaContent schema={schema} schemaName='' />
    </Text>
  );
}

function SchemaContent({ schema, schemaName, path = '' }) {
  const dependentSchemas = SchemaHelpers.getDependentSchemas(schema);
  const extensions = SchemaHelpers.getCustomExtensions(schema);
  const extensionsSchema = (extensions || Object.keys(extensions).length)
    ? SchemaHelpers.jsonToSchema(extensions)
    : null;

  return (
    <>
      <SchemaProperties schema={schema} schemaName={schemaName} path={path} />
      <SchemaItems schema={schema} schemaName={schemaName} path={path} />

      {schema.oneOf() && schema.oneOf().map((s, idx) => (
        <SchemaPropRow schema={s} schemaName={idx} path={buildPath(path || schemaName, idx)} nameNote='oneOf item' key={idx} />
      ))}
      {schema.anyOf() && schema.anyOf().map((s, idx) => (
        <SchemaPropRow schema={s} schemaName={idx} path={buildPath(path || schemaName, idx)} nameNote='anyOf item' key={idx} />
      ))}
      {schema.allOf() && schema.allOf().map((s, idx) => (
        <SchemaPropRow schema={s} schemaName={idx} path={buildPath(path || schemaName, idx)} nameNote='allOf item' key={idx} />
      ))}
      {schema.not() && (
        <SchemaPropRow schema={schema.not()} path={path} nameNote='not' tryRenderAdditionalNotes={false} />
      )}
      {schema.propertyNames() && (
        <SchemaPropRow schema={schema.propertyNames()} path={path} nameNote='property names' tryRenderAdditionalNotes={false} />
      )}
      {schema.contains() && (
        <SchemaPropRow schema={schema.contains()} path={path} nameNote='contains' tryRenderAdditionalNotes={false} />
      )}
      {schema.if() && (
        <SchemaPropRow schema={schema.if()} path={path} nameNote='if' tryRenderAdditionalNotes={false} />
      )}
      {schema.then() && (
        <SchemaPropRow schema={schema.then()} path={path} nameNote='then' tryRenderAdditionalNotes={false} />
      )}
      {schema.else() && (
        <SchemaPropRow schema={schema.else()} path={path} nameNote='else' tryRenderAdditionalNotes={false} />
      )}
      {dependentSchemas && (
        <SchemaPropRow schema={dependentSchemas} path={path} nameNote='dependant schemas' />
      )}

      {extensionsSchema && (
        <SchemaProperties schema={extensionsSchema} path={path} />
      )}

      <SchemaAdditionalProperties schema={schema} path={path} />
      <SchemaAdditionalItems schema={schema} path={path} />
    </>
  );
}

function SchemaProperties({ schema, schemaName, path }) {
  const properties = schema.properties() || {};
  if (!Object.keys(properties)) {
    return null;
  }

  const required = schema.required() || [];
  const patternProperties = schema.patternProperties() || {};

  return (
    <>
      {Object.entries(properties).map(([propertyName, property]) => (
        <SchemaPropRow
          schema={property}
          schemaName={propertyName}
          path={buildPath(path || schemaName, propertyName)}
          required={required.includes(propertyName)}
          dependentRequired={SchemaHelpers.getDependentRequired(
            propertyName,
            schema,
          )}
          key={propertyName}
        />
      ))}
      {Object.entries(patternProperties).map(([propertyName, property]) => (
        <SchemaPropRow
          schema={property}
          schemaName={propertyName}
          path={buildPath(path || schemaName, propertyName)}
          nameNote='pattern property'
          key={propertyName}
        />
      ))}
    </>
  );
}

function SchemaAdditionalProperties({ schema, path }) {
  const extensions = schema.extensions();
  if (extensions.get(SchemaHelpers.extRenderAdditionalInfo)?.value() === false) {
    return null;
  }

  const type = schema.type();
  const types = Array.isArray(type) ? type : [type];
  if (type !== undefined && !types.includes('object')) {
    return null;
  }

  const additionalProperties = schema.additionalProperties();
  if (additionalProperties === true || additionalProperties === undefined || additionalProperties === false) {
    return null;
  }

  return (
    <SchemaPropRow schema={additionalProperties} path={path} nameNote='additional properties' tryRenderAdditionalNotes={false} />
  );
}

function SchemaItems({ schema, schemaName, path }) {
  const type = schema.type();
  const types = Array.isArray(type) ? type : [type];
  if (type !== undefined && !types.includes('array')) {
    return null;
  }
  const items = schema.items();

  // object in items
  if (
    items &&
    !Array.isArray(items) &&
    Object.keys(items.properties() || {}).length
  ) {
    return (
      <SchemaProperties schema={items} path={path} nameNote='single item' />
    );
  } else if (Array.isArray(items)) {
    return items.map((item, idx) => (
      <SchemaPropRow 
        schema={item} 
        path={buildPath(path || schemaName, idx)}
        key={idx}
        nameNote='index'
      />
    ));
  }
  return (
    <SchemaPropRow schema={items} path={path} nameNote='single item' />
  );
}

function SchemaAdditionalItems({ schema, path }) {
  const extensions = schema.extensions();
  if (extensions.get(SchemaHelpers.extRenderAdditionalInfo)?.value() === false) {
    return null;
  }

  const type = schema.type();
  const types = Array.isArray(type) ? type : [type];
  if (type !== undefined && !types.includes('array')) {
    return null;
  }
  if (!Array.isArray(schema.items())) {
    return null;
  }

  const additionalItems = schema.additionalItems();
  if (additionalItems === true || additionalItems === undefined || additionalItems === false) {
    return null;
  }

  return (
    <SchemaPropRow schema={additionalItems} path={path} nameNote='additional items' tryRenderAdditionalNotes={false} />
  );
}

function SchemaPropRow({
  schema, 
  schemaName, 
  required = false, 
  dependentRequired = [],
  path = '', 
  nameNote = '',
  tryRenderAdditionalNotes = true,
}) {
  if (
    !schema ||
    (typeof schemaName === 'string' &&
      (schemaName.startsWith('x-parser-') ||
        schemaName.startsWith('x-schema-private-')))
  ) {
    return null;
  }

  const isCircular = schema.isCircular() || false;
  const extensions = schema.extensions();
  const renderType = extensions.get(SchemaHelpers.extRenderType)?.value() !== false;
  const rawValue = extensions.get(SchemaHelpers.extRawValue)?.value() === true;

  const name = tree(path) || schemaName;
  const schemaType = renderType && SchemaHelpers.toSchemaType(schema);

  // eslint-disable-next-line no-control-regex, no-useless-escape
  let description = (schema.description() || '').replace(new RegExp('\S*\r?\n','g'), ' ');
  const externalDocs = schema.externalDocs();
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  description = externalDocs ? `${!description.endsWith('.') ? `${description}.` : description} [${externalDocs.description() || 'Documentation'}](${externalDocs.url()})` : description;
  description = description.trim();

  const values = rawValue ? `\`${SchemaHelpers.prettifyValue(schema.const())}\`` : schemaValues(schema);
  const constraints = schemaConstraints(schema);
  const notes = schemaNotes({ schema, required, dependentRequired, isCircular, tryRenderAdditionalNotes });

  let renderedName = '';
  if (nameNote) {
    renderedName = name ? `${name} (${nameNote})` : `(${nameNote})`;
  } else {
    renderedName = name;
  }

  const rowRenderer = () => [
    renderedName || '-',
    schemaType || '-',
    description || '-',
    values || '-',
    constraints || '-',
    notes || '-',
  ];

  if (
    nameNote === 'root' &&
    (!schemaType || schemaType === 'object' || schemaType === 'array') &&
    !description &&
    !values &&
    !constraints &&
    !notes
  ) {
    return null;
  }

  return (
    <>
      <TableRow rowRenderer={rowRenderer} entry={schema} />
      {isCircular === false && nameNote !== 'root' && <SchemaContent schema={schema} schemaName={schemaName} path={path} />}
    </>
  );
}

function tree(path = '') {
  path = String(path);
  const filteredPaths = path.split('.').filter(Boolean);
  return filteredPaths.join('.');
}

function buildPath(path = '', field = '') {
  if (!path) return field;
  return `${path}.${field}`;
}

function schemaValues(schema) {
  if (!schema) return null;
  const values = [];

  if (schema.default()) values.push(`default (\`${SchemaHelpers.prettifyValue(schema.default())}\`)`);
  if (schema.const()) values.push(`const (\`${SchemaHelpers.prettifyValue(schema.const())}\`)`);
  if (schema.enum()) {
    const allowed = schema.enum().map(v => `\`${SchemaHelpers.prettifyValue(v)}\``).join(', ');
    values.push(`allowed (${allowed})`);
  }
  if (schema.examples()) {
    const examples = schema.examples().map(v => `\`${SchemaHelpers.prettifyValue(v)}\``).join(', ');
    values.push(`examples (${examples})`);
  }

  return values.join(', ');
}

function schemaConstraints(schema) {
  if (!schema) return null;
  const constraints = [];

  if (schema.format()) constraints.push(`format (\`${schema.format()}\`)`);
  if (schema.pattern()) constraints.push(`pattern (\`${schema.pattern()}\`)`);
  if (schema.contentMediaType()) constraints.push(`media type (\`${schema.contentMediaType()}\`)`);
  if (schema.contentEncoding()) constraints.push(`encoding (\`${schema.contentEncoding()}\`)`);

  return constraints.concat(SchemaHelpers.humanizeConstraints(schema)).join(', ');
}

function schemaNotes({ schema, required = false, dependentRequired = [], isCircular = false, tryRenderAdditionalNotes }) {
  if (!schema) return null;
  const notes = [];

  if (schema.deprecated()) notes.push('**deprecated**');

  if (required) notes.push('**required**');
  if (dependentRequired.length) {
    const deps = dependentRequired.map(v => `\`${v}\``).join(', ');
    notes.push(`**required when defined (${deps})**`);
  }

  const extensions = schema.extensions();

  // location for channel parameter
  const parameterLocation = extensions.get(SchemaHelpers.extParameterLocation);
  if (parameterLocation?.value()) {
    notes.push(`**parameter location (${parameterLocation.value()})**`);
  }

  if (isCircular) notes.push('**circular**');
  if (schema.writeOnly()) notes.push('**write-only**');
  if (schema.readOnly()) notes.push('**read-only**');

  // additional properties/items
  if (extensions.get(SchemaHelpers.extRenderAdditionalInfo)?.value() !== false) {
    const type = schema.type();
    const types = Array.isArray(type) ? type : [type];

    // additional properties
    if (
      (type === undefined && tryRenderAdditionalNotes) ||
      types.includes('object')
    ) {
      const additionalProperties = schema.additionalProperties();
      if (additionalProperties === true || additionalProperties === undefined) {
        notes.push('**additional properties are allowed**');
      } else if (additionalProperties === false) {
        notes.push('**additional properties are NOT allowed**');
      }
    }

    // additional items
    if (
      (
        (type === undefined && tryRenderAdditionalNotes) ||
        types.includes('array')
      ) && 
      Array.isArray(schema.items())
    ) {
      const additionalItems = schema.additionalItems();
      if (additionalItems === true || additionalItems === undefined) {
        notes.push('**additional items are allowed**');
      } else if (additionalItems === false) {
        notes.push('**additional items are NOT allowed**');
      }
    }
  }

  return notes.join(', ');
}
