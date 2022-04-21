 - jsx 由 babel 转义，会带上严格模式
 - class 可以省略 constructor
 - 样式的类名指定不要用 class,要用 className
 - 内联样式,要用 style={{key:value}} 的形式 (双{}代表对象,单{}代表表达式) 去写
 - 组件定义首字母需要大写
 - class 可以在 render 里解构所需要的属性
 ```javascript
 render() {
   const {name} = this.props
   const {age} = this.state
   return <div>{name} - {age}</div>
 }
 ```
 - class 里 jsx 直接调用方法会丢失 this ，所以需要进行 bind 或箭头函数绑定 this
 - class 可以添加 static propTypes 限制 props 传参内容，static defaultProps 设置 props 默认值
 - 直接改状态会改变值 this.state.xxx = xx , 但不会更新视图，需要使用 setState 更新
 - jsx 事件可以直接传入 DOM 事件 event 对象参数
 ```
 <input onChange={event => this.saveFormData('username',event) } type="text" name="username"/>
 ```
 - 使用 ref 形式：字符串（不推荐），回调函数，React.createRef
 - this.setState 第一个参数可以是对象也可以是函数，第二个参数为更新状态后的回调，可以获取 state 被更新后的值。第一个参数使用对象的场景适合于不依赖其他状态，例如 `this.setState({count: 1})`，第二个参数为函数是，函数默认接收两个参数 state 和 props `this.setState((state, props) => ({count: state.count + 1}))`, this.setState 空值也会触发组件重新渲染
  - `<React.Fragment>` 可以写 key ，`<>` 空标签不能写 key 
  - context 需要被所需要组件能访问, 使用 React.createContext 创建 context ，父组件使用 `<context.Provider>`包括子孙组件， 孙组件通过 `static contextType = context` 声明后使用 this.context 读取，或者孙组件通过 `<context.Consumer>`包括自身标签使用函数 value => {} 读取
  ```
  const MyContext = React.createContext()
  class Parent extends React.Component {
    state = {name: 'ha'}
    render () {
      return (
        <MyContext.Provider value={state.name}>
          <ChildA />
        </MyContext.Provider>
      )
    }
  }
  class ChildA extends React.Component {
    render () {
      return (
        <>
          <ChildB />
          <ChildC />
        </>
      )
    }
  }
  class ChildB extends React.Component {
    static contextType = MyContext
    render () {
      return (
        <>
          {this.context}
        </>
      )
    }
  }
  class ChildC extends React.Component {
    render () {
      return (
        <MyContext.Consumer>
          {value => value}
        </MyContext.Consumer>
      )
    }
  }
  ```
  - （生产环境）获取子组件发生错误信息钩子：getDerivedStateFromError，componentDidCatch