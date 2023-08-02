import { render } from '@asyncapi/generator-react-sdk';
import { TagsV2, TagV2 } from '@asyncapi/parser';

import { Tags } from '../../components/Tags';

function createTagsMock(tags = []) {
  return {
    tags() {
      const tagsModels = tags.map(tag => new TagV2(tag));
      return new TagsV2(tagsModels);
    }
  };
}

describe('Tags component', () => {
  it('should render list of tags', () => {
    const tags = [
      {
        name: 'root-tag1',
        externalDocs: {
          description: 'External docs description 1',
          url: 'https://www.asyncapi.com/'
        }
      },
      {
        name: 'root-tag2',
        description: 'Description 2',
        externalDocs: {
          url: 'https://www.asyncapi.com/'
        }
      },
      {
        name: 'root-tag3'
      },
      {
        name: 'root-tag4',
        description: 'Description 4'
      },
      {
        name: 'root-tag5',
        externalDocs: {
          url: 'https://www.asyncapi.com/'
        }
      }
    ];

    const expected = `
##### Tags

| Name | Description | Documentation |
|---|---|---|
| root-tag1 | - | [External docs description 1](https://www.asyncapi.com/) |
| root-tag2 | Description 2 | [Find more info here](https://www.asyncapi.com/) |
| root-tag3 | - | - |
| root-tag4 | Description 4 | - |
| root-tag5 | - | [Find more info here](https://www.asyncapi.com/) |
`;
    
    const result = render(<Tags item={createTagsMock(tags)} />);
    expect(result.trim()).toEqual(expected.trim(tags));
  });

  it('should render nothing if tags', () => {
    const result = render(<Tags item={createTagsMock()} />);
    expect(result).toEqual('');
  });

  it('should render nothing if tags are empty', () => {
    const result = render(<Tags item={createTagsMock([])} />);
    expect(result).toEqual('');
  });
});
