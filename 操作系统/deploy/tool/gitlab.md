# Gitlab

## 安装

### 自签名证书

首先，创建认证目录

```
sudo mkdir -p /etc/gitlab/ssl
sudo chmod 700 /etc/gitlab/ssl
```

#### 创建证书

##### （1）创建 Private Key

```
sudo openssl genrsa -des3 -out /etc/gitlab/ssl/gitlab.domain.com.key 2048
```

会提示输入密码，请记住

##### （2）生成 Certificate Request

```
sudo openssl req -new -key /etc/gitlab/ssl/gitlab.domain.com.key -out /etc/gitlab/ssl/gitlab.domain.com.csr
```

根据提示，输入信息

```
Country Name (2 letter code) [XX]:CN
State or Province Name (full name) []:JS
Locality Name (eg, city) [Default City]:NJ
Organization Name (eg, company) [Default Company Ltd]:xxxxx
Organizational Unit Name (eg, section) []:
Common Name (eg, your name or your server's hostname) []:gitlab.xxxx.io
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

##### （3）移除Private Key 中的密码短语

```
sudo cp -v /etc/gitlab/ssl/gitlab.domain.com.{key,original}
sudo openssl rsa -in /etc/gitlab/ssl/gitlab.domain.com.original -out /etc/gitlab/ssl/gitlab.domain.com.key
sudo rm -v /etc/gitlab/ssl/gitlab.domain.com.original
```

##### （4）创建证书

```
sudo openssl x509 -req -days 1460 -in /etc/gitlab/ssl/gitlab.domain.com.csr -signkey /etc/gitlab/ssl/gitlab.domain.com.key -out /etc/gitlab/ssl/gitlab.domain.com.crt
```

##### （5）移除证书请求文件

```
sudo rm -v /etc/gitlab/ssl/gitlab.domain.com.csr    
```

##### （6）设置文件权限

```
sudo chmod 600 /etc/gitlab/ssl/gitlab.domain.com.*
```

#### gitlab 配置更改

```
sudo vim /etc/gitlab/gitlab.rb
external_url 'https://gitlab.domain.com'
```

##### gitlab 网站https：

```
nginx['redirect_http_to_https'] = true
```

##### gitlab ci 网站https：

```
ci_nginx['redirect_http_to_https'] = true
```

##### 复制证书到gitlab目录：

```
sudo cp /etc/gitlab/ssl/gitlab.domain.com.crt /etc/gitlab/trusted-certs/
```

##### gitlab重新配置+更新：

```
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```

