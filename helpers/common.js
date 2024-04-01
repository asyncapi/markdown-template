
export class CommonHelpers {
  static getOperationType(operation) {
    if (operation.isSend()) {
      if (operation.reply() !== undefined) {
        return 'request';
      }
      return 'send';
    }
    if (operation.isReceive() && operation.reply() !== undefined) {
      return 'reply';
    }
    return 'receive';
  }
}
