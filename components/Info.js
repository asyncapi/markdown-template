import { Text } from "@asyncapi/generator-react-sdk";

import { Header, Link, Image, List } from "./common";

export function Info({ asyncapi, params }) {
  const info = asyncapi.info();
  if (!info) {
    return null;
  }

  const specId = asyncapi.id();
  const externalDocs = asyncapi.externalDocs();
  const license = info.license();
  const termsOfService = info.termsOfService();
  const defaultContentType = asyncapi.defaultContentType();
  const contact = info.contact();

  const infoList = [];
  if (license) {
    infoList.push(license.url() ? (
      <>
        License:&nbsp;
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
        Terms of service:&nbsp;
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
        Default content type:&nbsp;
        <Link
          href={`https://www.iana.org/assignments/media-types/${defaultContentType}`}
        >
          {defaultContentType}
        </Link>
      </>
    );
  }
  if (contact) {
    contact.url() && infoList.push(
      <>
        Support:&nbsp;
        <Link
          href={contact.url()}
        >
          {contact.name() || 'Link'}
        </Link>
      </>
    );
    contact.email() && infoList.push(
      <>
        Email support:&nbsp;
        <Link
          href={`mailto:${contact.email()}`}
        >
          {contact.email()}
        </Link>
      </>
    );
  }
  if (specId) {
    infoList.push(`Specification ID: \`${specId}\``);
  }

  return (
    <Text>
      <Header type={1}>
        {info.title()} {params.version || info.version()} documentation
      </Header>

      {info.hasExt('x-logo') && (
        <Text>
          <Image src={info.ext('x-logo')} desc={`${info.title()} logo`} />
        </Text>
      )}

      {infoList.length && (
        <>
          <List list={infoList} />
          <Text />
        </>
      )}

      {externalDocs && (
        <Text newLines={2}>
          <Link
            href={externalDocs.url()}
          >
            {externalDocs.hasDescription() ? externalDocs.description() : 'Find more info here.'}
          </Link>
        </Text>
      )}

      {info.description() && (
        <Text>
          {info.description()}
        </Text>
      )}
    </Text>
  );
}
