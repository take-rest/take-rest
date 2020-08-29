# take-rest

A node package to create custom REST API

### Build Status

![](https://github.com/take-rest/take-rest/workflows/Node.js%20CI/badge.svg)

## Table of Contents

- [Features](#features)
- [Installing](#installing)
- [Examples](#examples)
- [API](#api)

## Features

## Installing

<!-- Using npm:

```bash
$ npm install take-rest
``` -->

## Examples

### `GET` Request

```js
method: "get",
url: `http://localhost:5050/api/<schemaName>`,
headers: { "content-type": "application/json" }
```

### `POST` Request

```js
method: "post",
url: `http://localhost:5050/api/<schemaName>`,
headers: { "content-type": "application/json" },
data: JSON inputBody,
```

### `PUT` Request

```js
method: "put",
url: `http://localhost:5050/api/<schemaName>?id=1`,
headers: { "content-type": "application/json" },
data: JSON inputBody,
```

### `DELETE` Request

```js
method: "delete",
url: `http://localhost:5050/api/<schemaName>?id=1`,
headers: { "content-type": "application/json" }
```

## API
