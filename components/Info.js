import { Text } from "@asyncapi/generator-react-sdk";

import { Header, Link, Image } from "./common";

export function Info({ asyncapi }) {
  const info = asyncapi.info();
  return (
    <>
      <Header type={1}>
        {info.title()} {info.version()} documentation
      </Header>

      {info.description() && (
        <Text>
          {info.description()}
        </Text>
      )}

      {info.hasExt('x-logo') && (
        <Text>
          <Image src={info.ext('x-logo')} desc={`${info.title()} logo`} />
        </Text>
      )}
    </>
  );
}

export function TermsOfService({ asyncapi }) {
  const termsOfService = asyncapi.info().termsOfService();
  return termsOfService ? (
    <Text newLines={2}>
      <Header type={2}>
        Terms of service
      </Header>
      <Link href={termsOfService}>{termsOfService}</Link>
    </Text>
  ) : null;
}
