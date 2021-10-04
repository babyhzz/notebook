# 其他

https://www.cnblogs.com/peterYong/p/12654818.html

HTTPS全过程 = 对称加密 + 非对称加密 + 数字证书

客户端浏览器 vs 服务端

1、客户端浏览器 内置 各大权威机构（CA）的数字证书【含CA的公钥，权威的，不会被篡改的】

CA例如 Digicert、GeoTrust、Globalsign等等，

2、访问https网站，获取到服务器的数字证书，进行验证

1. 校验证书声明的CA在操作系统的根证书里面
2. 校验证书在有效期内
3. 校验证书的签名，这一步能够证明此证书确实是由CA机构颁发的。

其中校验证书签名是关键，证书签名是网站申请证书时，CA机构对一个hash值使用CA私钥对称加密后的字符串。 证书的签名 可以用表达式表达为：

sign = encrypt(hash("证书机构" + "证书有效期" + "证书所有者" + "公钥"))

校验签名的步骤:

- 客户端从系统根证书中取出对应CA的公钥，然后对签名解密 获取到hash值。
- 客户端使用相同的方式拼接证书信息，使用相同算法 得到hash值。
- 比较解密出来的hash值和客户端拼接并运算得到的hash值是否相同，相同则通过。

这个过程其实完成了这么一件事情，客户端看了一眼证书提供的信息，然后通过CA公钥解密，证明了证书提供的信息是被拥有CA私钥的机构确认过的(证书的签名)，便相信了证书提供的信息。

就像现实生活中的票据，相信票据中的信息，因为有一个独一无二的机构签章（虽然可以伪造，但是非对称机密的签章是不可伪造的）
3、客户端 CA的公钥 加密自己的对称密钥 发给服务器

   服务端用CA的私钥 解密，得到客户端的对称密钥。。之后用此对称密钥 加密传输文本。

（涉及到 非对称加密 和对称加密）

Https流程图：

![img](HTTPS.assets/727485-20200530104207440-1880367274.png)

 

解决的问题：

1. 非对称加密只用来传输密码本，实际数据传输用的对称加密，解决了非对称加密解密速度慢的问题
2. CA机构数字证书验证公钥，解决公钥传输的信任问题





# 参考

证书的原理，这个作者讲得非常清楚，一遍就看懂了：https://www.zhihu.com/question/24294477



# TLS/SSL

**SSL**： Secure Socket Layer，安全套接层

**TLS**：Transport Layer Security，传输层安全

由于HTTPS的推出受到了很多人的欢迎，在SSL更新到3.0时，IETF对SSL3.0进行了标准化，并添加了少数机制(但是几乎和SSL3.0无差异)，标准化后的IETF更名为TLS1.0，可以说TLS就是SSL的新版本3.1，并同时发布“RFC2246-TLS加密协议详解”。现在主流的版本是 TLS1.2。未来，可能是 TLS1.3 的时代。

![img](HTTPS.assets/1191499-20170907142439663-265763245.png)



# 加密套件

加密套件列表一般由客户端发送，供服务器选择。用 openssl 查看列表：

```
➜ openssl ciphers -v
ECDHE-RSA-AES256-GCM-SHA384  	TLSv1.2 Kx=ECDH     Au=RSA    Enc=AESGCM(256) Mac=AEAD
ECDHE-ECDSA-AES256-GCM-SHA384 	TLSv1.2 Kx=ECDH     Au=ECDSA  Enc=AESGCM(256) Mac=AEAD
AES256-SHA256                     TLSv1.2 Kx=RSA      Au=RSA    Enc=AES(256)   Mac=SHA256
...
... Cipher Suites(17 suites)
```

上图数据表明列表附带了多达 17 个加密套件，单个拎出来一般长这样：

![img](HTTPS.assets/f41065f4cfad4f15ab5035b01a008701~tplv-k3u1fbpfcp-watermark.image)

意思是：

- `TLS` 握手过程中，使用 `ECDHE` 算法生成 pre_random。
- 身份验证 (签名) 使用 `RSA` 算法。
- 128 位的 `AES` 算法进行对称加密，在对称加密的过程中使用主流的 `GCM` 分组模式，可以让算法用固定长度的密钥加密任意长度的明文。
- 最后是用于数据完整性校验的哈希摘要算法，采用 `SHA256` 算法。

# TLS握手

参考：https://blog.csdn.net/kunyus/article/details/98754475/

## RSA握手

![SSL Handshake RSA](HTTPS.assets/ssl_handshake_rsa.jpg)

具体流程：

1. 浏览器向服务器发送随机数 Client random，TLS 版本和供筛选的加密套件列表。 
2. 服务器接收到，立即返回 Server random，确认好双方都支持的加密套件以及数字证书 (证书中附带公钥 Public key certificate)。 
3. 浏览器接收，先验证**数字证书**。若通过，接着使用加密套件的密钥协商算法RSA算法生成预主密钥 Premaster secret，并且用证书里的公钥加密，传给服务器。 
4. 服务器用私钥解密这个被加密后的预主密钥Premaster secret。
5. 浏览器和服务器使用Client random + Server random + Premaster secret 使用协商好的方式生成对称密钥。

## DH握手

![Diffie-Hellman TLS HandshDiffie-Hellman TLS Handshake](HTTPS.assets/ssl_handshake_diffie_hellman.jpg)



**SSL 数字证书根据可信强度，大概可以分为以下几种：**

- 域名型 SSL 证书（DV SSL）
- 企业型 SSL 证书（OV SSL）
- 增强型 SSL 证书（EV SSL）



https://zhuanlan.zhihu.com/p/144138640

根证书、中间证书



证书验证过程



https://www.zhihu.com/question/37370216

![img](HTTPS.assets/v2-9dda07dc2e12d1ba4bba455f13b1cf0f_1440w.jpg)



授权信息访问：得到非根证书的颁发者证书

![image-20210204182523356](HTTPS.assets/image-20210204182523356.png)



证书分为DV(Digital Verification)，OV(Organization Verification)和EV(Extended Verification)，其中EV证书最贵，可以在浏览器中看到绿色的就是EV证书。证书从申请到批准要走很久的流程，需要提供很多的公司认证信息和个人信息，否则是不会通过的。因此可以保证签发的证书内容是可信的。



证书颁发机构（CA）不会直接从根目录颁发服务器证书（即SSL证书），因为这种行为是十分危险的，因为一旦发生错误颁发或者需要撤销root,则使用root签名的每个证书都会被撤销信任。





