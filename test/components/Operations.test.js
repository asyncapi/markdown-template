import { render } from '@asyncapi/generator-react-sdk';

import { Operations } from "../../components/Operations";
import AsyncAPIDocument from '@asyncapi/parser/lib/models/asyncapi';

describe('Operations component', () => {
  it('should render operation', () => {
    const asyncapi = new AsyncAPIDocument({
      "channels": {
        "user/signedup": {
          "description": "This channel is used to exchange messages about users signing up",
          "servers": [
            "rabbitmqBrokerInProd",
            "rabbitmqBrokerInStaging",
          ],
          "subscribe": {
            "operationId": "signedupuser",
            "externalDocs": {
              "description": "More info here",
              "url": "https://example.com"
            },
            "tags": [
              { "name": "user" },
              { "name": "signup" },
              { "name": "register" }
            ],
            "summary": "A user signed up.",
            "message": {
              "description": "A longer description of the message",
              "payload": {
                "type": "object",
                "properties": {
                  "user": {
                    "type": "string"
                  },
                  "signup": {
                    "type": "number"
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
* Available only on servers: \`rabbitmqBrokerInProd\`, \`rabbitmqBrokerInStaging\`

This channel is used to exchange messages about users signing up

[More info here](https://example.com)

###### Operation tags

* user

* signup

* register

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
      "channels": {
        "user/{userId}/signup/{foobar}": {
          "parameters": {
            "userId": {
              "description": "Id of the user.",
              "schema": {
                "type": "string"
              },
              "location": "$message.payload#/user/id"
            },
            "foobar": {
              "schema": {
                "type": "string"
              },
            }
          },
          "publish": {}
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
      "channels": {
        "user/{userId}/signup/{foobar}": {
          "publish": {
            "message": {
              "oneOf": [
                {
                  "description": "A longer description of the message",
                  "payload": {
                    "type": "object",
                    "properties": {
                      "signup": {
                        "type": "number"
                      }
                    }
                  }
                },
                {
                  "description": "A longer description of the message",
                  "payload": {
                    "type": "object",
                    "properties": {
                      "user": {
                        "type": "string"
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

  it('should render nothing if operations prop is undefined', () => {
    const asyncapi = new AsyncAPIDocument({});

    const result = render(<Operations asyncapi={asyncapi} />);
    expect(result).toEqual('');
  });
});
