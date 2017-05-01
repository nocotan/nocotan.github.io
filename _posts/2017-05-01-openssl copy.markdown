---
layout: post
title:  "OpenSSL"
date:   2017-05-01 01:00:00
categories: 通信/ネットワーク
---
OpenSSLは通信を暗号化するSecure Sockets Layero(SSL)をオープンソースで実装するライブラリ。
SSLは安全な通信を行うためにサーバとクライアント間で暗号化して盗聴を防ぐことを目的としている。
クライアントは、サーバの公開鍵を使用してサーバに接続し、暗号化したファイルを送信する。
サーバは公開鍵の対となる秘密鍵で復号化する。SSLはWebで頻繁に使用されている。
SSLを使用しない通信はhttp://(ポート番号80)となり、SSLを使用した通信はhttps://(ポート番号443)となる。  
2017/2/16時点で、バグやセキュリティの修正を含むOpenSSL 1.1.0eが利用可能となった。  
[OpenSSL](https://www.openssl.org/)

### 関連用語

#### CA(Certification Authority)
SSLを使用するための証明書を発行する認証局。

#### CRL(Certificate Revocation List)
証明書失効リスト。鍵の漏えいなどで鍵の信頼性が失われ、無効となった証明書のリストである。以下の二種類の失効理由がある。

#### CSR(Certificate Signing Request)
証明書を発行するために認証局(CA)に提出する証明書発行要求ファイル。

#### DER
証明書、秘密鍵、CSR、及びCRLファイルの形式。

#### DES(Data Encryption Standard)
対称鍵暗号の一方式

#### PEM
証明書、秘密鍵、CSR、及びCRLファイルの形式。DER形式のファイルをBase64にエンコー
ド処理したテキスト形式のファイル。

#### RSA(Rivest Shamir Adleman)
桁数の大きい合成数の素因数分解問題が困難であることを安全性の根拠とした公開鍵暗
号の一つ。

#### X.509
電子証明書及び証明書執行リスト(CRL)の標準仕様。

### インストール

```
$ wget -P /usr/local/src https://www.openssl.org/source/openssl-1.1.0e.tar.gz
$ cd /usr/local/src
$ tar xzf openssl-1.1.0e.tar.gz
$ cd openssl-1.1.0e.tar.gz
$ ./config --prefix=/usr/local
$ make
$ make install
```

