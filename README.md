# dom-ot
This will allow to transform DOM tree patches against each other (see #Transformations below)

## Operations
```
  MOV: fromPath, toPath
  MAN: path, property:[null, {String}]

DEL ^= MOV(fromPath, null)
INS ^= MOV(null, toPath) // corresponding tree is in accompanying stack
```

## Transformations
```
                   op1
                 /             =>
change -> change             BECOMES       change -> change -> op1 -> op2
                 \             =>
                   op2 
```
`op1` and `op2` have been created synchronously. In order to apply them both, we transform `op2` onto `op1`.

```
onto   MOV   MAN

MOV    1     2

MAN    3     4
```

### 1. MOV onto MOV
`op2: MOV(fromPath, toPath)` against `op1: MOV(fromPath, toPath)`
```
if op2.fromPath contained in op1.fromPath
  change op2.fromPath to be in op1.toPath

if op1.fromPath contained in op2.fromPath
  nothing happens, tree1 one is already moved out of tree2 by the time op2 comes in to play

if op1.fromPath == op2.fromPath but op1.toPath != op2.toPath
  op2.fromPath = op1.toPath // so effectively, op1 has no effect

if op1.toPath ends on the same level as op2.fromPath and op2.fromPath comes after op1.toPath
  adjust op2.fromPath (shift to right)

if op1.fromPath ends on the same level as op2.fromPath and op2.fromPath comes after op1.fromPath
  adjust op2.fromPath (shift to left)

if op1.toPath ends on the same level as op2.toPath and op2.toPath comes after op1.toPath
  adjust op2.toPath (shift to right)

if op1.fromPath ends on the same level as op2.toPath and op2.toPath comes after op1.fromPath
  adjust op2.toPath (shift to left)
```

### 2. MOV onto MAN
```
Nothing happens.
```

### 3. MAN onto MOV
```
Adjust MAN.path //as seen above (see #1)
```

### 4. MAN onto MAN
```
If both manipulate the text content
  do a text ot transform
else
  nothing happens // (attributes will be overriden by later ops...)
`` 