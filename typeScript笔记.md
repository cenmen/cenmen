```typeScript
function test(a: string, b: number): string {
  return ''
}

let a: string | number
let b: any
let c: unknown;
a = b // a 被动变为 any 类型
// a = c // unknown 不能直接赋值给明确类型

function test1(): void {
  return
}

function test2(): never{
  throw new Error("err");
}

let d: {name: string, age?: number}
d = {name: 'd'}

let e: {age: number, [key: string]: number}
e = {age: 1, ever: 1}

let f: (a: number, b: number) => number
f = (a: number, b: number) => 1

let g: string[]
// let g: Array<number>

// 元组：固定长度的数组
// 语法： [类型, 类型, 类型]
```