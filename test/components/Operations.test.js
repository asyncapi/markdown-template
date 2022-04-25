import { render } from '@asyncapi/generator-react-sdk';

import { Operations } from '../../components/Operations';
import AsyncAPIDocument from '@asyncapi/parser/lib/models/asyncapi';

describe('Operations component', () => {
  it('should render operation', () => {
    const asyncapi = new AsyncAPIDocument({
      channels: {
        'user/signedup': {
          description: 'This channel is used to exchange messages about users signing up',
          servers: [
            'rabbitmqBrokerInProd',
            'rabbitmqBrokerInStaging',
          ],
          subscribe: {
            operationId: 'signedupuser',
            externalDocs: {
              description: 'More info here',
              url: 'https://example.com'
            },
            tags: [
              { name: 'user' },
              { name: 'signup' },
              { name: 'register' }
            ],
            summary: 'A user signed up.',
            message: {
              description: 'A longer description of the message',
              payload: {
                type: 'object',
                properties: {
                  user: {
                    type: 'string'
                  },
                  signup: {
                    type: 'number'
                  }
                }
              }
            }
          },
        },
      },
    });
    const expected = `
## Operations

### SUB \`user/signedup\` Operation

*A user signed up.*

* Operation ID: \`signedupuser\`
* Available only on servers: [rabbitmqBrokerInProd](#rabbitmqbrokerinprod-server), [rabbitmqBrokerInStaging](#rabbitmqbrokerinstaging-server)

This channel is used to exchange messages about users signing up

[More info here](https://example.com)

##### Operation tags

| Name | Description | Documentation |
|---|---|---|
| user | - | - |
| signup | - | - |
| register | - | - |

#### Message \`<anonymous-message-1>\`

A longer description of the message

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| user | string | - | - | - | - |
| signup | number | - | - | - | - |

> Examples of payload _(generated)_

\`\`\`json
{
  "user": "string",
  "signup": 0
}
\`\`\`
`;

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render parameters for operation', () => {
    const asyncapi = new AsyncAPIDocument({
      channels: {
        'user/{userId}/signup/{foobar}': {
          parameters: {
            userId: {
              description: 'Id of the user.',
              schema: {
                type: 'string'
              },
              location: '$message.payload#/user/id'
            },
            foobar: {
              schema: {
                type: 'string'
              },
            }
          },
          publish: {}
        }
      },
    });
    const expected = `
## Operations

### PUB \`user/{userId}/signup/{foobar}\` Operation

#### Parameters

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| userId | string | Id of the user. | - | - | **required**, **parameter location ($message.payload#/user/id)** |
| foobar | string | - | - | - | **required** |
`;

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render multiple messages', () => {
    const asyncapi = new AsyncAPIDocument({
      channels: {
        'user/{userId}/signup/{foobar}': {
          publish: {
            message: {
              oneOf: [
                {
                  description: 'A longer description of the message',
                  payload: {
                    type: 'object',
                    properties: {
                      signup: {
                        type: 'number'
                      }
                    }
                  }
                },
                {
                  description: 'A longer description of the message',
                  payload: {
                    type: 'object',
                    properties: {
                      user: {
                        type: 'string'
                      },
                    }
                  }
                },
              ]
            }
          }
        }
      },
    });
    const expected = `
## Operations

### PUB \`user/{userId}/signup/{foobar}\` Operation

Accepts **one of** the following messages:

#### Message \`<anonymous-message-1>\`

A longer description of the message

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| signup | number | - | - | - | - |

> Examples of payload _(generated)_

\`\`\`json
{
  "signup": 0
}
\`\`\`


#### Message \`<anonymous-message-1>\`

A longer description of the message

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| user | string | - | - | - | - |

> Examples of payload _(generated)_

\`\`\`json
{
  "user": "string"
}
\`\`\`
`;

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render security', () => {
    const asyncapi = new AsyncAPIDocument({
      channels: {
        "smartylighting.streetlights.1.0.action.{streetlightId}.turn.on": {
          subscribe: {
            security: [
              {
                streetlights_auth: [
                  "streetlights:read"
                ]
              }
            ]
          }
        }
      },
      components: {
        securitySchemes: {
          saslScram: {
            type: "scramSha256",
            description: "Provide your username and password for SASL/SCRAM authentication"
          },
          streetlights_auth: {
            type: "oauth2",
            description: "The oauth security descriptions",
            flows: {
              clientCredentials: {
                tokenUrl: "https://example.com/api/oauth/dialog",
                scopes: {
                  "streetlights:read": "Scope required for subscribing to channel",
                  "streetlights:write": "Scope required for publishing to channel"
                }
              }
            }
          }
        }
      }
    });

    const expected = `
## Operations

### SUB \`smartylighting.streetlights.1.0.action.{streetlightId}.turn.on\` Operation

#### Additional security requirements

##### Security Requirement 1

* Type: \`OAuth2\`
  * Flows:

    Required scopes: \`streetlights:read\`

    | Flow | Auth URL | Token URL | Refresh URL | Scopes |
    |---|---|---|---|---|
    | Client credentials | - | [https://example.com/api/oauth/dialog](https://example.com/api/oauth/dialog) | - | \`streetlights:read\`, \`streetlights:write\` |



  The oauth security descriptions
`;
    
    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render bindings', () => {
    const asyncapi = new AsyncAPIDocument({
      channels: {
        'user/{userId}/signup/{foobar}': {
          bindings: {
            http: {
              type: 'request',
              method: 'GET',
              query: {
                type: 'object',
                required: [
                  'companyId'
                ],
                properties: {
                  companyId: {
                    type: 'number',
                    minimum: 1,
                    description: 'The Id of the company.'
                  }
                },
                additionalProperties: false
              },
              bindingVersion: '0.1.0'
            },
          },
          publish: {
            bindings: {
              kafka: {
                groupId: {
                  type: 'string',
                  enum: [
                    'myGroupId'
                  ]
                },
                clientId: {
                  type: 'string',
                  enum: [
                    'myClientId'
                  ]
                },
                bindingVersion: '0.1.0'
              }
            },
          }
        }
      },
    });
    const expected = `
## Operations

### PUB \`user/{userId}/signup/{foobar}\` Operation

#### \`http\` Channel specific information

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| type | - | - | \`"request"\` | - | - |
| method | - | - | \`"GET"\` | - | - |
| query | object | - | - | - | **additional properties are NOT allowed** |
| query.companyId | number | The Id of the company. | - | >= 1 | **required** |
| bindingVersion | - | - | \`"0.1.0"\` | - | - |

#### \`kafka\` Operation specific information

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| groupId | string | - | allowed (\`"myGroupId"\`) | - | - |
| clientId | string | - | allowed (\`"myClientId"\`) | - | - |
| bindingVersion | - | - | \`"0.1.0"\` | - | - |
`;

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render extensions', () => {
    const asyncapi = new AsyncAPIDocument({
      channels: {
        'user/{userId}/signup/{foobar}': {
          'x-schema-extensions-as-object': {
            type: 'object',
            properties: {
              prop1: {
                type: 'string'
              },
              prop2: {
                type: 'integer',
                minimum: 0
              }
            }
          },
          'x-schema-extensions-as-primitive': 'dummy',
          'x-schema-extensions-as-array': [
            'item1',
            'item2'
          ],
          publish: {
            'x-schema-extensions-as-object': {
              type: 'object',
              properties: {
                prop1: {
                  type: 'string'
                },
                prop2: {
                  type: 'integer',
                  minimum: 0
                }
              }
            },
            'x-schema-extensions-as-primitive': 'dummy',
            'x-schema-extensions-as-array': [
              'item1',
              'item2'
            ]
          }
        }
      },
    });
    const expected = `
## Operations

### PUB \`user/{userId}/signup/{foobar}\` Operation

#### Channel extensions

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| x-schema-extensions-as-object | object | - | - | - | **additional properties are allowed** |
| x-schema-extensions-as-object.prop1 | string | - | - | - | - |
| x-schema-extensions-as-object.prop2 | integer | - | - | >= 0 | - |
| x-schema-extensions-as-primitive | - | - | \`"dummy"\` | - | - |
| x-schema-extensions-as-array | - | - | - | - | - |
| x-schema-extensions-as-array.0 (index) | - | - | \`"item1"\` | - | - |
| x-schema-extensions-as-array.1 (index) | - | - | \`"item2"\` | - | - |

#### Operation extensions

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| x-schema-extensions-as-object | object | - | - | - | **additional properties are allowed** |
| x-schema-extensions-as-object.prop1 | string | - | - | - | - |
| x-schema-extensions-as-object.prop2 | integer | - | - | >= 0 | - |
| x-schema-extensions-as-primitive | - | - | \`"dummy"\` | - | - |
| x-schema-extensions-as-array | - | - | - | - | - |
| x-schema-extensions-as-array.0 (index) | - | - | \`"item1"\` | - | - |
| x-schema-extensions-as-array.1 (index) | - | - | \`"item2"\` | - | - |
`;

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render nothing if operations prop is undefined', () => {
    const asyncapi = new AsyncAPIDocument({});

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result).toEqual('');
  });
});
