import { render } from '@asyncapi/generator-react-sdk';
import { AsyncAPIDocumentV2 as AsyncAPIDocument, AsyncAPIDocumentV3, createAsyncAPIDocument } from '@asyncapi/parser';

import { Operations } from '../../components/Operations';

describe('Operations component', () => {
  it('should render operation', () => {
    const asyncapi = createAsyncAPIDocument({
      semver: {
        major: 2,
        minor: 0,
        patch: 0,
      },
      parsed: {
        asyncapi: '2.0.0',
        servers: {
          rabbitmqBrokerInProd: {},
          rabbitmqBrokerInStaging: {},
        },
        channels: {
          'user/signedup': {
            description: 'This channel is used to exchange messages about users signing up',
            servers: [
              'rabbitmqBrokerInProd',
              'rabbitmqBrokerInStaging'
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
                name: 'SomeMessage',
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
      }
    });
    const expected = `
## Operations

### SUB \`user/signedup\` Operation

*A user signed up.*

* Operation ID: \`signedupuser\`

This channel is used to exchange messages about users signing up

[More info here](https://example.com)

##### Operation tags

| Name | Description | Documentation |
|---|---|---|
| user | - | - |
| signup | - | - |
| register | - | - |

#### Message \`SomeMessage\`

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

  it('should render servers for operation', () => {
    const asyncapi = createAsyncAPIDocument({
      semver: {
        major: 2,
        minor: 0,
        patch: 0,
      },
      parsed: {
        asyncapi: '2.0.0',
        servers: {
          rabbitmqBrokerInProd: {},
          rabbitmqBrokerInStaging: {},
        },
        channels: {
          'user/signedup': {
            description: 'This channel is used to exchange messages about users signing up',
            servers: [
              'rabbitmqBrokerInProd',
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
                name: 'SomeMessage',
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
      }
    });
    const expected = `
## Operations

### SUB \`user/signedup\` Operation

*A user signed up.*

* Operation ID: \`signedupuser\`
* Available only on servers: [rabbitmqBrokerInProd](#rabbitmqbrokerinprod-server)

This channel is used to exchange messages about users signing up

[More info here](https://example.com)

##### Operation tags

| Name | Description | Documentation |
|---|---|---|
| user | - | - |
| signup | - | - |
| register | - | - |

#### Message \`SomeMessage\`

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
                  messageId: 'some-message',
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
                  name: 'SomeMessage',
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

#### Message \`some-message\`

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


#### Message \`SomeMessage\`

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
    const asyncapi = createAsyncAPIDocument({
      semver: {
        major: 2,
        minor: 0,
        patch: 0,
      },
      parsed: {
        asyncapi: '2.0.0',
        channels: {
          'smartylighting.streetlights.1.0.action.{streetlightId}.turn.on': {
            subscribe: {
              security: [
                {
                  streetlights_auth: [
                    'streetlights:read'
                  ]
                }
              ]
            }
          }
        },
        components: {
          securitySchemes: {
            streetlights_auth: {
              type: 'oauth2',
              description: 'The oauth security descriptions',
              flows: {
                clientCredentials: {
                  tokenUrl: 'https://example.com/api/oauth/dialog',
                  scopes: {
                    'streetlights:read': 'Scope required for subscribing to channel',
                    'streetlights:write': 'Scope required for publishing to channel'
                  }
                }
              }
            }
          }
        }
      },
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
    | Authorization Code | - | - | - | - |
    | Client credentials | - | [https://example.com/api/oauth/dialog](https://example.com/api/oauth/dialog) | - | \`streetlights:read\`, \`streetlights:write\` |
    | Implicit | - | - | - | - |
    | Password | - | - | - | - |



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

  it('should render nothing if channels with operations are not defined', () => {
    const asyncapi = new AsyncAPIDocument({});

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result).toEqual('');
  });

  it('should render reply operation', () => {
    const asyncapi = new AsyncAPIDocumentV3({
      "asyncapi": "3.0.0",
      "info": {
        "title": "Kraken Websockets API",
        "version": "1.8.0",
        "description": "WebSockets API offers real-time market data updates. WebSockets is a bidirectional protocol offering fastest real-time data, helping you build real-time applications. The public message types presented below do not require authentication. Private-data messages can be subscribed on a separate authenticated endpoint. \n\n### General Considerations\n\n- TLS with SNI (Server Name Indication) is required in order to establish a Kraken WebSockets API connection. See Cloudflare's [What is SNI?](https://www.cloudflare.com/learning/ssl/what-is-sni/) guide for more details.\n- All messages sent and received via WebSockets are encoded in JSON format\n- All decimal fields (including timestamps) are quoted to preserve precision.\n- Timestamps should not be considered unique and not be considered as aliases for transaction IDs. Also, the granularity of timestamps is not representative of transaction rates.\n- At least one private message should be subscribed to keep the authenticated client connection open.\n- Please use REST API endpoint [AssetPairs](https://www.kraken.com/features/api#get-tradable-pairs) to fetch the list of pairs which can be subscribed via WebSockets API. For example, field 'wsname' gives the supported pairs name which can be used to subscribe.\n- Cloudflare imposes a connection/re-connection rate limit (per IP address) of approximately 150 attempts per rolling 10 minutes. If this is exceeded, the IP is banned for 10 minutes.\n- Recommended reconnection behaviour is to (1) attempt reconnection instantly up to a handful of times if the websocket is dropped randomly during normal operation but (2) after maintenance or extended downtime, attempt to reconnect no more quickly than once every 5 seconds. There is no advantage to reconnecting more rapidly after maintenance during cancel_only mode.\n"
      },
      "channels": {
        "currencyExchange": {
          "address": "/",
          "messages": {
            "subscribe": {
              "$ref": "#/components/messages/subscribe"
            },
            "unsubscribe": {
              "$ref": "#/components/messages/unsubscribe"
            }
          }
        }
      },
      "operations": {
        "subscribe": {
          "action": "send",
          "channel": {
            "$ref": "#/channels/currencyExchange"
          },
          "reply": {
            "channel": {
              "$ref": "#/channels/currencyExchange"
            },
            "messages": [
              {
                "$ref": "#/components/messages/subscriptionStatus"
              }
            ]
          }
        },
        "unsubscribe": {
          "action": "send",
          "channel": {
            "$ref": "#/channels/currencyExchange"
          },
          "reply": {
            "channel": {
              "$ref": "#/channels/currencyExchange"
            },
            "messages": [
              {
                "$ref": "#/components/messages/subscriptionStatus"
              }
            ]
          }
        }
      },
      "components": {
        "messages": {
          "subscribe": {
            "description": "Subscribe to a topic on a single or multiple currency pairs.",
            "payload": {
              "$ref": "#/components/schemas/subscribe"
            },
            "correlationId": {
              "location": "$message.payload#/reqid"
            }
          },
          "unsubscribe": {
            "description": "Unsubscribe, can specify a channelID or multiple currency pairs.",
            "payload": {
              "$ref": "#/components/schemas/unsubscribe"
            },
            "correlationId": {
              "location": "$message.payload#/reqid"
            }
          },
          "subscriptionStatus": {
            "description": "Subscription status response to subscribe, unsubscribe or exchange initiated unsubscribe.",
            "payload": {
              "$ref": "#/components/schemas/subscriptionStatus"
            }
          }
        },
        "schemas": {
          "systemStatus": {
            "type": "object",
            "properties": {
              "event": {
                "type": "string",
                "const": "systemStatus"
              },
              "connectionID": {
                "type": "integer",
                "description": "The ID of the connection"
              },
              "status": {
                "$ref": "#/components/schemas/status"
              },
              "version": {
                "type": "string"
              }
            }
          },
          "status": {
            "type": "string",
            "enum": [
              "online",
              "maintenance",
              "cancel_only",
              "limit_only",
              "post_only"
            ]
          },
          "subscribe": {
            "type": "object",
            "properties": {
              "event": {
                "type": "string",
                "const": "subscribe"
              }
            }
          },
          "unsubscribe": {
            "type": "object",
            "properties": {
              "event": {
                "type": "string",
                "const": "unsubscribe"
              }
            }
          },
          "subscriptionStatus": {
            "type": "object",
            "oneOf": [
              {
                "$ref": "#/components/schemas/subscriptionStatusError"
              },
              {
                "$ref": "#/components/schemas/subscriptionStatusSuccess"
              }
            ]
          },
          "subscriptionStatusError": {
            "allOf": [
              {
                "properties": {
                  "errorMessage": {
                    "type": "string"
                  }
                },
                "required": [
                  "errorMessage"
                ]
              },
              {
                "$ref": "#/components/schemas/subscriptionStatusCommon"
              }
            ]
          },
          "subscriptionStatusSuccess": {
            "allOf": [
              {
                "properties": {
                  "channelID": {
                    "type": "integer",
                    "description": "ChannelID on successful subscription, applicable to public messages only."
                  },
                  "channelName": {
                    "type": "string",
                    "description": "Channel Name on successful subscription. For payloads 'ohlc' and 'book', respective interval or depth will be added as suffix."
                  }
                },
                "required": [
                  "channelID",
                  "channelName"
                ]
              },
              {
                "$ref": "#/components/schemas/subscriptionStatusCommon"
              }
            ]
          },
          "subscriptionStatusCommon": {
            "type": "object",
            "required": [
              "event"
            ],
            "properties": {
              "event": {
                "type": "string",
                "const": "subscriptionStatus"
              }
            }
          },
          "interval": {
            "type": "integer",
            "description": "Time interval associated with ohlc subscription in minutes.",
            "default": 1,
            "enum": [
              1,
              5,
              15,
              30,
              60,
              240,
              1440,
              10080,
              21600
            ]
          },
          "name": {
            "type": "string",
            "description": "The name of the channel you subscribe too.",
            "enum": [
              "book",
              "ohlc",
              "openOrders",
              "ownTrades",
              "spread",
              "ticker",
              "trade"
            ]
          },
          "token": {
            "type": "string",
            "description": "base64-encoded authentication token for private-data endpoints."
          },
          "depth": {
            "type": "integer",
            "default": 10,
            "enum": [
              10,
              25,
              100,
              500,
              1000
            ],
            "description": "Depth associated with book subscription in number of levels each side."
          },
          "maxratecount": {
            "type": "integer",
            "description": "Max rate-limit budget. Compare to the ratecounter field in the openOrders updates to check whether you are approaching the rate limit."
          },
          "ratecounter": {
            "type": "boolean",
            "default": false,
            "description": "Whether to send rate-limit counter in updates (supported only for openOrders subscriptions)"
          },
          "snapshot": {
            "type": "boolean",
            "default": true,
            "description": "Whether to send historical feed data snapshot upon subscription (supported only for ownTrades subscriptions)"
          },
          "reqid": {
            "type": "integer",
            "description": "client originated ID reflected in response message."
          },
          "pair": {
            "type": "array",
            "description": "Array of currency pairs.",
            "items": {
              "type": "string",
              "description": "Format of each pair is \"A/B\", where A and B are ISO 4217-A3 for standardized assets and popular unique symbol if not standardized.",
              "pattern": "[A-Z\\s]+\\/[A-Z\\s]+"
            }
          }
        }
      }
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
});
