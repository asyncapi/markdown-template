import React from "react";
import { File, Text } from "@asyncapi/generator-react-sdk";
import * as _ from 'lodash';
import { sample } from 'openapi-sampler';

export default function MarkdownTemplate({ asyncapi }) {
  return (
    <File>
      <Text>

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

        <Content asyncapi={asyncapi} />
      </Text>
    </File>
  );
}

// COMMON COMPONENTS

function Header({ type = 1, childrenContent = "" }) {
  const hashes = Array(type).fill("#").join("");
  return <Text newLines={2}>{`${hashes} ${childrenContent}`}</Text>
}

function Link({ href = "", childrenContent = "" }) {
  return `[${childrenContent}](${href})`;
}

function HtmlAnchor({ href = "", type = 1, childrenContent = "" }) {
  return (
    <>
      <Text>{`<a name="${href}"></a>`}</Text>
      <Header type={type}>{childrenContent}</Header>
    </>
  );
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

function Tags({ tags = [] }) {
  return (
    <Text>
      {tags.map(tag => (
        <ListItem>{tag.name()}</ListItem>
      ))}
    </Text>
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
      <HtmlAnchor href="terms-of-service" type={2}>
        Terms of service
      </HtmlAnchor>
      <Link href={termsOfService}>{termsOfService}</Link>
    </Text>
  ) : "";
}


function Servers({ asyncapi }) {
  if (!asyncapi.hasServers()) {
    return null;
  }
  const servers = asyncapi.servers();

  return (
    <>
      <HtmlAnchor href="servers" type={2}>
        Servers
      </HtmlAnchor>
      {Object.entries(servers).map(([serverName, server]) => <Server serverName={serverName} server={server} asyncapi={asyncapi} />)}
    </>
  );
}

function Server({ serverName, server, asyncapi }) {
  const headers = ['URL', 'Protocol', 'Description'];
  const rowRenderer = (entry) => [entry.url(), `${server.protocol()}${server.protocolVersion() ? ` ${server.protocolVersion()}` : ''}`, entry.description()];

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
  const variablesData = Object.entries(variables).map(([variableName, variable]) => {
    variable.name = variableName;
    return variable;
  })
  const variableHeader = ['Name', 'Default value', 'Possible values', 'Description'];
  const variableRenderer = (variable) => [
    variable.name || '-',
    variable.hasDefaultValue() ? variable.defaultValue() : '*None*',
    variable.hasAllowedValues() ? variable.allowedValues().join(', ') : 'Any',
    variable.description() || '-',
  ];

  return variables ? (
    <Text>
      <Header type={4}>URL Variables</Header>
      <Table headers={variableHeader} rowRenderer={variableRenderer} data={variablesData} />
    </Text>
  ) : null;
}

function ServerSecurity({ security, asyncapi }) {
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
  const data = security.map(s => {
    const key = Object.keys(s.json())[0];
    return components.securityScheme(key);
  })
  
  return security ? (
    <Text>
      <Header type={4}>Security Requirements</Header>
      <Table headers={securityHeader} rowRenderer={securityRenderer} data={data} />
    </Text>
  ) : null;
}

function Channels({ asyncapi }) {
  const channels = asyncapi.channels();

  return (
    <>
      <HtmlAnchor href="channels" type={2}>
        Channels
      </HtmlAnchor>
      {Object.entries(channels).map(([channelName, channel]) => <Channel channelName={channelName} channel={channel} asyncapi={asyncapi} />)}
    </>
  );
}

function Channel({ channelName, channel, asyncapi }) {
  return (
    <Text>
      <HtmlAnchor href={`${channelName}-channels`} type={3}>
        {`**${channelName}** Channel`}
      </HtmlAnchor>
      {channel.hasDescription() && (
        <Text newLines={2}>
          {channel.description()}
        </Text>
      )}
      {channel.hasParameters() && (
        <Parameters parameters={channel.parameters()} />
      )}
      {channel.hasPublish() && (
        <Operation operation={channel.publish()} channelName={channelName} />
      )}
      {channel.hasSubscribe() && (
        <Operation operation={channel.subscribe()} channelName={channelName} />
      )}
    </Text>
  );
}

function Parameters({ parameters = {} }) {
  const params = Object.entries(parameters).map(([paramName, param]) => (
    <Text>
      <Header type={5}>{paramName}</Header>
      {param.hasDescription() && (
        <Text>
          {param.description()}
        </Text>
      )}
      <Schema schema={param.schema()} schemaName={paramName} hideTitle={true} />
    </Text>
  ));

  return (
    <Text>
      <Header type={4}>Channel Parameters</Header>
      {params}
    </Text>
  );
}

function Operation({ operation, channelName }) {
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
            <>
              <Header type={5}>Message `{msg.uid()}`</Header>
              <Message message={msg} />
            </>
          ))}
        </>
      ) : (
        <>
          <Header type={5}>Message</Header>
          <Message message={operation.message(0)} />
        </>
      )}
    </Text>
  );
}

function Message({ message }) {
  return (
    <>
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

function generateExample(schema, options) {
  return JSON.stringify(sample(schema, options || {}) || '', null, 2);
}

function getHeadersExamples(msg) {
  if (Array.isArray(msg.examples()) && msg.examples().find(e => e.headers)) {
    // Instead of flat or flatmap use this.
    return _.flatMap(msg.examples().map(e => e.headers).filter(Boolean));
  }
  
  if (msg.headers() && msg.headers().examples()) {
    return msg.headers().examples();
  }
}

function getPayloadExamples(msg) {
  if (Array.isArray(msg.examples()) && msg.examples().find(e => e.payload)) {
    // Instead of flat or flatmap use this.
    return _.flatMap(msg.examples().map(e => e.payload).filter(Boolean));
  }
  
  if (msg.payload() && msg.payload().examples()) {
    return msg.payload().examples();
  }
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
    console.log(examples)
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
