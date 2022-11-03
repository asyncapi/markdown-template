import { Text } from '@asyncapi/generator-react-sdk';

import { Tags } from './Tags';
import { Header, Link, Image, List, NewLine } from './common';

export function Info({ asyncapi, params = {} }) {
  const info = asyncapi.info();

  const defaultContentType = asyncapi.defaultContentType();
  const specId = info.id();
  const termsOfService = info.termsOfService();
  const license = info.license();
  const contact = info.contact();
  const externalDocs = info.externalDocs();
  const extensions = info.extensions();

  const infoList = [];
  if (specId) {
    infoList.push(`Specification ID: \`${specId}\``);
  }
  if (license) {
    infoList.push(license.url() ? (
      <>
        License:{' '}
        <Link
          href={license.url()}
        >
          {license.name()}
        </Link>
      </>
    ) : `License: ${license.name()}`);
  }
  if (termsOfService) {
    infoList.push(
      <>
        Terms of service:{' '}
        <Link
          href={termsOfService}
        >
          {termsOfService}
        </Link>
      </>
    );
  }
  if (defaultContentType) {
    infoList.push(
      <>
        Default content type:{' '}
        <Link
          href={`https://www.iana.org/assignments/media-types/${defaultContentType}`}
        >
          {defaultContentType}
        </Link>
      </>
    );
  }
  if (contact) {
    if (contact.url()) {
      infoList.push(
        <>
          Support:{' '}
          <Link
            href={contact.url()}
          >
            {contact.name() || 'Link'}
          </Link>
        </>
      );
    }
    if (contact.email()) {
      infoList.push(
        <>
          Email support:{' '}
          <Link
            href={`mailto:${contact.email()}`}
          >
            {contact.email()}
          </Link>
        </>
      );
    }
  }

  return (
    <Text>
      <Header type={1}>
        {info.title()} {params.version || info.version()} documentation
      </Header>

      {extensions.has('x-logo') && (
        <Text>
          <Image src={extensions.get('x-logo').value()} desc={`${info.title()} logo`} />
        </Text>
      )}

      {infoList.length && (
        <>
          <List list={infoList} />
          <NewLine />
        </>
      )}

      {externalDocs && (
        <Text newLines={2}>
          <Link
            href={externalDocs.url()}
          >
            {externalDocs.description() || 'Find more info here.'}
          </Link>
        </Text>
      )}

      {info.hasDescription() && (
        <Text>
          {info.description()}
        </Text>
      )}

      <Tags name="Specification tags" item={info} />
    </Text>
  );
}
