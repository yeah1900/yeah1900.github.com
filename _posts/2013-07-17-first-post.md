---
layout: post
title: "第一篇日志"
---

一直想在Github上建一个自己的博客，这两天终于把这个想法实现了。

Github Pages是基于[Jekyll](http://jekyllrb.com/)，我试了以下几个方式：

* 阮一峰的这篇["搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门"](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)讲到的方法很直观，但提供的功能有限，博客样式也需要自定义，工作量太大。
 
* [Octopress](http://octopress.org)功能很强大。但因为它用到了很多Jekyll插件，而github pages基于的Jekyll引擎禁止插件的，所以只能往上部署生成的静态文件。这样的话，就需要在另一个地方维护源文件。

* [Jekyll Bootstrap](http://jekyllbootstrap.com/)是上面两个方法的折中，它能和Github很好地兼容，也提供了一些可供选择的布局主题。

所以，最后我决定用第三种方式来搭建博客。	



接下来打算美化一下博客。Jekyll Bootstrap自带了几个[可选主题](http://jekyllbootstrap.com/usage/jekyll-theming.html)。~~不过，我想有空的话还是要自己定制下，现在就先用[twitter](http://themes.jekyllbootstrap.com/preview/twitter)将就下。~~最后，我打算使用[这个博客的主题](http://webfrogs.me/)。

Jekyll自带Pygments做代码高亮，不过让它工作还是花了不少功夫。Jekyll是用ruby写的，可Pygments却是基于Python的，所以得先安装Python2.x（经测试，3.x是不行的）。接下来就用Python的[easy_install](http://chxt6896.github.io/python/2011/12/03/python-setuptools-easyinstall.html)（类似于ruby的gem）来安装```Pygments```。下一步，我们需要安装一个叫做Pygments.rb的gem来调用Python那边的Pygments。可以通过Pygmentize命令来生成代码高亮的样式文件并把它引用到布局文件里。

```bash
$ pygmentize -S native -f html > pygments.css
```

最后看下效果：

```javascript
function sum(arr){
	var i = 0, len = arr.length, sum = 0;
	for ( ; i < len ; i++){
		sum += arr[i];
	}
	return sum;
}
```

```css
white-space:pre;
white-space:pre-wrap;
word-break:break-all;
word-wrap:break-word;
```

```html
<div class="row statistics text-center">
	<div class="span4 red">
		正确率：{{statistics.correct}} / {{statistics.typed}} = {{statistics.correctPct | number:0}}%
	</div>
	<div class="span4 green">
		时间：{{statistics.timeElapsedStr}}
	</div>
	<div class="span4 blue">
		速度：{{statistics.speed | number:0}}字 / 分
	</div>
</div>
```