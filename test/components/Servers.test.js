import { render } from '@asyncapi/generator-react-sdk';

import { Servers } from "../../components/Servers";
import AsyncAPIDocument from '@asyncapi/parser/lib/models/asyncapi';

describe('Servers component', () => {
  it('should render simple list of servers', () => {
    const asyncapi = new AsyncAPIDocument({
      "servers": {
        "development": {
          "url": "development.gigantic-server.com",
          "description": "Development server",
          "protocol": "amqp",
          "protocolVersion": "0.9.1"
        },
        "staging": {
          "url": "staging.gigantic-server.com",
          "description": "Staging server",
          "protocol": "amqp",
          "protocolVersion": "0.9.1"
        },
        "production": {
          "url": "api.gigantic-server.com",
          "description": "Production server",
          "protocol": "amqp",
          "protocolVersion": "0.9.1"
        }
      }
    });
    const expected = `
## Servers

### \`development\` Server

* URL: \`development.gigantic-server.com\`
* Protocol: \`amqp 0.9.1\`

Development server

### \`staging\` Server

* URL: \`staging.gigantic-server.com\`
* Protocol: \`amqp 0.9.1\`

Staging server

### \`production\` Server

* URL: \`api.gigantic-server.com\`
* Protocol: \`amqp 0.9.1\`

Production server
`;
    
    const result = render(<Servers asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render server variables', () => {
    const asyncapi = new AsyncAPIDocument({
      "servers": {
        "production": {
          "url": "{username}.gigantic-server.com:{port}/{basePath}",
          "description": "The production API server",
          "protocol": "secure-mqtt",
          "variables": {
            "username": {
              "description": "This value is assigned by the service provider, in this example `gigantic-server.com`"
            },
            "port": {
              "enum": [
                "8883",
                "8884"
              ],
              "default": "8883"
            },
            "basePath": {
              "default": "v2"
            }
          }
        }
      }
    });
    const expected = `
## Servers

### \`production\` Server

* URL: \`{username}.gigantic-server.com:{port}/{basePath}\`
* Protocol: \`secure-mqtt\`

The production API server

#### URL Variables

| Name | Description | Default value | Allowed values |
|---|---|---|---|
| username | This value is assigned by the service provider, in this example \`gigantic-server.com\` | _None_ | _Any_ |
| port | - | \`8883\` | \`8883\`, \`8884\` |
| basePath | - | \`v2\` | _Any_ |
`;
    
    const result = render(<Servers asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render server security - all cases', () => {
    const asyncapi = new AsyncAPIDocument({
      "servers": {
        "production": {
          "url": "some.url",
          "protocol": "mqtt",
          "security": [
            {
              "userPassword": []
            },
            {
              "apiKey": []
            },
            {
              "X509": []
            },
            {
              "symmetricEncryption": []
            },
            {
              "asymmetricEncryption": []
            },
            {
              "httpBasic": []
            },
            {
              "httpApiKey": []
            },
            {
              "httpBearer": []
            },
            {
              "supportedOauthFlows": [
                "streetlights:on",
                "streetlights:off",
                "streetlights:dim"
              ]
            },
            {
              "scramSha256": []
            },
            {
              "scramSha512": []
            },
            {
              "gssapi": []
            },
            {
              "plain": []
            },
            {
              "openIdConnectWellKnown": []
            }
          ]
        }
      },
      "components": {
        "securitySchemes": {
          "userPassword": {
            "type": "userPassword"
          },
          "apiKey": {
            "type": "apiKey",
            "in": "user",
            "description": "Provide your API key as the user and leave the password empty."
          },
          "X509": {
            "type": "X509"
          },
          "symmetricEncryption": {
            "type": "symmetricEncryption"
          },
          "asymmetricEncryption": {
            "type": "asymmetricEncryption"
          },
          "httpBasic": {
            "type": "http",
            "scheme": "basic"
          },
          "httpApiKey": {
            "type": "httpApiKey",
            "name": "api_key",
            "in": "header"
          },
          "httpBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
          },
          "supportedOauthFlows": {
            "type": "oauth2",
            "description": "Flows to support OAuth 2.0",
            "flows": {
              "implicit": {
                "authorizationUrl": "https://authserver.example/auth",
                "scopes": {
                  "streetlights:on": "Ability to switch lights on",
                  "streetlights:off": "Ability to switch lights off",
                  "streetlights:dim": "Ability to dim the lights"
                }
              },
              "password": {
                "tokenUrl": "https://authserver.example/token",
                "scopes": {
                  "streetlights:on": "Ability to switch lights on",
                  "streetlights:off": "Ability to switch lights off",
                  "streetlights:dim": "Ability to dim the lights"
                }
              },
              "clientCredentials": {
                "tokenUrl": "https://authserver.example/token",
                "scopes": {
                  "streetlights:on": "Ability to switch lights on",
                  "streetlights:off": "Ability to switch lights off",
                  "streetlights:dim": "Ability to dim the lights"
                }
              },
              "authorizationCode": {
                "authorizationUrl": "https://authserver.example/auth",
                "tokenUrl": "https://authserver.example/token",
                "refreshUrl": "https://authserver.example/refresh",
                "scopes": {
                  "streetlights:on": "Ability to switch lights on",
                  "streetlights:off": "Ability to switch lights off",
                  "streetlights:dim": "Ability to dim the lights"
                }
              }
            }
          },
          "scramSha256": {
            "type": "scramSha256"
          },
          "scramSha512": {
            "type": "scramSha512"
          },
          "gssapi": {
            "type": "gssapi"
          },
          "plain": {
            "type": "plain"
          },
          "openIdConnectWellKnown": {
            "type": "openIdConnect",
            "openIdConnectUrl": "https://authserver.example/.well-known"
          }
        }
      }
    });
    const expected = `
## Servers

### \`production\` Server

* URL: \`some.url\`
* Protocol: \`mqtt\`


#### Security

##### Security Requirement 1

* Type: \`User/Password\`



##### Security Requirement 2

* Type: \`API key\`
  * In: user

  Provide your API key as the user and leave the password empty.



##### Security Requirement 3

* Type: \`X509\`



##### Security Requirement 4

* Type: \`Symmetric Encription\`



##### Security Requirement 5

* Type: \`Asymmetric Encription\`



##### Security Requirement 6

* Type: \`HTTP\`
  * Scheme: basic




##### Security Requirement 7

* Type: \`HTTP API key\`
  * Name: api_key
  * In: header




##### Security Requirement 8

* Type: \`HTTP\`
  * Scheme: bearer
  * Bearer format: JWT




##### Security Requirement 9

* Type: \`OAuth2\`
  * Flows:

    Required scopes: \`streetlights:on\`, \`streetlights:off\`, \`streetlights:dim\`

    | Flow | Auth URL | Token URL | Refresh URL | Scopes |
    |---|---|---|---|---|
    | Implicit | [https://authserver.example/auth](https://authserver.example/auth) | - | - | \`streetlights:on\`, \`streetlights:off\`, \`streetlights:dim\` |
    | Password | - | [https://authserver.example/token](https://authserver.example/token) | - | \`streetlights:on\`, \`streetlights:off\`, \`streetlights:dim\` |
    | Client credentials | - | [https://authserver.example/token](https://authserver.example/token) | - | \`streetlights:on\`, \`streetlights:off\`, \`streetlights:dim\` |
    | Authorization Code | [https://authserver.example/auth](https://authserver.example/auth) | [https://authserver.example/token](https://authserver.example/token) | [https://authserver.example/refresh](https://authserver.example/refresh) | \`streetlights:on\`, \`streetlights:off\`, \`streetlights:dim\` |



  Flows to support OAuth 2.0



##### Security Requirement 10

* Type: \`ScramSha256\`



##### Security Requirement 11

* Type: \`ScramSha512\`



##### Security Requirement 12

* Type: \`GSSAPI\`



##### Security Requirement 13

* Type: \`PLAIN\`



##### Security Requirement 14

* Type: \`Open ID\`
  * OpenID Connect URL: [https://authserver.example/.well-known](https://authserver.example/.well-known)
`;
    
    const result = render(<Servers asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render server security for kafka protocols - multiple requirements case', () => {
    const asyncapi = new AsyncAPIDocument({
      "servers": {
        "production": {
          "url": "some.url",
          "protocol": "mqtt",
          "security": [
            {
              "userPassword": [],
              "apiKey": []
            },
            {
              "apiKey": []
            },
          ]
        }
      },
      "components": {
        "securitySchemes": {
          "userPassword": {
            "type": "userPassword"
          },
          "apiKey": {
            "type": "apiKey",
            "in": "user",
            "description": "Provide your API key as the user and leave the password empty."
          },
        }
      }
    });
    const expected = `
## Servers

### \`production\` Server

* URL: \`some.url\`
* Protocol: \`mqtt\`


#### Security

##### Security Requirement 1

* Type: \`User/Password\`

* Type: \`API key\`
  * In: user

  Provide your API key as the user and leave the password empty.



##### Security Requirement 2

* Type: \`API key\`
  * In: user

  Provide your API key as the user and leave the password empty.
`;

    const result = render(<Servers asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render server security for kafka protocols - without security schema', () => {
    const asyncapi = new AsyncAPIDocument({
      "servers": {
        "test": {
          "url": "test.mykafkacluster.org:8092",
          "protocol": "kafka-secure",
          "description": "Test broker",
        }
      }
    });
    const expected = `
## Servers

### \`test\` Server

* URL: \`test.mykafkacluster.org:8092\`
* Protocol: \`kafka-secure\`

Test broker

#### Security

##### Security Requirement 1

  * security.protocol: SSL
`;

    const result = render(<Servers asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render server security for kafka protocols - with security schema', () => {
    const asyncapi = new AsyncAPIDocument({
      "servers": {
        "test": {
          "url": "test.mykafkacluster.org:8092",
          "protocol": "kafka-secure",
          "description": "Test broker",
          "security": [
            {
              "saslScram": []
            }
          ]
        }
      },
      "components": {
        "securitySchemes": {
          "saslScram": {
            "type": "scramSha512",
            "description": "Create credentials in the dev portal."
          }
        }
      }
    });
    const expected = `
## Servers

### \`test\` Server

* URL: \`test.mykafkacluster.org:8092\`
* Protocol: \`kafka-secure\`

Test broker

#### Security

##### Security Requirement 1

* Type: \`ScramSha512\`
  * security.protocol: SASL_SSL
  * sasl.mechanism: SCRAM-SHA-512

  Create credentials in the dev portal.
`;

    const result = render(<Servers asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render nothing if servers are undefined', () => {
    const asyncapi = new AsyncAPIDocument({
      "channels": {},
    });

    const result = render(<Servers asyncapi={asyncapi} />);
    expect(result).toEqual('');
  });
});
