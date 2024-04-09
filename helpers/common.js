const OPERATION_TYPES = {
  V3: {
    REQUEST: 'request',
    SEND: 'send',
    REPLY: 'reply',
    RECEIVE: 'receive',
  },
  V2: {
    REQUEST: 'request',
    SEND: 'publish',
    REPLY: 'reply',
    RECEIVE: 'subscribe',
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
}
