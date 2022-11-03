import { IndentationTypes, Text } from '@asyncapi/generator-react-sdk';

import { Header, ListItem, Link, Table, NewLine } from './common';

import { ServerHelpers } from '../helpers/server';

const KAFKA_PROTOCOL = 'kafka';
const KAFKA_SECURE_PROTOCOL = 'kafka-secure';

export function Security({ protocol, security, header = 'Security' }) {
  let renderedRequirements;
  if (
    !security ||
    !security.length
  ) {
    if (protocol === KAFKA_PROTOCOL || protocol === KAFKA_SECURE_PROTOCOL) {
      renderedRequirements = (
        <SecurityRequirementItem protocol={protocol} requirement={null} />
      );
    }
  } else {
    renderedRequirements = security
      .map((requirement, idx) => (
        <SecurityRequirementItem protocol={protocol} requirement={requirement} index={idx} key={idx} />
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
      <Header type={4}>{header}</Header>
      <Text>
        {renderedRequirements}
      </Text>
    </Text>
  );
}

function SecurityRequirementItem({ protocol, requirement, index = 0 }) {
  let renderedServerSecurities;
  if (!requirement && (protocol === KAFKA_PROTOCOL || protocol === KAFKA_SECURE_PROTOCOL)) {
    renderedServerSecurities = (
      <SecurityItem protocol={protocol} securitySchema={null} />
    );
  } else if (requirement) {
    renderedServerSecurities = requirement.all()
      .map(requirementItem => {
        const securitySchema = requirementItem.scheme();
        return (
          <SecurityItem
            protocol={protocol}
            securitySchema={securitySchema}
            requiredScopes={requirementItem.scopes()}
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

function SecurityItem({ protocol, securitySchema, requiredScopes = [] }) {
  let schemas = [];
  renderSecuritySchemasBasic({ securitySchema, schemas });
  renderSecuritySchemasKafka({ protocol, securitySchema, schemas });
  renderSecuritySchemasFlows({ securitySchema, requiredScopes, schemas });
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

function renderSecuritySchemasBasic({ securitySchema, schemas }) {
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

function renderSecuritySchemasKafka({ protocol, securitySchema, schemas }) {
  const isKafkaProtocol = protocol === KAFKA_PROTOCOL || protocol === KAFKA_SECURE_PROTOCOL;
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

const flowsHeader = ['Flow', 'Auth URL', 'Token URL', 'Refresh URL', 'Scopes'];
function flowsRenderer([flowName, flow]) {
  return [
    ServerHelpers.flowName(flowName) || '-',
    flow && flow.authorizationUrl() ? `[${flow.authorizationUrl()}](${flow.authorizationUrl()})` : '-',
    flow && flow.tokenUrl() ? `[${flow.tokenUrl()}](${flow.tokenUrl()})` : '-',
    flow && flow.refreshUrl() ? `[${flow.refreshUrl()}](${flow.refreshUrl()})` : '-',
    flow && Object.keys(flow.scopes()).length ? Object.keys(flow.scopes()).map(v => `\`${v}\``).join(', ') : '-',
  ];
}

function renderSecuritySchemasFlows({ securitySchema, requiredScopes, schemas }) {
  const flows = securitySchema?.flows();
  if (!flows) {
    return;
  }

  const flowsData = Object.entries({
    authorizationCode: flows.authorizationCode(),
    clientCredentials: flows.clientCredentials(),
    implicit: flows.implicit(),
    password: flows.password(),
  });
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
