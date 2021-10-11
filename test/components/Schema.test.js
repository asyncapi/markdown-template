import { render } from '@asyncapi/generator-react-sdk';

import { Schema } from "../../components/Schema";
import SchemaModel from '@asyncapi/parser/lib/models/schema';

describe('Schema component', () => {
  it('should render simple object', () => {
    const schema = new SchemaModel({
      type: "object",
      properties: {
        firstName: {
          type: "string",
          description: "The person's first name."
        },
        lastName: {
          type: "string",
          description: "The person's last name."
        },
        age: {
          description: "Age in years which must be equal to or greater than zero.",
          type: "integer",
          minimum: 0
        }
      },
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| firstName | string | The person's first name. | - | - | - |
| lastName | string | The person's last name. | - | - | - |
| age | integer | Age in years which must be equal to or greater than zero. | - | >= 0 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render simple array', () => {
    const schema = new SchemaModel({
      type: "array",
      items: [
        {
          type: "string",
          description: "The person's first name."
        },
        {
          type: "string",
          description: "The person's last name."
        },
        {
          description: "Age in years which must be equal to or greater than zero.",
          type: "integer",
          minimum: 0
        }
      ],
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | tuple<string, string, integer, ...optional<any>> | - | - | - | **additional items are allowed** |
| 0 (index) | string | The person's first name. | - | - | - |
| 1 (index) | string | The person's last name. | - | - | - |
| 2 (index) | integer | Age in years which must be equal to or greater than zero. | - | >= 0 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render primitive', () => {
    const schema = new SchemaModel({
      type: "integer",
      description: "Age in years which must be equal to or greater than zero.",
      minimum: 0
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | integer | Age in years which must be equal to or greater than zero. | - | >= 0 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render values', () => {
    const schema = new SchemaModel({
      description: "Age in years which must be equal to or greater than zero.",
      type: "integer",
      minimum: 0,
      default: 5,
      const: 3,
      enum: [0, 1, 2, 3, 4, 5],
      examples: [1, 2, 3, 4, 5]
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | integer | Age in years which must be equal to or greater than zero. | default (\`5\`), const (\`3\`), allowed (\`0\`, \`1\`, \`2\`, \`3\`, \`4\`, \`5\`), examples (\`1\`, \`2\`, \`3\`, \`4\`, \`5\`) | >= 0 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render schema with constraints - number/integer case', () => {
    const schema = new SchemaModel({
      description: "Age in years which must be equal to or greater than zero.",
      type: "integer",
      format: 'int32',
      minimum: 0,
      exclusiveMaximum: 10,
      multipleOf: 2,
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | integer | Age in years which must be equal to or greater than zero. | - | format (\`int32\`), [ 0 .. 10 ), multiple of 2 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render schema with constraints - string case', () => {
    const schema = new SchemaModel({
      type: "email",
      description: "The person's last name.",
      format: 'email',
      maxLength: 26,
      minLength: 3,
      pattern: '@email\.com$',
      contentMediaType: 'application/json',
      contentEncoding: 'json',
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | email | The person's last name. | - | format (\`email\`), pattern (\`@email.com$\`), media type (\`application/json\`), encoding (\`json\`), [ 3 .. 26 ] characters | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render schema with constraints - object case', () => {
    const schema = new SchemaModel({
      type: "object",
      properties: {
        firstName: {
          type: "string",
          description: "The person's first name."
        },
        lastName: {
          type: "string",
          description: "The person's last name."
        },
      },
      maxProperties: 5,
      minProperties: 1,
      required: ['firstName'],
      patternProperties: {
        "^_S": { type: "string" },
        "^_R": { type: "boolean" }
      },
      propertyNames: {
        "pattern": "^[A-Za-z_][A-Za-z0-9_]*$"
      },
      dependencies: {
        firstName: ["lastName"],
      },
      additionalProperties: {
        enum: ['age', 'address']
      },
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | [ 1 .. 5 ] properties | - |
| firstName | string | The person's first name. | - | - | **required** |
| lastName | string | The person's last name. | - | - | **required when defined (\`firstName\`)** |
| ^_S (pattern property) | string | - | - | - | - |
| ^_R (pattern property) | boolean | - | - | - | - |
| (property names) | - | - | - | pattern (\`^[A-Za-z_][A-Za-z0-9_]*$\`) | - |
| (additional properties) | string | - | allowed (\`"age"\`, \`"address"\`) | - | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render schema with constraints - array case', () => {
    const schema = new SchemaModel({
      type: "array",
      items: {
        type: "string",
        format: "email",
        maxLength: 26,
        minLength: 3,
      },
      maxItems: 5,
      minItems: 1,
      uniqueItems: true,
      contains: {
        const: "email@example.com"
      },
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | array<string> | - | - | [ 1 .. 5 ] unique items | - |
| (single item) | string | - | - | format (\`email\`), [ 3 .. 26 ] characters | - |
| (contains) | string | - | const (\`"email@example.com"\`) | - | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render schema with constraints - tuple case', () => {
    const schema = new SchemaModel({
      type: "array",
      items: [
        {
          type: "string",
          format: "email",
          maxLength: 26,
          minLength: 3,
        },
        {
          type: "string",
          format: "email",
          maxLength: 26,
          minLength: 3,
        },
      ],
      maxItems: 5,
      minItems: 1,
      uniqueItems: true,
      contains: {
        const: "email@example.com"
      },
      additionalItems: {
        type: "integer",
      }
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | tuple<string, string, ...optional<integer>> | - | - | [ 1 .. 5 ] unique items | - |
| 0 (index) | string | - | - | format (\`email\`), [ 3 .. 26 ] characters | - |
| 1 (index) | string | - | - | format (\`email\`), [ 3 .. 26 ] characters | - |
| (contains) | string | - | const (\`"email@example.com"\`) | - | - |
| (additional items) | integer | - | - | - | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render deep schema', () => {
    const schema = new SchemaModel({
      "type": "object",
      "properties": {
        "productId": {
          "description": "The unique identifier for a product",
          "type": "integer"
        },
        "productName": {
          "description": "Name of the product",
          "type": "string"
        },
        "price": {
          "description": "The price of the product",
          "type": "number",
          "exclusiveMinimum": 0
        },
        "tags": {
          "description": "Tags for the product",
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "uniqueItems": true
        },
        "dimensions": {
          "type": "object",
          "properties": {
            "length": {
              "type": "number"
            },
            "width": {
              "type": "number"
            },
            "height": {
              "type": "number"
            }
          },
          "required": [ "length", "width", "height" ]
        },
        "warehouseLocation": {
          "type": "string",
          "description": "Coordinates of the warehouse where the product is located.",
        }
      },
      "required": [ "productId", "productName", "price" ]
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| productId | integer | The unique identifier for a product | - | - | **required** |
| productName | string | Name of the product | - | - | **required** |
| price | number | The price of the product | - | > 0 | **required** |
| tags | array<string> | Tags for the product | - | non-empty | - |
| tags (single item) | string | - | - | - | - |
| dimensions | object | - | - | - | **additional properties are allowed** |
| dimensions.length | number | - | - | - | **required** |
| dimensions.width | number | - | - | - | **required** |
| dimensions.height | number | - | - | - | **required** |
| warehouseLocation | string | Coordinates of the warehouse where the product is located. | - | - | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render combined schemas', () => {
    const schema = new SchemaModel({
      "allOf": [
        { "type": "string" },
        { "maxLength": 5 }
      ],
      "anyOf": [
        { "type": "string", "maxLength": 5 },
        { "type": "number", "minimum": 0 }
      ],
      "oneOf": [
        { "type": "number", "multipleOf": 5 },
        { "type": "number", "multipleOf": 3 }
      ],
      "not": { "type": "string" },
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | any | - | - | - | - |
| 0 (oneOf item) | number | - | - | multiple of 5 | - |
| 1 (oneOf item) | number | - | - | multiple of 3 | - |
| 0 (anyOf item) | string | - | - | <= 5 characters | - |
| 1 (anyOf item) | number | - | - | >= 0 | - |
| 0 (allOf item) | string | - | - | - | - |
| 1 (allOf item) | - | - | - | <= 5 characters | - |
| (not) | string | - | - | - | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render conditional schemas', () => {
    const schema = new SchemaModel({
      "if": {
        "type": "string",
      },
      "then": {
        "minLength": 1,
      },
      "else": {
        "maximum": 5,
      }
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | any | - | - | - | - |
| (if) | string | - | - | - | - |
| (then) | - | - | - | non-empty | - |
| (else) | - | - | - | <= 5 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
