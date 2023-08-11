import { File } from '@asyncapi/generator-react-sdk';
import { Asyncapi } from '../components/Asyncapi';

export default function({ asyncapi, params = {} }) {
  return (
    <File name={params.outFilename || 'asyncapi.md'}>
      <Asyncapi asyncapi={asyncapi} params={params} />
    </File>
  );
}
