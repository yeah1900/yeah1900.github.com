---
layout: post
title: "第一篇日志"
description: ""
category: 
tags: []
---
{% include JB/setup %}

这两天做了这么几件事情：

1. 使用Github Pages来搭建博客。主要尝试了以下几种方式：
	* 阮一峰写过一篇["搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门"](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)，方法很直观，但提供的功能有限，博客样式也需要自定义，工作量太大。
	* [Octopress](http://octopress.org)功能很强大。但因为它用到了很多Jekyll插件，而github pages基于的Jekyll引擎禁止插件的，所以只能往上部署生成的静态文件。这样的话，就需要在另一个地方维护源文件。
	* [Jekyll Bootstrap](http://jekyllbootstrap.com/)是上面两个方法的折中，它能和Github很好地兼容，也提供了一些可供选择的布局主题。所以我最后也采用了这个方式。

1. 学习了AngularJS和Bootstrap框架，并用它们做了两个Web小应用：[个税计算器](/assets/pages/calculator.html) 和 [打字测试](/assets/pages/typing.html)。