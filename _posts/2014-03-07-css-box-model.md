---
layout: post
title: "CSS Box Model"
description: ""
category: 
tags: []
---

CSS盒子模型适用于所有的HTML块级元素（即CSS的display属性值为block）。

如下图所示，盒子模型是由`margin`、`border`、`padding`以及内容本身四部分组成。
![Box Model](/assets/img/box-model.png "Box Model")
这个盒子的大小是由`border`，`padding`和内容本身三部分共同决定的。而CSS中的``width``和``height``属性只负责定义内容本身的大小，所以在有`padding``和`border`存在的情况下，我们看到的元素要比“定义”的大些。

这个规则给开发带来很多的不便。比如下面这个例子：

```html
<style>
.container {
	width: 1000px;
	height: 500px;
}
.evenly-divided-column {
	float: left;
	width: 50%;
	height: 100%;
	border: 1px solid #000;
}
</style>
<div class="container">
	<div class='evenly-divided-column'></div>
	<div class='evenly-divided-column'></div>
</div>
```

这段代码是为了显示两个水平并列、大小相同的元素。然后由于上述规则的存在，两个子元素实际的宽度要大于50%，因此后一元素就被推到了下一行。

如何解决？可以使用CSS3引入的[`box-sizing`](http://www.w3.org/TR/css3-ui/#box-sizing)属性。

```css
.evenly-divided-column {
	box-sizing: border-box;
}
```

它重新定义了`width`和`height`的含义，将`border`和`padding`部分一并归入其限定的大小范围中。