import { render } from '@asyncapi/generator-react-sdk';
import { SchemaV2 as SchemaModel } from '@asyncapi/parser';

import { Schema } from '../../components/Schema';

describe('Schema component', () => {
  it('should render simple object', () => {
    const schema = new SchemaModel({
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          description: 'The person\'s first name.'
        },
        lastName: {
          type: 'string',
          description: 'The person\'s last name.'
        },
        age: {
          description: 'Age in years which must be equal to or greater than zero.',
          type: 'integer',
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
      type: 'array',
      items: [
        {
          type: 'string',
          description: 'The person\'s first name.'
        },
        {
          type: 'string',
          description: 'The person\'s last name.'
        },
        {
          description: 'Age in years which must be equal to or greater than zero.',
          type: 'integer',
          minimum: 0
        }
      ],
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | tuple\\<string, string, integer, ...optional\\<any\\>\\> | - | - | - | **additional items are allowed** |
| 0 (index) | string | The person's first name. | - | - | - |
| 1 (index) | string | The person's last name. | - | - | - |
| 2 (index) | integer | Age in years which must be equal to or greater than zero. | - | >= 0 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render primitive', () => {
    const schema = new SchemaModel({
      type: 'integer',
      description: 'Age in years which must be equal to or greater than zero.',
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
      description: 'Age in years which must be equal to or greater than zero.',
      type: 'integer',
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
      description: 'Age in years which must be equal to or greater than zero.',
      type: 'integer',
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
      type: 'email',
      description: 'The person\'s last name.',
      format: 'email',
      maxLength: 26,
      minLength: 3,
      pattern: '@email.com$',
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
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          description: 'The person\'s first name.'
        },
        lastName: {
          type: 'string',
          description: 'The person\'s last name.'
        },
      },
      maxProperties: 5,
      minProperties: 1,
      required: ['firstName'],
      patternProperties: {
        '^_S': { type: 'string' },
        '^_R': { type: 'boolean' }
      },
      propertyNames: {
        pattern: '^[A-Za-z_][A-Za-z0-9_]*$'
      },
      dependencies: {
        firstName: ['lastName'],
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
      type: 'array',
      items: {
        type: 'string',
        format: 'email',
        maxLength: 26,
        minLength: 3,
      },
      maxItems: 5,
      minItems: 1,
      uniqueItems: true,
      contains: {
        const: 'email@example.com'
      },
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | array\\<string\\> | - | - | [ 1 .. 5 ] unique items | - |
| (single item) | string | - | - | format (\`email\`), [ 3 .. 26 ] characters | - |
| (contains) | string | - | const (\`"email@example.com"\`) | - | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render schema with constraints - tuple case', () => {
    const schema = new SchemaModel({
      type: 'array',
      items: [
        {
          type: 'string',
          format: 'email',
          maxLength: 26,
          minLength: 3,
        },
        {
          type: 'string',
          format: 'email',
          maxLength: 26,
          minLength: 3,
        },
      ],
      maxItems: 5,
      minItems: 1,
      uniqueItems: true,
      contains: {
        const: 'email@example.com'
      },
      additionalItems: {
        type: 'integer',
      }
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | tuple\\<string, string, ...optional\\<integer\\>\\> | - | - | [ 1 .. 5 ] unique items | - |
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
      type: 'object',
      properties: {
        productId: {
          description: 'The unique identifier for a product',
          type: 'integer'
        },
        productName: {
          description: 'Name of the product',
          type: 'string'
        },
        price: {
          description: 'The price of the product',
          type: 'number',
          exclusiveMinimum: 0
        },
        tags: {
          description: 'Tags for the product',
          type: 'array',
          items: {
            type: 'string'
          },
          minItems: 1,
          uniqueItems: true
        },
        dimensions: {
          type: 'object',
          properties: {
            length: {
              type: 'number'
            },
            width: {
              type: 'number'
            },
            height: {
              type: 'number'
            }
          },
          required: ['length', 'width', 'height']
        },
        warehouseLocation: {
          type: 'string',
          description: 'Coordinates of the warehouse where the product is located.',
        }
      },
      required: ['productId', 'productName', 'price']
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| productId | integer | The unique identifier for a product | - | - | **required** |
| productName | string | Name of the product | - | - | **required** |
| price | number | The price of the product | - | > 0 | **required** |
| tags | array\\<string\\> | Tags for the product | - | non-empty | - |
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
      allOf: [
        { type: 'string' },
        { type: 'string', maxLength: 5 }
      ],
      anyOf: [
        { type: 'string', maxLength: 5 },
        { type: 'number', minimum: 0 }
      ],
      oneOf: [
        { type: 'number', multipleOf: 5 },
        { type: 'number', multipleOf: 3 }
      ],
      not: { type: 'string' },
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | any | - | - | - | **additional properties are allowed** |
| 0 (oneOf item) | number | - | - | multiple of 5 | - |
| 1 (oneOf item) | number | - | - | multiple of 3 | - |
| 0 (anyOf item) | string | - | - | <= 5 characters | - |
| 1 (anyOf item) | number | - | - | >= 0 | - |
| 0 (allOf item) | string | - | - | - | - |
| 1 (allOf item) | string | - | - | <= 5 characters | - |
| (not) | string | - | - | - | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render conditional schemas', () => {
    const schema = new SchemaModel({
      if: {
        type: 'string',
      },
      then: {
        minLength: 1,
      },
      else: {
        maximum: 5,
      }
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | any | - | - | - | **additional properties are allowed** |
| (if) | string | - | - | - | - |
| (then) | - | - | - | non-empty | - |
| (else) | - | - | - | <= 5 | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render appropriate notes for any type', () => {
    const schema = new SchemaModel({
      properties: {
        firstName: {
          type: 'string',
          description: 'The person\'s first name.'
        },
      },
      items: [
        {
          type: 'string',
          format: 'email',
          maxLength: 26,
          minLength: 3,
        }
      ],
    });
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | - | - | - | - | **additional properties are allowed**, **additional items are allowed** |
| firstName | string | The person's first name. | - | - | - |
| 0 (index) | string | - | - | format (\`email\`), [ 3 .. 26 ] characters | - |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render circular schemas', () => {
    let schema = {
      type: 'object',
      properties: {
        RecursiveSelf: {
          type: 'object',
          properties: {
            selfChildren: {
              type: 'array',
              items: {
                $ref: '#/RecursiveSelf'
              }
            },
            selfObjectChildren: {
              type: 'object',
              properties: {
                test: {
                  $ref: '#/RecursiveSelf'
                },
                nonRecursive: {
                  type: 'string'
                }
              }
            },
            selfSomething: {
              type: 'object',
              properties: {
                test: {
                  $ref: '#/RecursiveAncestor'
                }
              }
            }
          }
        },
        RecursiveAncestor: {
          type: 'object',
          properties: {
            ancestorChildren: {
              type: 'array',
              items: {
                $ref: '#/RecursiveSelf'
              }
            },
            ancestorSomething: {
              type: 'string'
            }
          }
        },
        NormalSchemaA: {
          type: 'string',
        },
        NestedAllOfSchema: {
          allOf: [
            {
              $ref: '#/NormalSchemaA'
            },
            {
              type: 'object',
              properties: {
                parent: {
                  allOf: [
                    {
                      $ref: '#/NestedAllOfSchema'
                    },
                    {
                      $ref: '#/NormalSchemaA'
                    }
                  ]
                },
                name: {
                  type: 'string'
                }
              },
              required: [
                'name'
              ]
            }
          ]
        },
        OneOf: {
          type: 'object',
          properties: {
            kind: {
              oneOf: [
                {
                  $ref: '#/OneOf'
                },
                {
                  type: 'string'
                },
                {
                  enum: [
                    'boolean',
                    'string'
                  ]
                }
              ]
            }
          }
        }
      }
    };
    schema.properties.RecursiveSelf.properties.selfChildren.items = schema.properties.RecursiveSelf;
    schema.properties.RecursiveSelf.properties.selfObjectChildren.properties.test = schema.properties.RecursiveSelf;
    schema.properties.RecursiveSelf.properties.selfSomething.properties.test = schema.properties.RecursiveAncestor;
    schema.properties.RecursiveAncestor.properties.ancestorChildren.items = schema.properties.RecursiveSelf;
    schema.properties.NestedAllOfSchema.allOf[0] = schema.properties.NormalSchemaA;
    schema.properties.NestedAllOfSchema.allOf[1].properties.parent.allOf[0] = schema.properties.NestedAllOfSchema;
    schema.properties.NestedAllOfSchema.allOf[1].properties.parent.allOf[1] = schema.properties.NormalSchemaA;
    schema.properties.OneOf.properties.kind.oneOf[0] = schema.properties.OneOf;

    schema = new SchemaModel(schema);
    const expected = `
#### Test schema

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfChildren | array\\<object\\> | - | - | - | - |
| RecursiveSelf.selfChildren.selfChildren | array\\<object\\> | - | - | - | **circular** |
| RecursiveSelf.selfChildren.selfObjectChildren | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfChildren.selfObjectChildren.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfChildren.selfObjectChildren.nonRecursive | string | - | - | - | - |
| RecursiveSelf.selfChildren.selfSomething | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfChildren.selfSomething.test | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfChildren.selfSomething.test.ancestorChildren | array\\<object\\> | - | - | - | - |
| RecursiveSelf.selfChildren.selfSomething.test.ancestorChildren.selfChildren | array\\<object\\> | - | - | - | **circular** |
| RecursiveSelf.selfChildren.selfSomething.test.ancestorChildren.selfObjectChildren | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfChildren.selfSomething.test.ancestorChildren.selfObjectChildren.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfChildren.selfSomething.test.ancestorChildren.selfObjectChildren.nonRecursive | string | - | - | - | - |
| RecursiveSelf.selfChildren.selfSomething.test.ancestorChildren.selfSomething | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfChildren.selfSomething.test.ancestorSomething | string | - | - | - | - |
| RecursiveSelf.selfObjectChildren | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfObjectChildren.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfObjectChildren.nonRecursive | string | - | - | - | - |
| RecursiveSelf.selfSomething | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfSomething.test | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfSomething.test.ancestorChildren | array\\<object\\> | - | - | - | - |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfChildren | array\\<object\\> | - | - | - | - |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfChildren.selfChildren | array\\<object\\> | - | - | - | **circular** |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfChildren.selfObjectChildren | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfChildren.selfObjectChildren.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfChildren.selfObjectChildren.nonRecursive | string | - | - | - | - |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfChildren.selfSomething | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfObjectChildren | object | - | - | - | **additional properties are allowed** |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfObjectChildren.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfObjectChildren.nonRecursive | string | - | - | - | - |
| RecursiveSelf.selfSomething.test.ancestorChildren.selfSomething | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveSelf.selfSomething.test.ancestorSomething | string | - | - | - | - |
| RecursiveAncestor | object | - | - | - | **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren | array\\<object\\> | - | - | - | - |
| RecursiveAncestor.ancestorChildren.selfChildren | array\\<object\\> | - | - | - | - |
| RecursiveAncestor.ancestorChildren.selfChildren.selfChildren | array\\<object\\> | - | - | - | **circular** |
| RecursiveAncestor.ancestorChildren.selfChildren.selfObjectChildren | object | - | - | - | **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren.selfChildren.selfObjectChildren.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren.selfChildren.selfObjectChildren.nonRecursive | string | - | - | - | - |
| RecursiveAncestor.ancestorChildren.selfChildren.selfSomething | object | - | - | - | **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren.selfChildren.selfSomething.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren.selfObjectChildren | object | - | - | - | **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren.selfObjectChildren.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren.selfObjectChildren.nonRecursive | string | - | - | - | - |
| RecursiveAncestor.ancestorChildren.selfSomething | object | - | - | - | **additional properties are allowed** |
| RecursiveAncestor.ancestorChildren.selfSomething.test | object | - | - | - | **circular**, **additional properties are allowed** |
| RecursiveAncestor.ancestorSomething | string | - | - | - | - |
| NormalSchemaA | string | - | - | - | - |
| NestedAllOfSchema | allOf | - | - | - | **additional properties are allowed** |
| NestedAllOfSchema.0 (allOf item) | string | - | - | - | - |
| NestedAllOfSchema.1 (allOf item) | object | - | - | - | **additional properties are allowed** |
| NestedAllOfSchema.1.parent | allOf | - | - | - | **additional properties are allowed** |
| NestedAllOfSchema.1.parent.0 (allOf item) | allOf | - | - | - | **circular**, **additional properties are allowed** |
| NestedAllOfSchema.1.parent.1 (allOf item) | string | - | - | - | - |
| NestedAllOfSchema.1.name | string | - | - | - | **required** |
| OneOf | object | - | - | - | **additional properties are allowed** |
| OneOf.kind | oneOf | - | - | - | **additional properties are allowed** |
| OneOf.kind.0 (oneOf item) | object | - | - | - | **circular**, **additional properties are allowed** |
| OneOf.kind.1 (oneOf item) | string | - | - | - | - |
| OneOf.kind.2 (oneOf item) | string | - | allowed (\`"boolean"\`, \`"string"\`) | - | **additional properties are allowed** |
`;

    const result = render(<Schema schema={schema} schemaName="Test schema" />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
