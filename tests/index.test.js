//  Copyright (c) 2021 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const GraphdocPluginOperations = require('../lib/index')

it('should use default options', function() {
  const schema = {
    types: [{ name: 'someInput' }, { name: 'Query', fields: [{
        name: 'op1',
        description: 'op1Desc'
      },{
        name: 'op2',
        description: 'op2Desc'
      }
    ] }]
  }
  const plugin = new GraphdocPluginOperations.default(schema, {}, {})

  expect(plugin.baseUrl).toEqual('')
  expect(plugin.documentTitle).toEqual('Description')
  expect(plugin.extractDescription).toEqual(true)
  expect(plugin.navigationTitle).toEqual('Operations')
  expect(plugin.getHeaders).not.toEqual(undefined)
  expect(plugin.getAssets).not.toEqual(undefined)
})

it('should use new options', function() {
  const schema = {
    types: [{ name: 'someInput' }, { name: 'Query', fields: [{
        name: 'op1',
        description: 'op1Desc'
      },{
        name: 'op2',
        description: 'op2Desc'
      }
    ] }]
  }
  const plugin = new GraphdocPluginOperations.default(schema, {
    graphdoc: { baseUrl: 'some' },
    'graphdoc-plugin-operations': {
      documentTitle: 'Description2',
      navigationTitle: 'Operations2',
      enableAssets: false,
      extractDescription: false
    }
  }, {})

  expect(plugin.baseUrl).toEqual('some')
  expect(plugin.documentTitle).toEqual('Description2')
  expect(plugin.extractDescription).toEqual(false )
  expect(plugin.navigationTitle).toEqual('Operations2')
  expect(plugin.getHeaders).toEqual(undefined)
  expect(plugin.getAssets).toEqual(undefined)
})

it('should add new types when available for Query', function() {
  const queryType = { name: 'Query', fields: [{
      name: 'op1',
      description: 'op1Desc'
    }, {
      name: 'op2',
      description: 'op2Desc'
    }
  ] }
  const schema = {
    types: [{ name: 'someInput' }, queryType]
  }

  const plugin = new GraphdocPluginOperations.default(schema, {}, {})

  expect(plugin.operations.size).toBe(2)
  expect(plugin.operations.get('Query.op1')).toEqual({
    name: 'Query.op1',
    description: 'op1Desc',
    operationName: 'op1',
    parent: queryType,
    kind: 'OPERATION',
    inputFields: null,
    interfaces: [],
    enumValues: null,
    possibleTypes: null
  })
  expect(plugin.operations.get('Query.op2')).toEqual({
    name: 'Query.op2',
    description: 'op2Desc',
    operationName: 'op2',
    parent: queryType,
    kind: 'OPERATION',
    inputFields: null,
    interfaces: [],
    enumValues: null,
    possibleTypes: null

  })
  expect(schema.types).toHaveLength(4)
  expect(schema.types.map(type => type.name)).toEqual(expect.arrayContaining(['someInput', 'Query', 'Query.op1', 'Query.op2']))
})

it('should add new types when available for Mutation', function() {
  const mutationType = { name: 'Mutation', fields: [{
      name: 'op1',
      description: 'op1Desc'
    }, {
      name: 'op2',
      description: 'op2Desc'
    }
  ] }
  const schema = {
    types: [{ name: 'someInput' }, mutationType]
  }

  const plugin = new GraphdocPluginOperations.default(schema, {}, {})

  expect(plugin.operations.size).toBe(2)
  expect(plugin.operations.get('Mutation.op1')).toEqual({
    name: 'Mutation.op1',
    description: 'op1Desc',
    operationName: 'op1',
    parent: mutationType,
    kind: 'OPERATION',
    inputFields: null,
    interfaces: [],
    enumValues: null,
    possibleTypes: null
  })
  expect(plugin.operations.get('Mutation.op2')).toEqual({
    name: 'Mutation.op2',
    description: 'op2Desc',
    operationName: 'op2',
    parent: mutationType,
    kind: 'OPERATION',
    inputFields: null,
    interfaces: [],
    enumValues: null,
    possibleTypes: null

  })
  expect(schema.types).toHaveLength(4)
  expect(schema.types.map(type => type.name)).toEqual(expect.arrayContaining(['someInput', 'Mutation', 'Mutation.op1', 'Mutation.op2']))
})

it('should not add new types when not available', function() {
  const queryType = { name: 'someObject', fields: [{
      name: 'op1',
      description: 'op1Desc'
    }, {
      name: 'op2',
      description: 'op2Desc'
    }
  ] }
  const schema = {
    types: [{ name: 'someInput' }, queryType]
  }

  const plugin = new GraphdocPluginOperations.default(schema, {}, {})

  expect(plugin.operations.size).toBe(0)
  expect(schema.types).toHaveLength(2)
  expect(schema.types.map(type => type.name)).toEqual(expect.arrayContaining(['someInput', 'someObject']))
})

it('should not add new types when undefined', function() {
  const plugin = new GraphdocPluginOperations.default({}, {}, {})

  expect(plugin.operations.size).toBe(0)
})

it('should not add new types when empty Query', function() {
  const queryType = { name: 'Query', fields: [] }
  const schema = {
    types: [{ name: 'someInput' }, queryType]
  }

  const plugin = new GraphdocPluginOperations.default(schema, {}, {})

  expect(plugin.operations.size).toBe(0)
  expect(schema.types).toHaveLength(2)
  expect(schema.types.map(type => type.name)).toEqual(expect.arrayContaining(['someInput', 'Query']))
})

