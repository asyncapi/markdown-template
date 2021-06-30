import { Text } from "@asyncapi/generator-react-sdk";

import { Header, TableHead, TableRow } from "./common";

export function Schema({ schema, schemaName, description = '', hideTitle = false }) {
  const headers = ['Name', 'Type', 'Description', 'Accepted values'];

  let properties = schema.properties();
  properties = Object.keys(properties).length ? Object.entries(properties).map(([propName, prop]) => (
    <SchemaProp prop={prop} propName={propName} path='' required={isRequired(schema, propName)} description={description} />
  )) : <SchemaProp prop={schema} propName={schemaName} path='' description={description} />;

  return (
    <Text>
      {hideTitle === false ? <Header type={4}>{schemaName}</Header> : null}
      <TableHead headers={headers} />
      {properties}
    </Text>
  );
}

function SchemaProp({ prop, propName, required = false, path = '', description = '', circularPropsParent = [] }) {
  const anyOf = prop.anyOf() && prop.anyOf().map((p, idx) => (
    <SchemaProp prop={p} propName={idx} path={buildPath(path || propName, idx)} />
  ));
  const allOf = prop.allOf() && prop.allOf().map((p, idx) => (
    <SchemaProp prop={p} propName={idx} path={buildPath(path || propName, idx)} />
  ));
  const oneOf = prop.oneOf() && prop.oneOf().map((p, idx) => (
    <SchemaProp prop={p} propName={idx} path={buildPath(path || propName, idx)} />
  ));

  const properties = Object.entries(prop.properties()).map(([pName, p]) => {
    const circProps = p.circularProps();
    const isPropCircular = circularPropsParent.includes(pName);

    if (isPropCircular === true) {
      return (
        <SchemaPropRow
          prop={p}
          propName={pName}
          path={buildPath(path || propName, pName)}
          required={isRequired(prop, pName)}
          isCircular={isPropCircular}
        />
      );
    } else {
      return (
        <SchemaProp
          prop={p}
          propName={pName}
          path={buildPath(path || propName, pName)}
          required={isRequired(prop, pName)}
          circularPropsParent={circProps}
        />
      );
    }
  });

  const additionalProperties = prop.additionalProperties() && typeof prop.additionalProperties() === "object" && prop.additionalProperties().properties()
    ? Object.entries(prop.additionalProperties().properties()).map(([pName, p]) => (
      <SchemaProp prop={p} propName={pName} path={buildPath(path || propName, pName)} required={isRequired(prop.additionalProperties(), pName)} />
    )) : null;

  const items = prop.items() && !Array.isArray(prop.items()) && prop.items().properties()
    ? Object.entries(prop.items().properties()).map(([pName, p]) => {
      const isCirc = p.isCircular();

      if (isCirc === true) {
        return (
          <SchemaPropRow
            prop={p}
            propName={pName}
            path={buildPath(path || propName, pName)}
            required={isRequired(prop, pName)}
            isCircular={isCirc}
          />
        );
      } else {
        return (
          <SchemaProp
            prop={p}
            propName={pName}
            path={buildPath(path || propName, pName)}
            required={isRequired(prop.items(), pName)}
          />
        );
      }
    }) : null;

  return (
    <>
      <SchemaPropRow prop={prop} propName={propName} required={required} path={path} description={description} />
      {anyOf}
      {allOf}
      {oneOf}
      {properties}
      {additionalProperties}
      {items}
    </>
  );
}

function SchemaPropRow({ prop, propName, required = false, path = '', description = '', isCircular = false }) {
  const acceptedValues = prop.enum() && prop.enum().length ? prop.enum().join(', ') : '_Any_';

  let itemType;
  if (prop.items() && !Array.isArray(prop.items()) && prop.items().type()) {
    let type = prop.items().type();
    if (Array.isArray(type)) {
      itemType = type.join(' or ');
    } else {
      itemType = type;
    }
  }

  const types = [
    Array.isArray(prop.type()) ? prop.type().join(' or ') : prop.type(),
    prop.anyOf() && `anyOf`,
    prop.allOf() && `allOf`,
    prop.oneOf() && `oneOf`,
    itemType,
  ].filter(t => t).join(', ');

  description = `${description || prop.description() || ''}${isCircular ? ' **[CIRCULAR]**': ''}`.replace(new RegExp('\S*\r?\n','g'), ' ');

  const rowRenderer = () => [
    `${tree(path) || propName}${required ? ' **(required)**': ''}`,
    `${types}`,
    description.trim() || '-',
    acceptedValues
  ];

  return <TableRow rowRenderer={rowRenderer} entry={prop} />;
}

function tree(path = '') {
  const filteredPaths = path.split('.').filter(Boolean);
  return filteredPaths.join('.');
}

function buildPath(path = '', field = '') {
  if (!path) return field;
  return `${path}.${field}`;
}

function isRequired(obj, key) {
  if (!obj || typeof obj.required !== 'function') return false;
  const required = obj.required() || [];
  return required.includes(key);
}
