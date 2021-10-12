export class FormatHelpers {
  static inlineCode(value) {
    if (
      value === null || 
      value === undefined || 
      typeof value === 'object' || 
      typeof value === 'function' ||
      value === ''
    ) return '';
    return `\`${value}\``;
  }
}
