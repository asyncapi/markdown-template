import { SchemaV2 as SchemaModel } from '@asyncapi/parser';

export const SchemaCustomTypes = {
  // for `true` and `{}` schemas
  ANY: 'any',
  // for schemas without `type` keyword
  RESTRICTED_ANY: 'restricted any',
  // for `false` and `{ not: {}, ... }` schemas
  NEVER: 'never',
  // for types that we cannot infer
  UNKNOWN: 'unknown',
};

export class SchemaHelpers {
  static jsonSchemaTypes = [
    'string',
    'number',
    'integer',
    'boolean',
    'array',
    'object',
    'null',
  ];
  static jsonSchemaKeywordTypes = {
    // string
    maxLength: 'string',
    minLength: 'string',
    pattern: 'string',
    contentMediaType: 'string',
    contentEncoding: 'string',
    // number
    multipleOf: 'number',
    maximum: 'number',
    exclusiveMaximum: 'number',
    minimum: 'number',
    exclusiveMinimum: 'number',
    // array
    items: 'array',
    maxItems: 'array',
    minItems: 'array',
    uniqueItems: 'array',
    contains: 'array',
    additionalItems: 'array',
    // object
    maxProperties: 'object',
    minProperties: 'object',
    required: 'object',
    properties: 'object',
    patternProperties: 'object',
    propertyNames: 'object',
    dependencies: 'object',
    additionalProperties: 'object',
  };
  static jsonSchemaKeywords = Object.keys(this.jsonSchemaKeywordTypes);
  static extRenderType = 'x-schema-private-render-type';
  static extRenderAdditionalInfo = 'x-schema-private-render-additional-info';
  static extRawValue = 'x-schema-private-raw-value';
  static extParameterLocation = 'x-schema-private-parameter-location';

  static toSchemaType(schema) {
    if (!schema || typeof schema.json !== 'function') {
      return SchemaCustomTypes.UNKNOWN;
    }
    if (schema.isBooleanSchema()) {
      if (schema.json() === true) {
        return SchemaCustomTypes.ANY;
      }
      return SchemaCustomTypes.NEVER;
    }
    // handle case with `{}` schemas
    if (Object.keys(schema.json()).length === 0) {
      return SchemaCustomTypes.ANY;
    }
    // handle case with `{ not: {}, ... }` schemas
    const not = schema.not();
    if (not && this.inferType(not) === SchemaCustomTypes.ANY) {
      return SchemaCustomTypes.NEVER;
    }

    let type = this.inferType(schema);
    if (Array.isArray(type)) {
      return type.map(t => this.toType(t, schema)).join(' | ');
    }
    type = this.toType(type, schema);
    const combinedType = this.toCombinedType(schema);

    if (type && combinedType) {
      return `${type} ${combinedType}`;
    }
    if (combinedType) {
      return combinedType;
    }
    return type;
  }

  static toType(type, schema) {
    if (type === 'array') {
      const items = schema.items();
      if (Array.isArray(items)) {
        const types = items.map(item => this.toSchemaType(item)).join(', ');
        const additionalItems = schema.additionalItems();
        if (additionalItems === true) {
          return `tuple&lt;${types || SchemaCustomTypes.UNKNOWN}, ...optional&lt;${SchemaCustomTypes.ANY}&gt;&gt;`;
        }
        if (additionalItems === false) {
          return `tuple&lt;${types}&gt;`;
        }
        const additionalType = this.toSchemaType(additionalItems);
        return `tuple&lt;${types || SchemaCustomTypes.UNKNOWN}, ...optional&lt;${additionalType}&gt;&gt;`;
      }
      if (!items) {
        return `array&lt;${SchemaCustomTypes.ANY}&gt;`;
      }
      return `array&lt;${this.toSchemaType(items) || SchemaCustomTypes.UNKNOWN}&gt;`;
    }
    return type;
  }

  static toCombinedType(schema) {
    const t = [];
    if (schema.oneOf()) {
      t.push('oneOf');
    }
    if (schema.anyOf()) {
      t.push('anyOf');
    }
    if (schema.allOf()) {
      t.push('allOf');
    }
    if (t.length === 0 || t.length > 1) {
      return undefined;
    }
    return t[0];
  }

