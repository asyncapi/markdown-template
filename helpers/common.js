const OPERATION_TYPES = {
  V3: {
    REQUEST: 'request',
    SEND: 'send',
    REPLY: 'reply',
    RECEIVE: 'receive',
  },
  // For v2, when you use publish operation it means
  // other publish to your application because your application is subscribing to it.
  V2: {
    REQUEST: 'publish',
    SEND: 'subscribe',
    REPLY: 'subscribe',
    RECEIVE: 'publish',
  }
};

const getOperationTypesByVersion = (version) => {
  const [majorVersion] = version.split('.');

  return OPERATION_TYPES[`V${majorVersion}`];
};

export class CommonHelpers {
  static getOperationType(operation, asyncApiDoc) {
    const operationsTypes = getOperationTypesByVersion(asyncApiDoc.version());

    if (operation.isSend()) {
      if (operation.reply() !== undefined) {
        return operationsTypes.REQUEST;
      }
      return operationsTypes.SEND;
    }
    if (operation.isReceive() && operation.reply() !== undefined) {
      return operationsTypes.REPLY;
    }
    return operationsTypes.RECEIVE;
  }

  static isV3(asyncApiDoc) {
    return asyncApiDoc.version().split('.')[0] === '3';
  }
}
