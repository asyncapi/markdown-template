import { render } from '@asyncapi/generator-react-sdk';

import { Message } from "../../components/Message";
import MessageModel from '@asyncapi/parser/lib/models/message';

describe('Message component', () => {
  it('should render simple message', () => {
    const message = new MessageModel({
      "title": "User signup",
      "name": "UserSignup",
      "summary": "Action to sign a user up.",
      "headers": {
        "type": "object",
        "properties": {
          "correlationId": {
            "description": "Correlation ID set by application",
            "type": "string"
          },
          "applicationInstanceId": {
            "description": "Unique identifier for a given instance of the publishing application",
            "type": "string"
          }
        }
      },
      "payload": {
        "type": "object",
        "properties": {
          "user": {
            "type": "string"
          },
          "signup": {
            "type": "string"
          }
        }
      },
    });
    const expected = `
#### Message User signup \`UserSignup\`

*Action to sign a user up.*

##### Headers

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| correlationId | string | Correlation ID set by application | - | - | - |
| applicationInstanceId | string | Unique identifier for a given instance of the publishing application | - | - | - |

> Examples of headers _(generated)_

\`\`\`json
{
  "correlationId": "string",
  "applicationInstanceId": "string"
}
\`\`\`


##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| user | string | - | - | - | - |
| signup | string | - | - | - | - |

> Examples of payload _(generated)_

\`\`\`json
{
  "user": "string",
  "signup": "string"
}
\`\`\`
`;

    const result = render(<Message message={message} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render complete message', () => {
    const message = new MessageModel({
      "name": "UserSignup",
      "title": "User signup",
      "summary": "Action to sign a user up.",
      "description": "A longer description",
      "contentType": "application/json",
      "tags": [
        { "name": "user" },
        { "name": "signup" },
        { "name": "register" }
      ],
      "headers": {
        "type": "object",
        "properties": {
          "correlationId": {
            "description": "Correlation ID set by application",
            "type": "string"
          },
          "applicationInstanceId": {
            "description": "Unique identifier for a given instance of the publishing application",
            "type": "string"
          }
        }
      },
      "payload": {
        "type": "object",
        "properties": {
          "user": {
            "type": "string"
          },
          "signup": {
            "type": "string"
          }
        }
      },
      "correlationId": {
        "description": "Default Correlation ID",
        "location": "$message.header#/correlationId"
      },
      "examples": [
        {
          "name": "SimpleSignup",
          "summary": "A simple UserSignup example message",
          "headers": {
            "correlationId": "my-correlation-id",
            "applicationInstanceId": "myInstanceId"
          },
          "payload": {
            "user": {
              "someUserKey": "someUserValue"
            },
            "signup": {
              "someSignupKey": "someSignupValue"
            }
          }
        }
      ]
    });
    const expected = `
#### Message User signup \`UserSignup\`

*Action to sign a user up.*

* Content type: [application/json](https://www.iana.org/assignments/media-types/application/json)
* Correlation ID: \`$message.header#/correlationId\`  Default Correlation ID


A longer description

##### Headers

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| correlationId | string | Correlation ID set by application | - | - | - |
| applicationInstanceId | string | Unique identifier for a given instance of the publishing application | - | - | - |

> Examples of headers

_SimpleSignup_

A simple UserSignup example message

\`\`\`json
{
  "correlationId": "my-correlation-id",
  "applicationInstanceId": "myInstanceId"
}
\`\`\`


##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| user | string | - | - | - | - |
| signup | string | - | - | - | - |

> Examples of payload

_SimpleSignup_

A simple UserSignup example message

\`\`\`json
{
  "user": {
    "someUserKey": "someUserValue"
  },
  "signup": {
    "someSignupKey": "someSignupValue"
  }
}
\`\`\`


###### Message tags

* user

* signup

* register
`;

    const result = render(<Message message={message} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render multiple messages', () => {
    const message = new MessageModel({
      "name": "UserSignup",
      "title": "User signup",
      "headers": {
        "type": "object",
      },
      "payload": {
        "type": "object",
      },
      "examples": [
        {
          "name": "SimpleSignup",
          "summary": "A simple UserSignup example message",
          "headers": {
            "correlationId": "my-correlation-id",
            "applicationInstanceId": "myInstanceId"
          },
          "payload": {
            "user": {
              "someUserKey": "someUserValue"
            },
            "signup": {
              "someSignupKey": "someSignupValue"
            }
          }
        },
        {
          "name": "ExtendedSimpleSignup",
          "summary": "A simple ExtendedSimpleSignup example message",
          "headers": {
            "correlationId": "my-correlation-id",
          },
          "payload": {
            "user": {
              "someUserKey": "foobar"
            },
            "signup": {
              "someSignupKey": "barfoo"
            }
          }
        }
      ]
    });
    const expected = `
#### Message User signup \`UserSignup\`

##### Headers

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |

> Examples of headers

_SimpleSignup_

A simple UserSignup example message

\`\`\`json
{
  "correlationId": "my-correlation-id",
  "applicationInstanceId": "myInstanceId"
}
\`\`\`


_ExtendedSimpleSignup_

A simple ExtendedSimpleSignup example message

\`\`\`json
{
  "correlationId": "my-correlation-id"
}
\`\`\`


##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |

> Examples of payload

_SimpleSignup_

A simple UserSignup example message

\`\`\`json
{
  "user": {
    "someUserKey": "someUserValue"
  },
  "signup": {
    "someSignupKey": "someSignupValue"
  }
}
\`\`\`


_ExtendedSimpleSignup_

A simple ExtendedSimpleSignup example message

\`\`\`json
{
  "user": {
    "someUserKey": "foobar"
  },
  "signup": {
    "someSignupKey": "barfoo"
  }
}
\`\`\`
`;

    const result = render(<Message message={message} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render nothing if message prop is undefined', () => {
    const result = render(<Message />);
    expect(result).toEqual('');
  });
});