it('should create documents', function() {
  const queryType = { name: 'Query',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      description: 'op1Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const mutationType = { name: 'Mutation',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      description: 'op1Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const schema = {
    types: [{ name: 'someInput' }, queryType, mutationType]
  }
  const plugin = new GraphdocPluginOperations.default(schema, {}, {})
  expect(plugin.operations.size).toBe(4)

  const document = plugin.getDocuments('Query.op1')

  expect(document[0].title).toEqual('Description')
  expect(document[0].description.indexOf('<p>op1Desc</p>')).not.toBe(-1)
  expect(document[0].description.indexOf('<code class=\"highlight\"><ul class=\"code\" style=\"padding-left:28px\"><li><span class=\"tab\"><span class=\"comment line\"># Arguments</span></span></li><li><span class=\"tab\"><span class=\"comment line\">#   <strong>arg1</strong>: arg1Desc</span></span></li><li><span class=\"tab\"><span class=\"meta\">op1</span>(<span class=\"meta\">arg1</span>: <a class=\"support type\" href=\"argtype.doc.html\">argType</a>): <a class=\"support type\" href=\"fieldtype.doc.html\">fieldType</a> </span></li></ul></code>')).not.toBe(-1)
})

it('should create documents with empty description', function() {
  const queryType = { name: 'Query',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const mutationType = { name: 'Mutation',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      description: 'op1Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const schema = {
    types: [{ name: 'someInput' }, queryType, mutationType]
  }
  const plugin = new GraphdocPluginOperations.default(schema, {}, {})
  expect(plugin.operations.size).toBe(4)

  const document = plugin.getDocuments('Query.op1')

  expect(document[0].title).toEqual('Description')
  expect(document[0].description.indexOf('<p>op1Desc</p>')).toBe(-1)
  expect(document[0].description.indexOf('<code class=\"highlight\"><ul class=\"code\" style=\"padding-left:28px\"><li><span class=\"tab\"><span class=\"comment line\"># Arguments</span></span></li><li><span class=\"tab\"><span class=\"comment line\">#   <strong>arg1</strong>: arg1Desc</span></span></li><li><span class=\"tab\"><span class=\"meta\">op1</span>(<span class=\"meta\">arg1</span>: <a class=\"support type\" href=\"argtype.doc.html\">argType</a>): <a class=\"support type\" href=\"fieldtype.doc.html\">fieldType</a> </span></li></ul></code>')).not.toBe(-1)
})

it('should create documents without extracting description', function() {
  const queryType = { name: 'Query',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      description: 'op1Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const mutationType = { name: 'Mutation',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      description: 'op1Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const schema = {
    types: [{ name: 'someInput' }, queryType, mutationType]
  }
  const plugin = new GraphdocPluginOperations.default(schema, { 'graphdoc-plugin-operations': { extractDescription: false } }, {})
  expect(plugin.operations.size).toBe(4)

  const document = plugin.getDocuments('Query.op1')

  expect(document[0].title).toEqual('Description')
  expect(document[0].description.indexOf('<code class="highlight"><ul class="code" style="padding-left:28px"><li><span class="tab"><span class="comment line">#   op1Desc</span></span></li><li><span class="tab"><span class="comment line"># </span></span></li><li><span class="tab"><span class="comment line"># Arguments</span></span></li><li><span class="tab"><span class="comment line">#   <strong>arg1</strong>: arg1Desc</span></span></li><li><span class="tab"><span class="meta">op1</span>(<span class="meta">arg1</span>: <a class="support type" href="argtype.doc.html">argType</a>): <a class="support type" href="fieldtype.doc.html">fieldType</a> </span></li></ul></code>')).not.toBe(-1)
})

it('should not create documents', function() {
  const schema = {
    types: [{ name: 'someInput' }]
  }
  const plugin = new GraphdocPluginOperations.default(schema, {}, {})

  const document = plugin.getDocuments('Query.op1')

  expect(document).toEqual([])
})

it('should create navigations', function() {
  const queryType = { name: 'Query',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      description: 'op1Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const mutationType = { name: 'Mutation',
    type: {
      kind: 'OBJECT'
    },
    fields: [{
      name: 'op1',
      description: 'op1Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }, {
      name: 'op2',
      description: 'op2Desc',
      type: {
        name: 'fieldType',
        kind: 'OBJECT'
      },
      args: [{
        name: 'arg1',
        description: 'arg1Desc',
        type: {
          name: 'argType',
          kind: 'SCALAR'
        }
      }]
    }
  ] }
  const schema = {
    types: [{ name: 'someInput' }, queryType, mutationType]
  }
  const plugin = new GraphdocPluginOperations.default(schema, {}, {})
  expect(plugin.operations.size).toBe(4)

  const navigation = plugin.getNavigations('Query.op1')

  expect(navigation[0].title).toEqual('Operations')
  expect(navigation[0].items).toEqual([{
      href: '/mutation.op1.doc.html',
      isActive: false,
      text: 'Mutation.op1'
    },{
      href: '/mutation.op2.doc.html',
      isActive: false,
      text: 'Mutation.op2'
    },{
      href: '/query.op1.doc.html',
      isActive: true,
      text: 'Query.op1'
    }, {
      href: '/query.op2.doc.html',
      isActive: false,
      text: 'Query.op2'
    }])
})
