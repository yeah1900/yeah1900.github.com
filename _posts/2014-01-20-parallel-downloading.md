---
layout: post
title: "网页资源的并发加载"
description: ""
category: 
tags: []
---

在同一时间内，浏览器对同一主机发起的请求数是有限制的，超出限制的请求会被阻塞直到之前的请求完成。[这个页面](http://www.browserscope.org/?category=network)显示了主流浏览器支持的并发连接数情况。

我们主要关注以下两个数据：

- Connections per Hostname（同一主机的最大并发连接数）

> When HTTP/1.1 was introduced with persistent connections enabled by default, the suggestion was that browsers open only two connections per hostname. Pages that had 10 or 20 resources served from a single hostname loaded slowly because the resources were downloaded two-at-a-time. Browsers have been increasing the number of connections opened per hostname, for example, IE went from 2 in IE7 to 6 in IE8. This test measures how many HTTP/1.1 connections are opened for the browser being tested.

- Max Connections（全局最大并发连接数）

> This test measures the maximum number of connections a browser will open total - across all hostnames. The upper limit is 60, so if a browser actually supports more than that it'll still show up as 60.

HTTP1.1引入了“持久化连接”（persistent connection），使用同一个TCP连接来发送和接收多个HTTP请求/应答，而不是为每一个新的请求/应答打开新连接。由于每个TCP连接占用了更长的时间，相比HTTP/1.0，它建议使用更少的并发连接数以节省服务器的资源。

将资源分散在不同的域名（通过CName为同一主机设定多个域名），可以提高资源下载的并发度，加快网页加载的速度。然而由于DNS解析，客户端CPU资源消耗的增加，域名并不是越多越好。最佳实践是2~4个域名较好。

# JS脚本的并行加载

Javascript在浏览器中加载和运行有以下特点：（摘自[这里](http://lifesinger.wordpress.com/2012/02/03/performance-impact-of-js-css-loading-order/)）

 - Javascript脚本在执行时会阻塞页面的渲染以及其他资源的下载。这是因为脚本中可能会存在影响文档结构的```document.write```代码。
 - 只有之前所有的CSS被下载和解析完成，Javascript才会被执行。
 - 现代浏览器对资源下载做了优化，会对后续的Javascript，CSS等资源进行并发下载（但不执行）。

基于这些特定，所以为了避免```<script>```加载阻塞后续页面的执行，通常将其放在文档的最后（```</body>```之前）。

## ```<script>```的两个属性（参见[这里](http://stackoverflow.com/questions/3952009/defer-attribute-chrome)）

- ```defer```是IE最先引入的一个```<script>```的属性。它的效果是这段脚本会被立即下载，但会延后到所有文档内容加载完毕才执行，因此也就不会阻塞后续文档内容的加载。有多个```defer```的脚本同时存在时，他们的执行顺序和定义的先后顺序相同。
- ```async```是在HTML5标准钟引入的一个和```defer```类似的属性。区别在于：它可能在下载后的任何时间被执行，而且执行顺序是随机的。

```DOMContentLoaded``` 和```load```事件是在所有```defer```和```async```脚本执行完之后才会被触发。

## Javascript加载器

- [LABJS(Loading And Blocking JavaScript)](http://labjs.com/) = 异步并行加载（Loading） + 同步等待执行（Blocking）。[这篇文章](http://oldj.net/article/labjs-study/)有很好的实现原理分析。下面是一段使用LABJS的实例：

```javascript
$LAB.script("script1.js")
    .wait()    // 空的wait()只是确保script1在其他代码之前被执行
    .script("script2.js")    // script2 和 script3 依赖于 script1
    .script("script3.js")
    .wait()    // 但是script2 和 script3 并不互相依赖,可以并行下载
    .script("script4.js")    //script4 依赖于 script1, script2 及 script3
    .wait(function(){script4Func();});
```

- [RequireJS](http://requirejs.org/)和[SeaJS](seajs.org/‎)是模块加载器。前者遵循[AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition)（异步模块定义规范），后者遵循的是[CMD](https://github.com/cmdjs/specification/blob/master/draft/module.md)（通用模块定义规范）。两个规范的不同参见[这里](http://stackoverflow.com/questions/16521471/relation-between-commonjs-amd-and-requirejs)。

- [ControlJS](http://stevesouders.com/controljs/)通过将```<script>``` 的```type```属性更改为浏览器无法识别的字符串来实现Javascript文件的并行下载但不立刻执行。

> Nicholas Zakas也因ControlJS引发了很多思考，并分析了ControlJS和LABJS的区别所在，详细内容可以阅读[Thoughts on script loaders](http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/)和[Separating JavaScript download and execution](http://www.nczonline.net/blog/2011/02/14/separating-javascript-download-and-execution/)。Zakas不赞成使用额外的脚本加载库，会因为浏览器检测的依赖，需要高成本的维护，同时浏览器的发展会为我们解决此类问题。

Steve Souders写了一个用了测试工具 —— [Cuzillion](http://stevesouders.com/cuzillion/)，可以用来验证、测试关于资源并行加载的结果。