  static inferType(schema) {
    let types = schema.type();

    if (types !== undefined) {
      if (Array.isArray(types)) {
        // if types have `integer` and `number` types, `integer` is unnecessary
        if (types.includes('integer') && types.includes('number')) {
          types = types.filter(t => t !== 'integer');
        }
        return types.length === 1 ? types[0] : types;
      }
      return types;
    }

    const constValue = schema.const();
    if (constValue !== undefined) {
      const typeOf = typeof constValue;
      if (typeOf === 'number' && Number.isInteger(constValue)) {
        return 'integer';
      }
      return typeOf;
    }
    const enumValue = schema.enum();
    if (Array.isArray(enumValue) && enumValue.length) {
      const inferredType = Array.from(new Set(enumValue.map(e => {
        const typeOf = typeof e;
        if (typeOf === 'number' && Number.isInteger(e)) {
          return 'integer';
        }
        return typeOf;
      })));
      return inferredType.length === 1 ? inferredType[0] : inferredType;
    }

    const schemaKeys = Object.keys(schema.json() || {}) || [];
    const hasInferredTypes = this.jsonSchemaKeywords.some(key =>
      schemaKeys.includes(key),
    );
    if (hasInferredTypes === true) {
      return '';
    }
    if (this.toCombinedType(schema)) {
      return '';
    }
    return SchemaCustomTypes.ANY;
  }

  static prettifyValue(value) {
    const typeOf = typeof value;
    if (typeOf === 'string') {
      return `"${value}"`;
    }
    if (typeOf === 'number' || typeOf === 'bigint' || typeOf === 'boolean') {
      return value;
    }
    if (Array.isArray(value)) {
      return `[${value.toString()}]`;
    }
    return JSON.stringify(value);
  }

  /**
   *
   * @param {import('@asyncapi/parser').ChannelParametersInterface} parameters
   * @returns
   */
  static parametersToSchema(parameters) {
    if (parameters.length === 0) {
      return;
    }

    const json = {
      type: 'object',
      properties: parameters.reduce(
        (obj, parameter) => {
          const parameterName = parameter.id();
          obj[String(parameterName)] = Object.assign({}, parameter.schema() === undefined ? {type: 'string'} : parameter.schema().json());
          obj[String(parameterName)].description =
            parameter.description() || obj[String(parameterName)].description;
          obj[String(parameterName)][this.extParameterLocation] = parameter.location();
          return obj;
        },
        {},
      ),
      required: parameters.map(parameter => parameter.id()),
      [this.extRenderType]: false,
      [this.extRenderAdditionalInfo]: false,
    };
    return new SchemaModel(json);
  }

  static humanizeConstraints(schema) {
    const constraints = [];

    // related to number/integer
    const numberRange = this.humanizeNumberRangeConstraint(
      schema.minimum(),
      schema.exclusiveMinimum(),
      schema.maximum(),
      schema.exclusiveMaximum(),
    );
    if (numberRange !== undefined) {
      constraints.push(numberRange);
    }
    const multipleOfConstraint = this.humanizeMultipleOfConstraint(
      schema.multipleOf(),
    );
    if (multipleOfConstraint !== undefined) {
      constraints.push(multipleOfConstraint);
    }

    // related to string
    const stringRange = this.humanizeRangeConstraint(
      'characters',
      schema.minLength(),
      schema.maxLength(),
    );
    if (stringRange !== undefined) {
      constraints.push(stringRange);
    }

    // related to array
    const hasUniqueItems = schema.uniqueItems();
    const arrayRange = this.humanizeRangeConstraint(
      hasUniqueItems ? 'unique items' : 'items',
      schema.minItems(),
      schema.maxItems(),
    );
    if (arrayRange !== undefined) {
      constraints.push(arrayRange);
    }

    // related to object
    const objectRange = this.humanizeRangeConstraint(
      'properties',
      schema.minProperties(),
      schema.maxProperties(),
    );
    if (objectRange !== undefined) {
      constraints.push(objectRange);
    }

    return constraints;
  }

  static humanizeNumberRangeConstraint(
    min,
    exclusiveMin,
    max,
    exclusiveMax,
  ) {
    const hasExclusiveMin = exclusiveMin !== undefined;
    const hasMin = min !== undefined || hasExclusiveMin;
    const hasExclusiveMax = exclusiveMax !== undefined;
    const hasMax = max !== undefined || hasExclusiveMax;

    let numberRange;
    if (hasMin && hasMax) {
      numberRange = hasExclusiveMin ? '( ' : '[ ';
      numberRange += hasExclusiveMin ? exclusiveMin : min;
      numberRange += ' .. ';
      numberRange += hasExclusiveMax ? exclusiveMax : max;
      numberRange += hasExclusiveMax ? ' )' : ' ]';
    } else if (hasMin) {
      numberRange = hasExclusiveMin ? '> ' : '>= ';
      numberRange += hasExclusiveMin ? exclusiveMin : min;
    } else if (hasMax) {
      numberRange = hasExclusiveMax ? '< ' : '<= ';
      numberRange += hasExclusiveMax ? exclusiveMax : max;
    }
    return numberRange;
  }

