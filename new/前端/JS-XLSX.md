操作excel的库js-xlsx

https://www.cnblogs.com/ajaemp/p/12880847.html

XLSX.read可以以各种方式读取excel文件，返回一个Workbook的对象

SheetNames保存所有的sheet名字

Sheets一个map，保存每个sheet的内容，即Sheet Object，每个SheetObject是由类似A1这样键值保存的单元格。称为CellObject。

CellObject每个字段定义如下：

https://github.com/SheetJS/sheetjs#cell-object



可以配合 `file-saver` 这个库来使用。

FileSaver.js 在客户端下载文件。如果是服务端下载文件，使用Content-Disposition消息头，更好的兼容性

```http
Content-Type: 'application/octet-stream; charset=utf-8'
Content-Disposition: attachment; filename="filename.jpg"; filename*="filename.jpg"
Content-Length: <size in bytes>
```





