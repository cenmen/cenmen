## 参考资料
 - [TypeScript Learn](https://github.com/JasonkayZK/typescript-learn)

## **TypeScript 中的基本类型**

TypeScript 中的基本类型：

- 类型声明

  - 类型声明是 TS 非常重要的一个特点；

  - 通过类型声明可以指定 TS 中变量（参数、形参）的类型；

  - 指定类型后，当为变量赋值时，TS 编译器会自动检查值是否符合类型声明，符合则赋值，否则报错；

  - 简而言之，类型声明给变量设置了类型，使得变量只能存储某种类型的值；

  - 语法：

    - ```typescript
      let 变量: 类型;

      let 变量: 类型 = 值;

      function fn(参数: 类型, 参数: 类型): 类型{
          ...
      }
      ```

- 自动类型判断

  - TS 拥有自动的类型判断机制
  - 当对变量的声明和赋值是同时进行的，TS 编译器会自动判断变量的类型
  - 所以如果你的变量的声明和赋值时同时进行的，可以省略掉类型声明

- 类型：

  | **类型** |     **例子**      |            **描述**             |
  | :------: | :---------------: | :-----------------------------: |
  |  number  |    1, -33, 2.5    |            任意数字             |
  |  string  | 'hi', "hi", `hi`  |           任意字符串            |
  | boolean  |    true、false    |      布尔值 true 或 false       |
  |  字面量  |      其本身       |  限制变量的值就是该字面量的值   |
  |   any    |        \*         |            任意类型             |
  | unknown  |        \*         |         类型安全的 any          |
  |   void   | 空值（undefined） |     没有值（或 undefined）      |
  |  never   |      没有值       |          不能是任何值           |
  |  object  |  {name:'孙悟空'}  |         任意的 JS 对象          |
  |  array   |      [1,2,3]      |          任意 JS 数组           |
  |  tuple   |       [4,5]       | 元素，TS 新增类型，固定长度数组 |
  |   enum   |    enum{A, B}     |       枚举，TS 中新增类型       |

- number

  - ```typescript
    let decimal: number = 6
    let hex: number = 0xf00d
    let binary: number = 0b1010
    let octal: number = 0o744
    let big: bigint = 100n
    ```

- boolean

  - ```typescript
    let isDone: boolean = false
    ```

- string

  - ```typescript
    let color: string = 'blue'
    color = 'red'

    let fullName: string = `Bob Bobbington`
    let age: number = 37
    let sentence: string = `Hello, my name is ${fullName}.
    
    I'll be ${age + 1} years old next month.`
    ```

- 字面量

  - 也可以使用字面量去指定变量的类型，通过字面量可以确定变量的取值范围

  - ```typescript
    let color: 'red' | 'blue' | 'black'
    let num: 1 | 2 | 3 | 4 | 5
    ```

- any

  - ```typescript
    let d: any = 4
    d = 'hello'
    d = true
    ```

- unknown

  - ```typescript
    let notSure: unknown = 4
    notSure = 'hello'
    ```

- void

  - ```typescript
    let unusable: void = undefined
    ```

- never

  - ```typescript
    function error(message: string): never {
      throw new Error(message)
    }
    ```

- object（没啥用）

  - ```typescript
    let obj: object = {}
    ```

- array

  - ```typescript
    let list: number[] = [1, 2, 3]
    let list: Array<number> = [1, 2, 3]
    ```

- tuple

  - ```typescript
    let x: [string, number]
    x = ['hello', 10]
    ```

- enum

  - ```typescript
    enum Color {
      Red,
      Green,
      Blue,
    }
    let c: Color = Color.Green

    enum Color {
      Red = 1,
      Green,
      Blue,
    }
    let c: Color = Color.Green

    enum Color {
      Red = 1,
      Green = 2,
      Blue = 4,
    }
    let c: Color = Color.Green
    ```

- 类型断言

  - 有些情况下，变量的类型对于我们来说是很明确，但是 TS 编译器却并不清楚，此时，可以通过类型断言来告诉编译器变量的类型，断言有两种形式：

    - 第一种

      - ```typescript
        let someValue: unknown = 'this is a string'
        let strLength: number = (someValue as string).length
        ```

    - 第二种

      - ```typescript
        let someValue: unknown = 'this is a string'
        let strLength: number = (<string>someValue).length
        ```

## 接口（Interface）

接口的作用类似于抽象类，不同点在于：接口中的所有方法和属性都是没有实值的，换句话说接口中的所有方法都是抽象方法；

接口主要负责定义一个类的结构，接口可以去限制一个对象的接口：对象只有包含接口中定义的所有属性和方法时才能匹配接口；

同时，可以让一个类去实现接口，实现接口时类中要保护接口中的所有属性；

示例（检查对象类型）：

```typescript
interface Person {
  name: string
  sayHello(): void
}

function fn(per: Person) {
  per.sayHello()
}

fn({
  name: '孙悟空',
  sayHello() {
    console.log(`Hello, 我是 ${this.name}`)
  },
})
```

示例（实现）：

```typescript
interface Person {
  name: string
  sayHello(): void
}

class Student implements Person {
  constructor(public name: string) {}

  sayHello() {
    console.log('大家好，我是' + this.name)
  }
}
```

## 泛型（Generic）

定义一个函数或类时，有些情况下无法确定其中要使用的具体类型（返回值、参数、属性的类型不能确定）；

此时泛型便能够发挥作用；

举个例子：

```typescript
function test(arg: any): any {
  return arg
}
```

上例中，test 函数有一个参数类型不确定，但是能确定的时其返回值的类型和参数的类型是相同的；

由于类型不确定所以参数和返回值均使用了 any，但是很明显这样做是不合适的：

首先使用 any 会关闭 TS 的类型检查，其次这样设置也不能体现出参数和返回值是相同的类型；

### 泛型函数

#### 创建泛型函数

```typescript
function test<T>(arg: T): T {
  return arg
}
```

这里的`<T>`就是泛型；

T 是我们给这个类型起的名字（不一定非叫 T），设置泛型后即可在函数中使用 T 来表示该类型；

所以泛型其实很好理解，就表示某个类型；

那么如何使用上边的函数呢？

#### 使用泛型函数

##### 方式一（直接使用）：

```typescript
test(10)
```

使用时可以直接传递参数使用，类型会由 TS 自动推断出来，但有时编译器无法自动推断时还需要使用下面的方式

##### 方式二（指定类型）：

```typescript
test<number>(10)
```

也可以在函数后手动指定泛型；

#### 函数中声明多个泛型

可以同时指定多个泛型，泛型间使用逗号隔开：

```typescript
function test<T, K>(a: T, b: K): K {
  return b
}

test<number, string>(10, 'hello')
```

使用泛型时，完全可以将泛型当成是一个普通的类去使用；

### 泛型类

类中同样可以使用泛型：

```typescript
class MyClass<T> {
  prop: T

  constructor(prop: T) {
    this.prop = prop
  }
}
```

### 泛型继承

除此之外，也可以对泛型的范围进行约束

```typescript
interface MyInter {
  length: number
}

function test<T extends MyInter>(arg: T): number {
  return arg.length
}
```

使用 T extends MyInter 表示泛型 T 必须是 MyInter 的子类，不一定非要使用接口类和抽象类同样适用；
