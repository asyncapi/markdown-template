import { IndentationTypes, Text } from "@asyncapi/generator-react-sdk";

import { Header, ListItem, Link, Table, NewLine } from "./common";
import { ServerHelpers } from "../helpers/server";

export function Servers({ asyncapi }) {
  if (!asyncapi.hasServers()) {
    return null;
  }
  const servers = Object.entries(asyncapi.servers()).map(([serverName, server]) => (
    <Server serverName={serverName} server={server} asyncapi={asyncapi} />
  ));

  return (
    <>
      <Header type={2}>
        Servers
      </Header>
      {servers}
    </>
  );
}

function Server({ serverName, server, asyncapi }) {
  return (
    <>
      <Header type={3}>{`**${serverName}** Server`}</Header>
      <ServerInfo server={server} />
      <ServerVariables variables={server.variables()} />
      <ServerSecurity protocol={server.protocol()} security={server.security()} asyncapi={asyncapi} />
    </>
  );
}

function ServerInfo({ server }) {
  return (
    <Text>
      <Text>
        <ListItem>URL: `{server.url()}`</ListItem>
        <ListItem>Protocol: `{server.protocol()}{server.protocolVersion() ? ` ${server.protocolVersion()}` : ''}`</ListItem>
      </Text>
      {server.hasDescription() && (
        <Text>
          {server.description()}
        </Text>
      )}
    </Text>
  );
}

function ServerVariables({ variables }) {
  if (!variables || !Object.keys(variables).length) {
    return null;
  }

  const variableHeader = ['Name', 'Description', 'Default value', 'Allowed values'];
  const variableRenderer = ([variableName, variable]) => [
    variableName || '-',
    variable.description() || '-',
    variable.hasDefaultValue() ? `\`${variable.defaultValue()}\`` : '_None_',
    variable.hasAllowedValues() ? `${variable.allowedValues().map(v => `\`${v}\``).join(', ')}` : '_Any_',
  ];
  const variablesData = Object.entries(variables);

  return (
    <Text>
      <Header type={4}>URL Variables</Header>
      <Table headers={variableHeader} rowRenderer={variableRenderer} data={variablesData} />
    </Text>
  );
}

function ServerSecurity({ protocol, security, asyncapi }) {
  const securitySchemes =
    asyncapi.hasComponents() && asyncapi.components().securitySchemes();

  let renderedServerSecurities;
  if (
    !security ||
    !security.length ||
    !securitySchemes ||
    !Object.keys(securitySchemes).length
  ) {
    if (protocol === 'kafka' || protocol === 'kafka-secure') {
      renderedServerSecurities = (
        <ServerSecurityItem protocol={protocol} securitySchema={null} />
      );
    }
  } else {
    renderedServerSecurities = security
      .map(requirement => {
        const defKey = Object.keys(requirement.json())[0];
        const requiredScopes = requirement.json()[defKey];
        const def = securitySchemes[defKey];
        if (!def) {
          return null;
        }
        return (
          <ServerSecurityItem
            protocol={protocol}
            securitySchema={def}
            requiredScopes={requiredScopes}
            key={def.type() || protocol}
          />
        );
      })
      .filter(Boolean);

    if (renderedServerSecurities.length === 0) {
      return null;
    }
  }

  if (!renderedServerSecurities) {
    return null;
  }

  return (
    <Text>
      <Header type={4}>Security</Header>
      <Text>
        {renderedServerSecurities}
      </Text>
    </Text>
  );
}

function ServerSecurityItem({ protocol, securitySchema, requiredScopes = [] }) {
  let schemas = [];
  if (securitySchema) {
    if (securitySchema.name()) {
      schemas.push(<ListItem>Name: {securitySchema.name()}</ListItem>);
    }
    if (securitySchema.in()) {
      schemas.push(<ListItem>In: {securitySchema.in()}</ListItem>);
    }
    if (securitySchema.scheme()) {
      schemas.push(<ListItem>Scheme: {securitySchema.scheme()}</ListItem>);
    }
    if (securitySchema.bearerFormat()) {
      schemas.push(<ListItem>Bearer format: {securitySchema.bearerFormat()}</ListItem>);
    }
    if (securitySchema.openIdConnectUrl()) {
      schemas.push(
        <ListItem>
          OpenID Connect URL:{' '}
          <Link href={securitySchema.openIdConnectUrl()}>
            {securitySchema.openIdConnectUrl()}
          </Link>
        </ListItem>
      );
    }
  }
  if (protocol === 'kafka' || protocol === 'kafka-secure') {
    const { securityProtocol, saslMechanism } = ServerHelpers.getKafkaSecurity(
      protocol,
      securitySchema,
    );

    if (securityProtocol) {
      schemas.push(<ListItem>security.protocol: {securityProtocol}</ListItem>);
    }
    if (saslMechanism) {
      schemas.push(<ListItem>sasl.mechanism: {saslMechanism}</ListItem>);
    }
  }
  schemas.push(<ServerSecurityItemFlows securitySchema={securitySchema} requiredScopes={requiredScopes} />);

  schemas = schemas.filter(Boolean);
  if (schemas.length === 0) {
    return null;
  }

  const type = securitySchema && securitySchema.type() && ServerHelpers.securityType(securitySchema.type());
  return (
    <Text>
      {type && <ListItem>Type: `{type}`</ListItem>}
      {schemas.length && (
        <Text indent={2} type={IndentationTypes.SPACES}>
          {schemas}
        </Text>
      )}
      {securitySchema && securitySchema.hasDescription() && (
        <Text indent={2} type={IndentationTypes.SPACES}>
          {securitySchema.description()}
        </Text>
      )}
    </Text>
  );
}

function ServerSecurityItemFlows({ securitySchema, requiredScopes }) {
  const render = securitySchema && securitySchema.flows() && Object.keys(securitySchema.flows()).length;
  if (!render) {
    return null;
  }

  const flowsHeader = ['Flow', 'Auth URL', 'Token URL', 'Refresh URL', 'Scopes'];
  const flowsRenderer = ([flowName, flow]) => [
    ServerHelpers.flowName(flowName) || '-',
    flow.authorizationUrl() ? `[${flow.authorizationUrl()}](${flow.authorizationUrl()})` : '-',
    flow.tokenUrl() ? `[${flow.tokenUrl()}](${flow.tokenUrl()})` : '-',
    flow.refreshUrl() ? `[${flow.refreshUrl()}](${flow.refreshUrl()})` : '-',
    Object.keys(flow.scopes()).length ? Object.keys(flow.scopes()).map(v => `\`${v}\``).join(', ') : '-',
  ];
  const flowsData = Object.entries(securitySchema.flows());

  return (
    <ListItem>
      Flows:
      <NewLine numbers={2} />
      {requiredScopes.length && (
        <Text indent={2} type={IndentationTypes.SPACES} newLines={2}>
          Required scopes: {requiredScopes.map(v => `\`${v}\``).join(', ')} 
        </Text>
      )}
      <Text indent={2} type={IndentationTypes.SPACES}>
        <Table headers={flowsHeader} rowRenderer={flowsRenderer} data={flowsData} />
      </Text>
    </ListItem>
  );
}
