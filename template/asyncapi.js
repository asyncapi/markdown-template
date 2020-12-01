import React from "react";
import { File, Text } from "@asyncapi/generator-react-sdk";
import { generateExample, getHeadersExamples, getPayloadExamples } from "@asyncapi/generator-filters";

export default function MarkdownTemplate({ asyncapi, params }) {
  return (
    <File name={params.outFilename || 'asyncapi.md'}>
      <MainInfo asyncapi={asyncapi} />
      <TableOfContents asyncapi={asyncapi} />
      <Content asyncapi={asyncapi} />
    </File>
  );
}

function MainInfo({ asyncapi }) {
  return (
    <>
      <Header type={1}>
        {asyncapi.info().title()} {asyncapi.info().version()} documentation
      </Header>

      {asyncapi.info().description() && (
        <Text>
          {asyncapi.info().description()}
        </Text>
      )}

      {asyncapi.info().hasExt('x-logo') && (
        <Text>
          <Image src={asyncapi.info().ext('x-logo')} desc={`${asyncapi.info().title()} logo`} />
        </Text>
      )}
    </>
  );
}

function TableOfContents({ asyncapi }) {
  return (
    <>
      <Header type={2}>Table of Contents</Header>
      <Text>
        {asyncapi.info().termsOfService() && 
          <ListItem>
            <Link href="#terms-of-service">Terms of Service</Link>
          </ListItem>
        }
        {asyncapi.hasServers() && 
          <ListItem>
            <Link href="#servers">Servers</Link>
          </ListItem>
        }
        {asyncapi.hasChannels() && 
          <ListItem>
            <Link href="#channels">Channels</Link>
          </ListItem>
        }
      </Text>
    </>
  );
}

function Content({ asyncapi }) {
  return (
    <>
      <Info asyncapi={asyncapi} />
      <Channels asyncapi={asyncapi} />
    </>
  );
}

function Info({ asyncapi }) {
  return (
    <Text>
      <TermsOfService asyncapi={asyncapi} />
      <Servers asyncapi={asyncapi} />
    </Text>
  );
}

