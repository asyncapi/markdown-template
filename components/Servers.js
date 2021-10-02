import { Text } from "@asyncapi/generator-react-sdk";

import { Header, Table } from "./common";

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
  const headers = ['URL', 'Protocol', 'Description'];
  const rowRenderer = (entry) => [
    entry.url(),
    `${server.protocol()}${server.protocolVersion() ? ` ${server.protocolVersion()}` : ''}`,
    entry.description() || '-',
  ];

  return (
    <>
      <Text>
        <Header type={3}>{`**${serverName}** Server`}</Header>
        <Table headers={headers} rowRenderer={rowRenderer} data={[server]} />
      </Text>
      <ServerVariables variables={server.variables()} />
      <ServerSecurity protocol={server.protocol()} security={server.security()} asyncapi={asyncapi} />
    </>
  );
}

function ServerVariables({ variables }) {
  if (!variables || !Object.keys(variables).length) {
    return null;
  }

  const variableHeader = ['Name', 'Default value', 'Possible values', 'Description'];
  const variableRenderer = (variable) => [
    variable.name || '-',
    variable.hasDefaultValue() ? variable.defaultValue() : '*None*',
    variable.hasAllowedValues() ? variable.allowedValues().join(', ') : 'Any',
    variable.description() || '-',
  ];
  const variablesData = Object.entries(variables).map(([variableName, variable]) => {
    variable.name = variableName;
    return variable;
  });

  return (
    <Text>
      <Header type={4}>URL Variables</Header>
      <Table headers={variableHeader} rowRenderer={variableRenderer} data={variablesData} />
    </Text>
  );
}

function ServerSecurity({ protocol, security, asyncapi }) {
  if (isKafka(protocol)) {
    return KafkaServerSecurity({ protocol, security, asyncapi });
  }
  if (!security) {
    return null;
  }

  const securityHeader = ['Type', 'In', 'Name', 'Scheme', 'Format', 'Description'];
  const securityRenderer = (entry) => [
    entry.type() || '-',
    entry.in() || '-',
    entry.name() || '-',
    entry.scheme() || '-',
    entry.bearerFormat() || '-',
    entry.description() || '-',
  ];

  const components = asyncapi.components();
  const securityData = security.map(s => {
    const key = Object.keys(s.json())[0];
    return components.securityScheme(key);
  });

  return (
    <Text>
      <Header type={4}>Security Requirements</Header>
      <Table headers={securityHeader} rowRenderer={securityRenderer} data={securityData} />
    </Text>
  );
}

function isKafka(protocol) {
  return (protocol === 'kafka' || protocol === 'kafka-secure');
}

function KafkaServerSecurity({ protocol, security, asyncapi }) {
  let securityData;
  if (security) {
    const components = asyncapi.components();
    securityData = security.map(s => {
      const key = Object.keys(s.json())[0];
      return components.securityScheme(key);
    });
  }
  else {
    securityData = [null];
  }

  const securityHeader = ['Type', 'Description', 'security.protocol', 'sasl.mechanism'];

  const securityRenderer = (entry) => {
    let securityProtocol, saslMechanism;
    if (protocol === 'kafka') {
      if (entry) {
        securityProtocol = 'SASL_PLAINTEXT';
      }
      else {
        securityProtocol = 'PLAINTEXT';
      }
    }
    else {
      if (entry) {
        securityProtocol = 'SASL_SSL';
      }
      else {
        securityProtocol = 'SSL';
      }
    }
    if (entry) {
      switch (entry.type()) {
        case 'plain':
          saslMechanism = 'PLAIN';
          break;
        case 'scramSha256':
          saslMechanism = 'SCRAM-SHA-256';
          break;
        case 'scramSha512':
          saslMechanism = 'SCRAM-SHA-512';
          break;
        case 'oauth2':
          saslMechanism = 'OAUTHBEARER';
          break;
        case 'gssapi':
          saslMechanism = 'GSSAPI';
          break;
        case 'X509':
          securityProtocol = 'SSL';
          break;
      }
    }

    return [
      entry && entry.type() || '-',
      entry && entry.description() || '-',
      securityProtocol || '-',
      saslMechanism || '-'
    ];
  };

  return (
    <Text>
      <Header type={4}>Security Requirements</Header>
      <Table headers={securityHeader} rowRenderer={securityRenderer} data={securityData} />
    </Text>
  );
}
