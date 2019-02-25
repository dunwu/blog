

自定义标签是用户定义的JSP语言元素。

当JSP页面包含一个自定义标签时将被转化为servlet，标签转化为对被称为tag handler的对象的操作，即当servlet执行时Web container调用那些操作。

JSP标签扩展可以让你创建新的标签并且可以直接插入到一个JSP页面。 JSP 2.0规范中引入Simple Tag Handlers来编写这些自定义标记。

编写自定义步骤的方法

任何一个标签都对应一个Java类，该类必须实现Tag接口。

声明一个tld标签库描述文件

如果tld文件位于/WEB-INF目录下面，Tomcat会自动加载tld文件中的标签库。如果是某些不支持自动加载或者放于其他位置的tld文件，可以在web.xml中配置。