function TermsOfService({ asyncapi }) {
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

function Servers({ asyncapi }) {
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
  if (!variables) {
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

function Channels({ asyncapi }) {
  const channels = Object.entries(asyncapi.channels()).map(([channelName, channel]) => (
    <Channel channelName={channelName} channel={channel} />
  ));

  return (
    <>
      <Header type={2}>
        Channels
      </Header>
      {channels}
    </>
  );
}

function Channel({ channelName, channel }) {
  return (
    <Text>
      <Header type={3}>
        {`**${channelName}** Channel`}
      </Header>
      {channel.hasDescription() && (
        <Text newLines={2}>
          {channel.description()}
        </Text>
      )}
      {channel.hasParameters() && (
        <Parameters parameters={channel.parameters()} />
      )}
      {channel.hasPublish() && (
        <Operation operation={channel.publish()} />
      )}
      {channel.hasSubscribe() && (
        <Operation operation={channel.subscribe()} />
      )}
    </Text>
  );
}

function Parameters({ parameters }) {
  const params = Object.entries(parameters).map(([paramName, param]) => (
    <>
      <Header type={5}>{paramName}</Header>
      {param.hasDescription() && (
        <Text>
          {param.description()}
        </Text>
      )}
      <Schema schema={param.schema()} schemaName={paramName} hideTitle={true} />
    </>
  ));

  return (
    <Text>
      <Header type={4}>Channel Parameters</Header>
      {params}
    </Text>
  );
}

function Operation({ operation }) {
  const type = operation.isPublish() ? 'publish' : 'subscribe';
  return (
    <Text>
      <Header type={4}>{`\`${type}\` Operation`}</Header>
      {operation.summary() && (
        <Text newLines={2}>
          *{operation.summary()}*
        </Text>
      )}
      {operation.hasDescription() && (
        <Text newLines={2}>
          {operation.description()}
        </Text>
      )}
      {operation.hasMultipleMessages() ? (
        <>
          <Text newLines={2}>
            Accepts **one of** the following messages:
          </Text>
          {operation.messages().map(msg => (
            <Message title={`Message \`${msg.uid()}\``} message={msg} />
          ))}
        </>
      ) : (
        <Message title='Message' message={operation.message(0)} />
      )}
    </Text>
  );
}

function Message({ message, title = 'Message' }) {
  return (
    <>
      <Header type={5}>{title}</Header>
      {message.summary() && (
        <Text newLines={2}>
          *{message.summary()}*
        </Text>
      )}
      {message.hasDescription() && (
        <Text newLines={2}>
          {message.description()}
        </Text>
      )}

      {message.headers() && (
        <>
          <Header type={6}>Headers</Header>
          <Schema schema={message.headers()} schemaName='Message Headers' hideTitle={true} />
          <Example type='headers' message={message} />
        </>
      )}

      {message.payload() && (
        <>
          <Header type={6}>Payload</Header>
          <Schema schema={message.payload()} schemaName='Message Payload' hideTitle={true} />
          <Example type='payload' message={message} />
        </>
      )}

      {message.hasTags() && (
        <>
          <Header type={6}>Tags</Header>
          <Tags tags={message.tags()} />
        </>
      )}
    </>
  )
}

function Tags({ tags = [] }) {
  return (
    <Text>
      {tags.map(tag => (
        <ListItem>{tag.name()}</ListItem>
      ))}
    </Text>
  );
}

function Example({ type = 'headers', message }) {
  if (type === 'headers') {
    const examples = getHeadersExamples(message);
    if (examples) {
      return (
        <>
          <Header type={6}>Examples of headers</Header>
          {examples.map(ex => (
            <Text newLines={2}>
              <CodeBlock language='json'>{JSON.stringify(ex, null, 2)}</CodeBlock>
            </Text>
          ))}
        </>
      );
    }

    return (
      <>
        <Header type={6}>Examples of headers _(generated)_</Header>
        <Text newLines={2}>
          <CodeBlock language='json'>{generateExample(message.headers().json())}</CodeBlock>
        </Text>
      </>
    );
  } else {
    const examples = getPayloadExamples(message);
    if (examples) {
      return (
        <>
          <Header type={6}>Examples of payload</Header>
          {examples.map(ex => (
            <Text newLines={2}>
              <CodeBlock language='json'>{JSON.stringify(ex, null, 2)}</CodeBlock>
            </Text>
          ))}
        </>
      );
    }

    return (
      <>
        <Header type={6}>Examples of payload _(generated)_</Header>
        <Text newLines={2}>
          <CodeBlock language='json'>{generateExample(message.payload().json())}</CodeBlock>
        </Text>
      </>
    );
  }
}

function Schema({ schema, schemaName, hideTitle = false }) {
  const headers = ['Name', 'Type', 'Description', 'Accepted values'];
  
  let properties = schema.properties();
  properties = Object.keys(properties).length ? Object.entries(properties).map(([propName, prop]) => (
    <SchemaProp prop={prop} propName={propName} path='' required={isRequired(schema, propName)} />
  )) : <SchemaProp prop={schema} propName={schemaName} path='' />;

  return (
    <Text>
      {hideTitle === false ? <Header type={4}>{schemaName}</Header> : null}
      <TableHead headers={headers} />
      {properties}
    </Text>
  );
}

function SchemaProp({ prop, propName, required = false, path = '', circularPropsParent = [] }) {
  const anyOf = prop.anyOf() && prop.anyOf().map((p, idx) => (
    <SchemaProp prop={p} propName={idx} path={propName || buildPath(path, idx)} />
  ));
  const allOf = prop.allOf() && prop.allOf().map((p, idx) => (
    <SchemaProp prop={p} propName={idx} path={propName || buildPath(path, idx)} />
  ));
  const oneOf = prop.oneOf() && prop.oneOf().map((p, idx) => (
    <SchemaProp prop={p} propName={idx} path={propName || buildPath(path, idx)} />
  ));
  const properties = Object.entries(prop.properties()).map(([pName, p]) => {
    const circProps = p.circularProps();
    const isPropCircular = circularPropsParent.includes(pName);
    
    if (isPropCircular === true) {
      return (
        <SchemaPropRow
          prop={p} 
          propName={pName}
          path={propName || buildPath(path, pName)} 
          required={isRequired(prop, pName)}
          isCircular={isPropCircular}
        />
      );
    } else {
      return (
        <SchemaProp 
          prop={p} 
          propName={pName} 
          path={propName || buildPath(path, pName)} 
          required={isRequired(prop, pName)}
          circularPropsParent={circProps}
        />
      );
    }
  });
  const additionalProperties = prop.additionalProperties() && prop.additionalProperties().properties 
    ? Object.entries(prop.additionalProperties()).map(([pName, p]) => (
      <SchemaProp prop={p} propName={pName} path={propName || buildPath(path, pName)} required={isRequired(prop.additionalProperties(), pName)} />
    )) : null;
  const items = prop.items() && prop.items().properties
    ? Object.entries(prop.items().properties()).map(([pName, p]) => {
      const isCirc = p.isCircular();

      if (isCirc === true) {
        return (
          <SchemaPropRow
            prop={p} 
            propName={pName}
            path={propName || buildPath(path, pName)} 
            required={isRequired(prop, pName)}
            isCircular={isCirc}
          />
        );
      } else {
        return (
          <SchemaProp 
            prop={p} 
            propName={pName} 
            path={propName || buildPath(path, pName)} 
            required={isRequired(prop.items(), pName)}
          />
        );
      }
    }) : null;

  return (
    <>
      <SchemaPropRow prop={prop} propName={propName} required={required} path={path} />
      {anyOf}
      {allOf}
      {oneOf}
      {properties}
      {additionalProperties}
      {items}
    </>
  );
}

function SchemaPropRow({ prop, propName, required = false, path = '', isCircular = false }) {
  const acceptedValues = prop.enum() && prop.enum().length ? prop.enum().join(', ') : '_Any_';
  const types = `${prop.anyOf() ? `anyOf` : ''}${prop.allOf() ? `allOf` : ''}${prop.oneOf() ? `oneOf` : ''}${prop.items() && prop.items().type() ? `${prop.items().type()}` : ''}`;
  const rowRenderer = () => [
    `${tree(path, propName)}${required ? ' **(required)**': ''}`,
    `${prop.type() || ''}${types}`,
    `${prop.description() || '-'}${isCircular ? ' **[CIRCULAR]**': ''}`,
    acceptedValues
  ];

  return <TableRow rowRenderer={rowRenderer} entry={prop} />;
}

function tree(path, field = '') {
  const filteredPaths = path.split('.').filter(Boolean);
  if (!filteredPaths.length) return field;
  const dottedPath = filteredPaths.join('.');
  return `${dottedPath}.${field}`;
}

function buildPath(propName, path) {
  if (!path) return propName;
  return `${path}.${propName}`;
}

function isRequired(obj, key) {
  return obj && Array.isArray(obj.required) && !!(obj.required.includes(key));
}

// COMMON COMPONENTS

function Header({ type = 1, childrenContent = "" }) {
  const hashes = Array(type).fill("#").join("");
  return <Text newLines={2}>{`${hashes} ${childrenContent}`}</Text>
}

function Link({ href = "", childrenContent = "" }) {
  return `[${childrenContent}](${href})`;
}

function Image({ src = "", desc = "", childrenContent = "" }) {
  return `![${desc || childrenContent}](${src})`;
}

function ListItem({ type = "*", childrenContent = "" }) {
  return <Text>{`${type} ${childrenContent}`}</Text>;
}

function Table({ headers = [], rowRenderer = () => [], data = [] }) {
  const row = entry => <Text>{`| ${rowRenderer(entry).join(' | ')} |`}</Text>;
  return (
    <>
      <TableHead headers={headers} />
      {data.map(entry => row(entry))}
    </>
  );
}

function TableHead({ headers = [] }) {
  const header = `| ${headers.join(' | ')} |`;
  const breaks = `|${Array(headers.length).fill('-|').join('')}`;

  return (
    <>
      <Text>{header}</Text>
      <Text>{breaks}</Text>
    </>
  );
}

function TableRow({ rowRenderer = () => [], entry }) {
  return <Text>{`| ${rowRenderer(entry).join(' | ')} |`}</Text>;
}

function CodeBlock({ language = 'json', childrenContent = '' }) {
  return (
    <Text>
      {'```'}{language}{'\n'}
      {childrenContent}{'\n'}
      {'```'}
    </Text>
  );
}
