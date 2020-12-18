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
      <ServerSecurity security={server.security()} asyncapi={asyncapi} />
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

function ServerSecurity({ security, asyncapi }) {
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
