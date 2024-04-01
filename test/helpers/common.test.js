import { CommonHelpers } from '../../helpers/common';
import {fromFile, Parser} from '@asyncapi/parser';
import path from 'path';

const asyncapi_v3_path = path.resolve(__dirname, '../spec/asyncapi_v3.yml');
const asyncapi_v2_path = path.resolve(__dirname, '../spec/asyncapi_v2.yml');

const parser = new Parser();

let v2Doc;
let v3Doc;

beforeAll(async () => {
  const v2DocParsed = await fromFile(parser, asyncapi_v2_path).parse();
  const v3DocParsed = await fromFile(parser, asyncapi_v3_path).parse();

  v2Doc = v2DocParsed.document;
  v3Doc = v3DocParsed.document;
});

describe('CommonHelpers', () => {
  describe('v2', () => {
    describe('.getOperationType', () => {
      test('should return "send" - in case send operation', () => {
        const sendOperation = v2Doc.operations().filterBySend()[0];

        const result = CommonHelpers.getOperationType(sendOperation);
        expect(result).toEqual('send');
      });
      test('should return "receive" - in case receive operation', () => {
        const receiveOperation = v2Doc.operations().filterByReceive()[0];

        const result = CommonHelpers.getOperationType(receiveOperation);
        expect(result).toEqual('receive');
      });
    });
  });
  describe('v3', () => {
    describe('.getOperationType', () => {
      test('should return "send" - in case send without reply', () => {
        const sendOperationWithoutReply = v3Doc.operations()
          .filterBySend()
          .find((operation) => operation.reply() === undefined);

        const result = CommonHelpers.getOperationType(sendOperationWithoutReply);
        expect(result).toEqual('send');
      });
      test('should return "reply" - in case receive with reply', () => {
        const receiveOperationWithReply = v3Doc.operations()
          .filterByReceive()
          .find((operation) => operation.reply() !== undefined);

        const result = CommonHelpers.getOperationType(receiveOperationWithReply);
        expect(result).toEqual('reply');
      });
      test('should return "receive" - in case receive without reply', () => {
        const receiveOperationWithoutReply = v3Doc.operations()
          .filterByReceive()
          .find((operation) => operation.reply() === undefined);

        const result = CommonHelpers.getOperationType(receiveOperationWithoutReply);
        expect(result).toEqual('receive');
      });
    });
  });
});
