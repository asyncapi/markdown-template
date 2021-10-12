import { render } from '@asyncapi/generator-react-sdk';

import { Tags } from "../../components/Tags";
import TagModel from '@asyncapi/parser/lib/models/tag';

describe('Tags component', () => {
  it('should render list of tags', () => {
    const tags = [
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
    ].map(t => new TagModel(t));
    const expected = `
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
    
    const result = render(<Tags tags={tags} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render nothing if tags prop is undefined', () => {
    const result = render(<Tags />);
    expect(result).toEqual('');
  });
});