  static humanizeMultipleOfConstraint(
    multipleOf,
  ) {
    if (multipleOf === undefined) {
      return;
    }
    const strigifiedMultipleOf = multipleOf.toString(10);
    if (!(/^0\.0*1$/).test(strigifiedMultipleOf)) {
      return `multiple of ${strigifiedMultipleOf}`;
    }
    return `decimal places <= ${strigifiedMultipleOf.split('.')[1].length}`;
  }

  static humanizeRangeConstraint(
    description,
    min,
    max,
  ) {
    let stringRange;
    if (min !== undefined && max !== undefined) {
      if (min === max) {
        stringRange = `${min} ${description}`;
      } else {
        stringRange = `[ ${min} .. ${max} ] ${description}`;
      }
    } else if (max !== undefined) {
      stringRange = `<= ${max} ${description}`;
    } else if (min !== undefined) {
      if (min === 1) {
        stringRange = 'non-empty';
      } else {
        stringRange = `>= ${min} ${description}`;
      }
    }
    return stringRange;
  }

  /**
   * Retrieves from given schema all dependent required requires by given propertyName from `dependencies` object.
   *
   * @param propertyName
   * @param schema
   */
  static getDependentRequired(propertyName, schema) {
    const dependentRequired = [];
    const dependencies = schema.dependencies();
    if (!dependencies) {
      return;
    }

    for (const [prop, array] of Object.entries(dependencies)) {
      if (Array.isArray(array) && array.includes(propertyName)) {
        dependentRequired.push(prop);
      }
    }
    return dependentRequired.length ? dependentRequired : undefined;
  }

  /**
   * Retrieves from given schema all dependent schemas from `dependencies` object.
   *
   * @param schema
   */
  static getDependentSchemas(schema) {
    const dependencies = schema.dependencies();
    if (!dependencies) {
      return;
    }

    const records = {};
    for (const [prop, propSchema] of Object.entries(dependencies)) {
      if (typeof propSchema === 'object' && !Array.isArray(propSchema)) {
        records[String(prop)] = propSchema;
      }
    }
    if (!Object.keys(records).length) {
      return undefined;
    }

    const json = {
      type: 'object',
      properties: Object.entries(records).reduce(
        (obj, [propertyName, propertySchema]) => {
          obj[String(propertyName)] = Object.assign({}, propertySchema.json());
          return obj;
        },
        {},
      ),
      [this.extRenderType]: false,
      [this.extRenderAdditionalInfo]: false,
    };
    return new SchemaModel(json);
  }

  static jsonToSchema(value) {
    if (value && typeof value.json === 'function') {
      value = value.json();
    }
    const json = this.jsonFieldToSchema(value);
    return new SchemaModel(json);
  }

  static jsonFieldToSchema(value) {
    if (value === undefined || value === null) {
      return {
        type: 'string',
        const: value === undefined ? '' : 'NULL',
        [this.extRawValue]: true,
        [this.extRenderType]: false,
      };
    }
    if (typeof value !== 'object') {
      const str =
        typeof value.toString === 'function' ? value.toString() : value;
      return {
        type: 'string',
        const: str,
        [this.extRawValue]: true,
        [this.extRenderType]: false,
      };
    }
    if (this.isJSONSchema(value)) {
      return value;
    }
    if (Array.isArray(value)) {
      return {
        type: 'array',
        items: value.map(v => this.jsonFieldToSchema(v)),
        [this.extRenderType]: false,
        [this.extRenderAdditionalInfo]: false,
      };
    }
    return {
      type: 'object',
      properties: Object.entries(value).reduce((obj, [k, v]) => {
        obj[String(k)] = this.jsonFieldToSchema(v);
        return obj;
      }, {}),
      [this.extRenderType]: false,
      [this.extRenderAdditionalInfo]: false,
    };
  }

  static isJSONSchema(value) {
    if (
      value &&
      typeof value === 'object' &&
      (this.jsonSchemaTypes.includes(value.type) ||
        (Array.isArray(value.type) &&
          value.type.some(t => !this.jsonSchemaTypes.includes(t))))
    ) {
      return true;
    }
    return false;
  }

  static getCustomExtensions(item) {
    try {
      const extensions = item.extensions().all();
      return extensions.reduce((acc, ext) => {
        const extName = ext.id();
        if (
          !extName.startsWith('x-parser-') &&
          !extName.startsWith('x-schema-private-')
        ) {
          acc[String(extName)] = ext.value();
        }
        return acc;
      }, {});
    } catch (err) {
      return {};
    }
  }
}
