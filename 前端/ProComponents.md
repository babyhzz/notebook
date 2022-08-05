# ProTable

ProTable的属性基本上继承了Table的所有属性

Form 的列是根据 `valueType` 来生成不同的类型。

**不翻页 + 关键字搜索**

```jsx
<ProTable
      rowKey="id"
      pagination={false}
      columns={columns}
      search={false}
      postData={data => {
        console.log(data.length);
        return data;
      }}
      options={{
        search: {
          placeholder: '这是输入框的Placeholder',
          style: { width: 300 },
        },
        fullScreen: false,
        reload: false,
        setting: false,
        density: false,
      }}
      dateFormatter="string"
      headerTitle="这是headerTitle"
      request={async params => {
        const result = await request('https://proapi.azurewebsites.net/github/issues', { params });
        return {
          data: result.data,
          total: result.total,
          success: true,
        };
      }}
      scroll={{
        y: 'calc(100vh - 160px)',
      }}
      size="middle"
    />
```
