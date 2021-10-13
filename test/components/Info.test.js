import { render } from '@asyncapi/generator-react-sdk';

import { Info } from "../../components/Info";
import AsyncAPIDocument from '@asyncapi/parser/lib/models/asyncapi';

describe('Info component', () => {
  it('should render all fields', () => {
    const asyncapi = new AsyncAPIDocument({
      "asyncapi": "2.2.0",
      "id": "urn:com:smartylighting:streetlights:server",
      "info": {
        "title": "Streetlights API",
        "version": "1.0.0",
        "description": "The Smartylighting Streetlights API allows you to remotely manage the city lights.\n### Check out its awesome features:\n* Turn a specific streetlight on/off 🌃\n* Dim a specific streetlight 😎\n* Receive real-time information about environmental lighting conditions 📈\n",
        "termsOfService": "https://asyncapi.org/terms/",
        "contact": {
          "name": "API Support",
          "url": "https://www.asyncapi.org/support",
          "email": "support@asyncapi.org"
        },
        "license": {
          "name": "Apache 2.0",
          "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
        }
      },
      "tags": [
        {
          "name": "root-tag1",
          "externalDocs": {
            "description": "External docs description 1",
            "url": "https://www.asyncapi.com/"
          }
        },
        {
          "name": "root-tag2",
          "description": "Description 2",
          "externalDocs": {
            "url": "https://www.asyncapi.com/"
          }
        },
        {
          "name": "root-tag3"
        },
        {
          "name": "root-tag4",
          "description": "Description 4"
        },
        {
          "name": "root-tag5",
          "externalDocs": {
            "url": "https://www.asyncapi.com/"
          }
        }
      ],
      "externalDocs": {
        "description": "More info here",
        "url": "https://example.com"
      },
      "defaultContentType": "application/json"
    });
    const expected = `
# Streetlights API 1.0.0 documentation

* Specification ID: \`urn:com:smartylighting:streetlights:server\`
* License: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
* Terms of service: [https://asyncapi.org/terms/](https://asyncapi.org/terms/)
* Default content type: [application/json](https://www.iana.org/assignments/media-types/application/json)
* Support: [API Support](https://www.asyncapi.org/support)
* Email support: [support@asyncapi.org](mailto:support@asyncapi.org)

[More info here](https://example.com)

The Smartylighting Streetlights API allows you to remotely manage the city lights.
### Check out its awesome features:
* Turn a specific streetlight on/off 🌃
* Dim a specific streetlight 😎
* Receive real-time information about environmental lighting conditions 📈

###### Specification tags

* root-tag1

  [External docs description 1](https://www.asyncapi.com/)
* root-tag2

  Description 2
  [Find more info here.](https://www.asyncapi.com/)
* root-tag3

* root-tag4

  Description 4
* root-tag5

  [Find more info here.](https://www.asyncapi.com/)
`;

    const result = render(<Info asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render logo from an extension', () => {
    const asyncapi = new AsyncAPIDocument({
      "asyncapi": "2.2.0",
      "info": {
        "title": "Streetlights API",
        "version": "1.0.0",
        "x-logo": "example.com/image"
      },
    });
    const expected = `
# Streetlights API 1.0.0 documentation

![Streetlights API logo](example.com/image)
`;
    
    const result = render(<Info asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
