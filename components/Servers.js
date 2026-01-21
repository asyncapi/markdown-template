import { Text } from '@asyncapi/generator-react-sdk';

import PropTypes from 'prop-types';
import { Bindings } from './Bindings';
import { Extensions } from './Extensions';
import { Security } from './Security';
import { Tags } from './Tags';
import { Header, ListItem, Table } from './common';

import { FormatHelpers } from '../helpers/format';

export function Servers({ asyncapi }) {
  const servers = asyncapi.servers();
  if (servers.isEmpty()) {
    return null;
  }

  const serversInfo = servers.all().map(server => (
    <Server server={server} asyncapi={asyncapi} key={server.id()} />
  ));

  return (
    <>
      <Header type={2}>
        Servers
      </Header>
      {serversInfo}
    </>
  );
}

function Server({ server, asyncapi }) {
  const serverName = server.id();
  return (
    <Text>
      <Header type={3}>{`\`${serverName}\` Server`}</Header>
      <ServerInfo server={server} />
      <ServerVariables variables={server.variables()} />
      <Security protocol={server.protocol()} security={server.security()} />

      <Tags name="Server tags" item={server} />
      <Bindings
        name="Server specific information"
        item={server}
      />
      <Extensions name="Server extensions" item={server} />
    </Text>
  );
}

function ServerInfo({ server }) {
  return (
    <Text>
      <Text>
        <ListItem>Host: `{server.host()}${server.pathname() ? server.pathname() : ''}`</ListItem>
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
ServerInfo.propTypes = {
  server: PropTypes.shape({
    host: PropTypes.func.isRequired,
    pathname: PropTypes.func,
  }).isRequired,
};

const variableHeader = ['Name', 'Description', 'Default value', 'Allowed values'];
const variableRenderer = (variable) => [
  variable.id() || '-',
  variable.description() || '-',
  variable.hasDefaultValue() ? FormatHelpers.inlineCode(variable.defaultValue()) : '_None_',
  variable.hasAllowedValues() ? `${variable.allowedValues().map(FormatHelpers.inlineCode).join(', ')}` : '_Any_',
];

function ServerVariables({ variables }) {
  if (variables.isEmpty()) {
    return null;
  }
  const variablesData = variables.all();

  return (
    <Text>
      <Header type={4}>URL Variables</Header>
      <Table headers={variableHeader} rowRenderer={variableRenderer} data={variablesData} />
    </Text>
  );
}
