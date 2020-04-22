# React最佳实践

##### 1. 多用 Function Component

如果组件是纯展示型的，**不需要维护 state 和生命周期**，则优先使用 Function Component。代码更简洁，更好的复用性，更小的打包体积，更高的执行效率。

##### 2. 多用 PureComponent

如果组件需要维护 state 或使用生命周期方法，则优先使用 PureComponent，而不是 Component。
Component 的默认行为是**不论 state 和 props 是否有变化**，都触发 render。而 PureComponent **会先对 state 和 props 进行浅比较**，不同的时候才会 render。

##### 3. 遵循单一职责原则，使用 HOC / 装饰器 / Render Props 增加职责

比如一个公用的组件，数据来源可能是父组件传过来，又或者是自己主动通过网络请求获取数据。这时候可以先定义一个纯展示型的 Function Component，然后再定义一个高阶组件去获取数据

##### 4. 避免在 render 里面动态创建对象 / 方法，否则会导致子组件每次都 render

如下例子，即使Child是PureComponent，不会有任何优化效果，因为obj每次都是新的。
```js
render() {
  const obj = { num: 1 }
  return (
    // onClick每次都是新对象？
    <Child obj={obj} onClick={() => {... }} />
  );
}
```

##### 5. 多使用解构，如 Function Component 的 props

```js
const MenuItem = ({
  menuId, menuText, onClick, activeId,
}) => {
  return (
    ...
  );
};
```

##### 6. 定义组件时，定义 PropTypes 和 defaultProps

```jsx
class CategorySelector extends PureComponent {
    ...
}

CategorySelector.propTypes = {
    type: PropTypes.string,
    catList: PropTypes.array.isRequired,
    default: PropTypes.bool,
};

CategorySelector.defaultProps = {
    default: false,
    type: undefined,
};
```

##### 7. 避免使用无谓的标签和样式

```jsx
// bad
<div key={item.uuid} className={scss.serviceItemContainer}>
    <ServiceItem item={item} />
</div>

// good
<ServiceItem key={item.uuid} item={item} className={customStyle} />

```



# Ant Design最佳实践

##### 1. Modal处理方式

对于一个button关联一个modal的情况，可以将button和modal放在一个组件中，内部管理modal的显示与否

```jsx
class A extends Component {
	state = { 
    visible: false
  }

	render() {
    return (
    	<>
      	<Button></Button>
      	<Modal visible={this.state.visible}></Modal>
      </>
    )
  }

}
```

