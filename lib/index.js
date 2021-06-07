//  Copyright (c) 2021 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const SchemaPlugin = require('@2fd/graphdoc/plugins/document.schema').default
const graphdocUtils = require('@2fd/graphdoc/lib/utility')

const TYPES_WITH_OPERATIONS_REGEX = /^(?:Query|Mutation)$/

function complementTypes(fromTypes, eraseByNameRegex, eraseByDescriptionRegex, assembleDescription) {
  const operations = new Map()
  const schemaTypes = []
  for(let type of fromTypes) {
    schemaTypes.push(type)
    if(TYPES_WITH_OPERATIONS_REGEX.test(type.name)) {
      for(let operation of type.fields) {
        if (!eraseByNameRegex.test(operation.name) && !eraseByDescriptionRegex.test(operation.description)) {
          const name = `${type.name}.${operation.name}`
          const operationType = {
            ...operation,
            description: assembleDescription(operation),
            name,
            operationName: operation.name,
            parent: type,
            kind: 'OPERATION',
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }
          operations.set(name, operationType)
          schemaTypes.push(operationType)
        }
      }
    }
  }
  return {
    operations,
    schemaTypes
  }
}

function activeOption(option) {
  return option === true || option === undefined
}

function eraseRegex(from) {
  return from ? new RegExp(from) : /^$/
}

class GraphdocPluginOperations {
  constructor(schema, graphdocConfig, graphdocPackage) {
    const coreConfig = graphdocConfig.graphdoc || {}
    this.baseUrl = coreConfig.baseUrl
      ? coreConfig.baseUrl.endsWith('/') ? coreConfig.baseUrl.slice(0, -1) : coreConfig.baseUrl
      : ''
    const config = graphdocConfig['graphdoc-plugin-operations'] || {}
    this.documentTitle = config.documentTitle || 'Definition'
    this.navigationTitle = config.navigationTitle || 'Operations'
    this.builder = new SchemaPlugin({}, {
      ...graphdocConfig,
      graphdoc: {
        ...graphdocConfig.graphdoc,
        baseUrl: this.baseUrl
      }
    }, graphdocPackage)
    this.assembleDefinition = operation => graphdocUtils.html.code(this.builder.field(operation))
    let assembleDescription = description => description
    if (activeOption(config.extractParametersDoc)) {
      this.builder.description = description => description ? `<p>${description}</p>` : ''
      this.builder.argumentsDescription = () => ''
      this.assembleDefinition = operation => graphdocUtils.html.code(this.builder.field(operation).replace(/<li><span class="tab"><\/span><\/li>/g, ''))
      const parametersTitle = config.parametersTitle !== '' ? `<p>${ config.parametersTitle || 'Parameters:'}</p><br/>` : ''
      assembleDescription = operation => operation.args && operation.args.length !== 0
        ? `${operation.description ? `<p>${operation.description}</p><br/>` : ''}${parametersTitle}${operation.args.map(param => this.builder.argumentDescription(param)).join('')}`
        : operation.description
    }
    const complemented = complementTypes(
      schema.types || [],
      eraseRegex(config.eraseByNameRegex),
      eraseRegex(config.eraseByDescriptionRegex),
      assembleDescription
    )
    this.operations = complemented.operations
    this.operationsNames = Array.from(this.operations.keys()).sort((a, b) => a > b ? 1 : -1)
    schema.types = complemented.schemaTypes
    if (activeOption(config.enableAssets)) {
      this.getHeaders = this.builder.getHeaders
      this.getAssets = this.builder.getAssets
    }
  }

  getDocuments(buildForType) {
    const type = this.operations.get(buildForType)
    return type
      ? [ new graphdocUtils.DocumentSection(this.documentTitle, this.assembleDefinition({
          ...type,
          name: type.operationName,
          description: ''
        })) ]
      : []
  }

  getNavigations(buildForType) {
    const currentOperationsSection = []
    for (let operation of this.operationsNames) {
      currentOperationsSection.push(new graphdocUtils.NavigationItem(operation, `${this.baseUrl}/${graphdocUtils.getFilenameOf({ name: operation })}`, operation === buildForType))
    }
    return [ new graphdocUtils.NavigationSection(this.navigationTitle, currentOperationsSection) ]
  }
}

module.exports.default = GraphdocPluginOperations
