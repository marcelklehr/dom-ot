# dom-ot
The DOM changes. You can [capture](https://github.com/marcelklehr/mutation-summary) those changes and [sync](https://github.com/marcelklehr/gulf) multiple documents in real-time using this library to transform the changes.

## Install

```
npm install dom-ot
```

## Operations
```
  MOV: fromPath, toPath
  MAN: path, property:[null, {String}]

DEL ^= MOV(fromPath, null)
INS ^= MOV(null, toPath) // corresponding tree is in accompanying stack
```

### Transformations
Transformation is needed for preserving a linear history.
```
                   op1
                 /             =>
change -> change             BECOMES       change -> change -> op1 -> op2
                 \             =>
                   op2
```
`op1` and `op2` have been created concurrently. In order to apply them both, we transform `op2` onto `op1`.
