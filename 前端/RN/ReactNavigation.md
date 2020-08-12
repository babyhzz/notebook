# createStackNavigator

## 配置

 https://reactnavigation.org/docs/stack-navigator/#title 



在组件内部自定义Header上的菜单

```js
function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount(c => c + 1)} title="Update count" />
      ),
    });
  }, [navigation]);

  return <Text>Count: {count}</Text>;
}
```

