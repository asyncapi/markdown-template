import { FormatHelpers } from '../../helpers/format';

describe('FormatHelpers', () => {
  describe('.inlineCode', () => {
    test('should return inlined md code - string case', () => {
      const result = FormatHelpers.inlineCode('test');
      expect(result).toEqual(`\`test\``);
    });

    test('should return inlined md code - number case', () => {
      const result = FormatHelpers.inlineCode(0);
      expect(result).toEqual(`\`0\``);
    });

    test('should return inlined md code - boolean case', () => {
      const result = FormatHelpers.inlineCode(true);
      expect(result).toEqual(`\`true\``);
    });

    test('should not return inlined md code - null case', () => {
      const result = FormatHelpers.inlineCode(null);
      expect(result).toEqual('');
    });

    test('should not return inlined md code - undefined case', () => {
      const result = FormatHelpers.inlineCode(undefined);
      expect(result).toEqual('');
    });

    test('should not return inlined md code - object case', () => {
      const result = FormatHelpers.inlineCode({});
      expect(result).toEqual('');
    });

    test('should not return inlined md code - function case', () => {
      const result = FormatHelpers.inlineCode(() => {});
      expect(result).toEqual('');
    });

    test('should not return inlined md code - empty string case', () => {
      const result = FormatHelpers.inlineCode('test');
      expect(result).toEqual(`\`test\``);
    });
  });
});