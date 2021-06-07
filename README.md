<p align="center">
  <br/>
  <a href="https://graphdoc-plugins.github.io"><img src="docs/graphdoc-plugin-operations.png" alt=" "/></a>
</p>

<h1 align="center">GraphQL schema HTML documentation generation, using graphdoc with Isolated Operations</h1>

[![graphdoc-plugin-operations](https://badgen.net/badge/homepage/graphdoc-plugin-operations/blue)](https://graphdoc-plugins.github.io)
[![graphdoc-plugin-operations](https://badgen.net/badge/npm%20pack/graphdoc-plugin-operations/blue)](https://www.npmjs.com/package/graphdoc-plugin-operations)
[![ ](https://badgen.net/npm/v/graphdoc-plugin-operations)](https://www.npmjs.com/package/graphdoc-plugin-operations)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE.txt)
[![ ](https://badgen.net/badge/test/passing/green)](https://gmullerb.gitlab.io/graphdoc-plugin-operations/tests/tests_report.html)
[![ ](https://gitlab.com/gmullerb/graphdoc-plugin-operations/badges/master/coverage.svg)](https://gmullerb.gitlab.io/graphdoc-plugin-operations/coverage/index.html)
[![Github repo](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com/gmullerb/graphdoc-plugin-operations)
[![Gitlab repo](https://badgen.net/badge/icon/gitlab?icon=gitlab&label)](https://gitlab.com/gmullerb/graphdoc-plugin-operations)

__________________

## Quick Start

1 . Add dependencies:

`package.json`:

```json
  "devDependencies": {
    "@2fd/graphdoc": "2.4.0",
    "graphdoc-plugin-operations": "2.2.0",
    "graphdoc-plugin-flexible": "1.0.2",
```

2 . If default options are not suitable, then configure `graphdoc-plugin-operations`:

`package.json`:

```json
{
  "graphdoc-plugin-operations": {
    "documentTitle": "The Description",
    "navigationTitle": "The Operations",
    "eraseByNameRegex": "^someOperation\\w*",
    "eraseByDescriptionRegex": "@RemoveFromDocumentation",
    "extractParametersDoc": false,
    "enableAssets": false
  }
}
```

3 Use `graphdoc-plugin-operations`:

`package.json`:

```json
  "scripts": {
    "doc": "graphdoc -p graphdoc/../../graphdoc-plugin-operations -p graphdoc/../../graphdoc-plugin-flexible  -p graphdoc/../../graphdoc-plugin-schema -s ./schema.graphql -o ./build/documentation"
  },
  "graphdoc-plugin-flexible": {
    "document.schema": { "disable": true }
  },
  "graphdoc-plugin-schema": {
    "enableAssets": false
  },
  "devDependencies": {
    "@2fd/graphdoc": "2.4.0",
    "graphdoc-plugin-flexible": "1.0.2",
    "graphdoc-plugin-operations": "2.2.0",
    "graphdoc-plugin-schema": "2.0.0",
```

> `graphdoc-plugin-flexible` is required to disable `document.schema` plugin and  allow custom types.  
> `graphdoc-plugin-schema` will substitute disabled `document.schema` plugin when required, and `"enableAssets": false` to avoid assets duplication.  
> `graphdoc/../../` this is required to get external plugins working in `graphdoc`.

__________________

## Goals

`graphdoc-plugin-operations` provides a way document operations independently using [`graphdoc`](https://www.npmjs.com/package/@2fd/graphdoc).

## Options

`package.json`:

(*default values*)

```json
{
  "graphdoc-plugin-operations": {
    "documentTitle": "Description",
    "navigationTitle": "Operations",
    "eraseByNameRegex": "^$",
    "eraseByDescriptionRegex": "^$",
    "extractParametersDoc": true,
    "enableAssets": true
  }
}
```

* `documentTitle`: title of the document section.
* `navigationTitle`: title of the operations section in the navigation.
* `eraseByNameRegex`: Regular Expression to be used to remove operations, based on `name`.
* `eraseByDescriptionRegex`: Regular Expression to be used to remove operations, based on `description`.
* `extractParametersDoc`: if set to false, parameters documentation will be stay on operation declaration.
* `enableAssets`: if set to `false`, then it will disable all the assets provided by the plugin, i.e. script and css files will not be included.
  * `graphdoc-plugin-operations` uses exactly the same assets that `graphdoc-plugin-schema` and `document-schema` use.

The following shows where the `documentTitle`, the `navigationTitle` and the "code block" are located, using the example documentation created by [`graphdoc`](https://www.npmjs.com/package/@2fd/graphdoc), [Pokemon GraphQL HTML Documentation](https://gmullerb.gitlab.io/base-graphdoc-yarn/pokemonattack.doc.html), using [Pokemon GraphQL schema](https://github.com/lucasbento/graphql-pokemon):

![Graphdoc sections](docs/graphdoc-sections.svg)

### Extracted Parameters Documentation

Extracted

![extracted](docs/extracted-parameters.svg)

Not Extracted

![extracted](docs/not-extracted-parameters.svg)

## Using/Configuration

* To use `graphdoc-plugin-operations` is necessary that `document-schema` plugin is disabled (since it doesn't allow custom types), use [`graphdoc-plugin-flexible`](https://graphdoc-plugins.github.io) plugin:

`package.json`

```json
  "scripts": {
    "doc": "graphdoc -p graphdoc/../../graphdoc-plugin-operations  -p graphdoc/../../graphdoc-plugin-flexible -s ./schema.graphql -o ./build/documentation"
  },
  "devDependencies": {
    "@2fd/graphdoc": "2.4.0",
    "graphdoc-plugin-flexible": "1.0.2"
  },
  "graphdoc-plugin-flexible": {
    "document.schema": { "disable": true }
  },
  "devDependencies": {
    "@2fd/graphdoc": "2.4.0",
    "graphdoc-plugin-flexible": "1.0.2",
    "graphdoc-plugin-operations": "2.2.0",
    "graphdoc-plugin-schema": "2.0.0",
```

> You can use [`graphdoc-plugin-schema`](https://graphdoc-plugins.github.io) plugin as an alternative to  `document-schema` plugin.

* `main.mustache` template may need some changes in other to get a better view, e.g.:

    *&#123;&#123;#type}}  
      &#123;&#123;^type.operationName}}&#60;p class="slds-text-title--caps slds-text-color--weak">&#123;&#123;type.kind}}&#60;/p>&#123;&#123;/type.operationName}}  
      &#123;&#123;#type.operationName}}&#60;p class="slds-text-title--caps slds-text-color--weak">Operation&#60;/p>&#123;&#123;/type.operationName}}  
    &#123;&#123;/type}}*

## Online Examples

* Pokemon GraphQL schema: [Project](https://github.com/gmullerb/base-graphdoc-yarn) and [Online generated documentation](https://gmullerb.gitlab.io/base-graphdoc-yarn).
* Github GraphQL schema: [Project](https://github.com/gmullerb/base-graphdoc-npm) and [Online generated documentation](https://gmullerb.gitlab.io/base-graphdoc-npm).

__________________

## Prerequisites

* [`"@2fd/graphdoc": "2.4.0"`](https://www.npmjs.com/package/@2fd/graphdoc/v/2.4.0).

> graphdoc can work with older versions of GraphQL (description syntax: #), and new versions (description syntax: """), [How to configure graphdoc](https://graphdoc-plugins.github.io/docs/how-to-configure-graphdoc.html).

__________________

## Documentation

* [Main documentation](https://graphdoc-plugins.github.io/docs/graphdoc-plugin-operations.html).

* [`CHANGELOG`](CHANGELOG.html): contains the information about changes in each version, chronologically ordered ([Keep a Changelog](http://keepachangelog.com)).

## Contributing

* **Use it**.
* **Share it**.
* [Give it a Star](https://github.com/gmullerb/graphdoc-plugin-operations).
* [Propose changes or improvements](https://github.com/gmullerb/graphdoc-plugin-operations/issues).
* [Report bugs](https://github.com/gmullerb/graphdoc-plugin-operations/issues).

## License

[MIT License](LICENSE.txt)

__________________

## Remember

* Use code style verification tools => Encourages Best Practices, Efficiency, Readability and Learnability.
* Code Review everything => Encourages Functional suitability, Performance Efficiency and Teamwork.
* If viable, Start testing early => Encourages Reliability and Maintainability.

## Additional words

Don't forget:

* **Love what you do**.
* **Learn everyday**.
* **Learn yourself**.
* **Share your knowledge**.
* **Think different!**.
* **Learn from the past, dream on the future, live and enjoy the present to the max!**.
* **Enjoy and Value the Quest** (It's where you learn and grow).

At life:

* Let's act, not complain.
* Be flexible.

At work:

* Let's give solutions, not questions.
* Aim to simplicity not intellectualism.
