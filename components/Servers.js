import { IndentationTypes, Text } from "@asyncapi/generator-react-sdk";

import { Bindings } from "./Bindings";
import { Extensions } from "./Extensions";
import { Header, ListItem, Link, Table, NewLine } from "./common";

import { ServerHelpers } from "../helpers/server";
import { FormatHelpers } from "../helpers/format";

export function Servers({ asyncapi }) {
  if (!asyncapi.hasServers()) {
    return null;
  }
  const servers = Object.entries(asyncapi.servers()).map(([serverName, server]) => (
    <Server serverName={serverName} server={server} asyncapi={asyncapi} key={serverName} />
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
    <Text>
      <Header type={3}>{`\`${serverName}\` Server`}</Header>
      <ServerInfo server={server} />
      <ServerVariables variables={server.variables()} />
      <ServerSecurity protocol={server.protocol()} security={server.security()} asyncapi={asyncapi} />

      <Bindings
        name="Server specific information"
        item={server}
      />
      <Extensions name="Server Extensions" item={server} />
    </Text>
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
    variable.hasDefaultValue() ? FormatHelpers.inlineCode(variable.defaultValue()) : '_None_',
    variable.hasAllowedValues() ? `${variable.allowedValues().map(FormatHelpers.inlineCode).join(', ')}` : '_Any_',
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

  let renderedRequirements;
  if (
    !security ||
    !security.length ||
    !securitySchemes ||
    !Object.keys(securitySchemes).length
  ) {
    if (protocol === 'kafka' || protocol === 'kafka-secure') {
      renderedRequirements = (
        <SecurityRequirementItem protocol={protocol} requirement={null} />
      );
    }
  } else {
    renderedRequirements = security
      .map((requirement, idx) => (
        <SecurityRequirementItem protocol={protocol} requirement={requirement} securitySchemes={securitySchemes} index={idx} key={idx} />
      ))
      .filter(Boolean);

    if (renderedRequirements.length === 0) {
      return null;
    }
  }

  if (!renderedRequirements) {
    return null;
  }

  return (
    <Text>
      <Header type={4}>Security</Header>
      <Text>
        {renderedRequirements}
      </Text>
    </Text>
  );
}

function SecurityRequirementItem({ protocol, requirement, securitySchemes, index = 0 }) {
  let renderedServerSecurities;
  if (requirement === null && (protocol === 'kafka' || protocol === 'kafka-secure')) {
    renderedServerSecurities = (
      <ServerSecurityItem protocol={protocol} securitySchema={null} />
    );
  } else if (requirement) {
    renderedServerSecurities = Object.entries(requirement.json())
      .map(([requiredKey, requiredScopes]) => {
        const securitySchema = securitySchemes[requiredKey];
        if (!securitySchema) {
          return;
        }
        return (
          <ServerSecurityItem
            protocol={protocol}
            securitySchema={securitySchema}
            requiredScopes={requiredScopes}
            key={securitySchema.type() || protocol}
          />
        );
      })
      .filter(Boolean);

    if (!renderedServerSecurities.length) {
      return null;
    }
  } 

  if (!renderedServerSecurities) {
    return null;
  }

  return (
    <Text>
      <Header type={5}>Security Requirement {`${index + 1}`}</Header>
      <Text>
        {renderedServerSecurities}
      </Text>
    </Text>
  );
}

function ServerSecurityItem({ protocol, securitySchema, requiredScopes = [] }) {
  let schemas = [];
  renderServerSecuritySchemasBasic({ securitySchema, schemas });
  renderServerSecuritySchemasKafka({ protocol, securitySchema, schemas });
  renderServerSecuritySchemasFlows({ securitySchema, requiredScopes, schemas })
  schemas = schemas.filter(Boolean);

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

function renderServerSecuritySchemasBasic({ securitySchema, schemas }) {
  if (securitySchema) {
    if (securitySchema.name()) {
      schemas.push(<ListItem key='name'>Name: {securitySchema.name()}</ListItem>);
    }
    if (securitySchema.in()) {
      schemas.push(<ListItem key='in'>In: {securitySchema.in()}</ListItem>);
    }
    if (securitySchema.scheme()) {
      schemas.push(<ListItem key='scheme'>Scheme: {securitySchema.scheme()}</ListItem>);
    }
    if (securitySchema.bearerFormat()) {
      schemas.push(<ListItem key='bearerFormat'>Bearer format: {securitySchema.bearerFormat()}</ListItem>);
    }
    if (securitySchema.openIdConnectUrl()) {
      schemas.push(
        <ListItem key='openIdConnectUrl'>
          OpenID Connect URL:{' '}
          <Link href={securitySchema.openIdConnectUrl()}>
            {securitySchema.openIdConnectUrl()}
          </Link>
        </ListItem>
      );
    }
  }
}

function renderServerSecuritySchemasKafka({ protocol, securitySchema, schemas }) {
  const isKafkaProtocol = protocol === 'kafka' || protocol === 'kafka-secure';
  if (!isKafkaProtocol) {
    return;
  }

  const { securityProtocol, saslMechanism } = ServerHelpers.getKafkaSecurity(
    protocol,
    securitySchema,
  );

  if (securityProtocol) {
    schemas.push(<ListItem key='security.protocol'>security.protocol: {securityProtocol}</ListItem>);
  }
  if (saslMechanism) {
    schemas.push(<ListItem key='sasl.mechanism'>sasl.mechanism: {saslMechanism}</ListItem>);
  }
}

function renderServerSecuritySchemasFlows({ securitySchema, requiredScopes, schemas }) {
  const hasFlows = securitySchema && securitySchema.flows() && Object.keys(securitySchema.flows()).length;
  if (!hasFlows) {
    return;
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

  schemas.push(
    <ListItem key='flows'>
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
