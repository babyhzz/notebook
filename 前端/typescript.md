## 接口
``` ts
interface Animal {
  name: string;
  eat(str:string):void;
}

class Dog implements Animal {
  name: string;

  constructor(name:string){
    this.name = name;
  }

  eat(str: string):void {
    console.log(`${this.name}吃${str}`)
  }
}

var dog = new Dog('小黑');
dog.eat('老鼠');
```

## 命名空间
``` ts
namespace A {
  interface Animal {
    name: string;
    eat(str: string): void;
  }

  export class Dog implements Animal {
    name: string;

    constructor(name: string) {
      this.name = name;
    }

    eat(str: string): void {
      console.log(`${this.name}吃${str}`)
    }
  }
}

new A.Dog('小黑').eat('草');
```
模块需要export命名空间
``` ts
export namespace A
```

## 装饰器
当多个装饰器应用在一个声明上时会进行如下步骤的操作：

+ 由上至下依次对装饰器表达式求值。
+ 求值的结果会被当作函数，由下至上依次调用
+ 