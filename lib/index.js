//  Copyright (c) 2021 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const marked = require('marked')
const SchemaPlugin = require('@2fd/graphdoc/plugins/document.schema').default
const graphdocUtils = require('@2fd/graphdoc/lib/utility')

const TYPES_WITH_OPERATIONS_REGEX = /^(?:Query|Mutation)$/

function complementTypes(fromTypes) {
  const operations = new Map()
  const schemaTypes = []
  for(let type of fromTypes) {
    schemaTypes.push(type)
    if(TYPES_WITH_OPERATIONS_REGEX.test(type.name)) {
      for(let operation of type.fields) {
        const name = `${type.name}.${operation.name}`
        const operationType = {
          ...operation,
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
  return {
    operations,
    schemaTypes
  }
}

function activeOption(option) {
  return option === true || option === undefined
}

class GraphdocPluginOperations {
  constructor(schema, projectPackage, graphdocPackage) {
    const graphdocConfig = projectPackage.graphdoc || {}
    this.baseUrl = graphdocConfig.baseUrl || ''
    const config = projectPackage['graphdoc-plugin-operations'] || {}
    this.documentTitle = config.documentTitle || 'Description'
    this.extractDescription = activeOption(config.extractDescription)
    this.navigationTitle = config.navigationTitle || 'Operations'
    const complemented = complementTypes(schema.types || [])
    this.operations = complemented.operations
    this.operationsNames = Array.from(this.operations.keys()).sort((a, b) => a > b ? 1 : -1)
    schema.types = complemented.schemaTypes
    this.builder = new SchemaPlugin(schema, {
      ...projectPackage,
      graphdoc: {
        ...projectPackage.graphdoc,
        baseUrl: this.baseUrl
      }
    }, graphdocPackage)
    if (activeOption(config.enableAssets)) {
      this.getHeaders = this.builder.getHeaders
      this.getAssets = this.builder.getAssets
    }
  }

  getDocument(description) {
    return [ {
      title: this.documentTitle,
      description
    } ]
  }

  getDocuments(buildForType) {
    const type = this.operations.get(buildForType)
    return type
      ? this.extractDescription
        ? this.getDocument((type.description ? `<div class="x-desc">${marked(type.description)}</div>` : '')
            + graphdocUtils.html.code(this.builder.field({
              ...type,
              name: type.operationName,
              description: ''
            })))
        : this.getDocument(graphdocUtils.html.code(this.builder.field({
          ...type,
          name: type.operationName
        })))
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
