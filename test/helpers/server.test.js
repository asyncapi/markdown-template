import SecurityScheme from '@asyncapi/parser/lib/models/security-scheme';

import { ServerHelpers } from '../../helpers/server';

describe('ServerHelpers', () => {
  describe('.securityType', () => {
    test('should return a nicer type for apiKey', () => {
      const result = ServerHelpers.securityType('apiKey');
      expect(result).toEqual('API key');
    });

    test('should return a nicer type for oauth2', () => {
      const result = ServerHelpers.securityType('oauth2');
      expect(result).toEqual('OAuth2');
    });

    test('should return a nicer type for openIdConnect', () => {
      const result = ServerHelpers.securityType('openIdConnect');
      expect(result).toEqual('Open ID');
    });

    test('should return a nicer type for http', () => {
      const result = ServerHelpers.securityType('http');
      expect(result).toEqual('HTTP');
    });

    test('should return a nicer type for userPassword', () => {
      const result = ServerHelpers.securityType('userPassword');
      expect(result).toEqual('User/Password');
    });

    test('should return a nicer type for X509', () => {
      const result = ServerHelpers.securityType('X509');
      expect(result).toEqual('X509');
    });

    test('should return a nicer type for symmetricEncryption', () => {
      const result = ServerHelpers.securityType('symmetricEncryption');
      expect(result).toEqual('Symmetric Encription');
    });

    test('should return a nicer type for asymmetricEncryption', () => {
      const result = ServerHelpers.securityType('asymmetricEncryption');
      expect(result).toEqual('Asymmetric Encription');
    });

    test('should return a nicer type for httpApiKey', () => {
      const result = ServerHelpers.securityType('httpApiKey');
      expect(result).toEqual('HTTP API key');
    });

    test('should return a nicer type for scramSha256', () => {
      const result = ServerHelpers.securityType('scramSha256');
      expect(result).toEqual('ScramSha256');
    });

    test('should return a nicer type for scramSha512', () => {
      const result = ServerHelpers.securityType('scramSha512');
      expect(result).toEqual('ScramSha512');
    });

    test('should return a nicer type for gssapi', () => {
      const result = ServerHelpers.securityType('gssapi');
      expect(result).toEqual('GSSAPI');
    });

    test('should return a nicer type for plain', () => {
      const result = ServerHelpers.securityType('plain');
      expect(result).toEqual('PLAIN');
    });

    test('should return a nicer type for unspecified', () => {
      const result = ServerHelpers.securityType('custom');
      expect(result).toEqual('API key');
    });
  });

  describe('.flowName', () => {
    test('should return a nicer name for implicit', () => {
      const result = ServerHelpers.flowName('implicit');
      expect(result).toEqual('Implicit');
    });

    test('should return a nicer name for password', () => {
      const result = ServerHelpers.flowName('password');
      expect(result).toEqual('Password');
    });

    test('should return a nicer name for clientCredentials', () => {
      const result = ServerHelpers.flowName('clientCredentials');
      expect(result).toEqual('Client credentials');
    });

    test('should return a nicer name for authorizationCode', () => {
      const result = ServerHelpers.flowName('authorizationCode');
      expect(result).toEqual('Authorization Code');
    });

    test('should return a nicer name for unspecified', () => {
      const result = ServerHelpers.flowName('custom');
      expect(result).toEqual('Implicit');
    });
  });

  describe('.getKafkaSecurity', () => {
    test('should return a appropriate values only for `kafka` protocol', () => {
      const { securityProtocol } = ServerHelpers.getKafkaSecurity('kafka');
      expect(securityProtocol).toEqual('PLAINTEXT');
    });

    test('should return a appropriate securityProtocol for `kafka` protocol with securitySchema', () => {
      const { securityProtocol } = ServerHelpers.getKafkaSecurity('kafka', new SecurityScheme({}));
      expect(securityProtocol).toEqual('SASL_PLAINTEXT');
    });

    test('should return a appropriate securityProtocol only for `kafka-secure` protocol', () => {
      const { securityProtocol } = ServerHelpers.getKafkaSecurity('kafka-protocol');
      expect(securityProtocol).toEqual('SSL');
    });

    test('should return a appropriate securityProtocol for `kafka-secure` protocol with securitySchema', () => {
      const { securityProtocol } = ServerHelpers.getKafkaSecurity('kafka-protocol', new SecurityScheme({}));
      expect(securityProtocol).toEqual('SASL_SSL');
    });

    test('should return a appropriate securityProtocol for `kafka-secure` protocol with securitySchema', () => {
      const { securityProtocol } = ServerHelpers.getKafkaSecurity('kafka-protocol', new SecurityScheme({}));
      expect(securityProtocol).toEqual('SASL_SSL');
    });

    test('should return a appropriate saslMechanism for `plain` securitySchema', () => {
      const { saslMechanism } = ServerHelpers.getKafkaSecurity('kafka', new SecurityScheme({ type: 'plain' }));
      expect(saslMechanism).toEqual('PLAIN');
    });

    test('should return a appropriate saslMechanism for `scramSha256` securitySchema', () => {
      const { saslMechanism } = ServerHelpers.getKafkaSecurity('kafka', new SecurityScheme({ type: 'scramSha256' }));
      expect(saslMechanism).toEqual('SCRAM-SHA-256');
    });

    test('should return a appropriate saslMechanism for `scramSha512` securitySchema', () => {
      const { saslMechanism } = ServerHelpers.getKafkaSecurity('kafka', new SecurityScheme({ type: 'scramSha512' }));
      expect(saslMechanism).toEqual('SCRAM-SHA-512');
    });

    test('should return a appropriate saslMechanism for `oauth2` securitySchema', () => {
      const { saslMechanism } = ServerHelpers.getKafkaSecurity('kafka', new SecurityScheme({ type: 'oauth2' }));
      expect(saslMechanism).toEqual('OAUTHBEARER');
    });

    test('should return a appropriate saslMechanism for `gssapi` securitySchema', () => {
      const { saslMechanism } = ServerHelpers.getKafkaSecurity('kafka', new SecurityScheme({ type: 'gssapi' }));
      expect(saslMechanism).toEqual('GSSAPI');
    });

    test('should return a appropriate securityProtocol and saslMechanism for `X509` securitySchema', () => {
      const { securityProtocol, saslMechanism } = ServerHelpers.getKafkaSecurity('kafka', new SecurityScheme({ type: 'X509' }));
      expect(securityProtocol).toEqual('SSL');
      expect(saslMechanism).toEqual(undefined);
    });
  });
});
