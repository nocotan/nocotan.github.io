---
layout: post
title:  "Apache Sparkのインストール"
date:   2017-03-06 01:00:00
categories: Spark
---
[Apache Spark](http://spark.apache.org/)はAMPLabにて開発されたクラスターコンピューティングフレームワーク.  
今回はubuntu16.04にApache Spark-2.02をインストールする.  
Apache Sparkを動かすには、Javaをインストールする必要がある.

```
$ sudo apt-add-repository ppa:webupd8team/java
$ sudo apt-get update
$ sudo apt-get install oracle-java7-installer
```

以下のコマンドで、Javaが正しくインストールされているかどうか確認する.

```
$ java -version
java version "1.7.0_80"
Java(TM) SE Runtime Environment (build 1.7.0_80-b15)
Java HotSpot(TM) 64-Bit Server VM (build 24.80-b11, mixed mode)
```

Apache Sparkのビルドはgitに依存するため、gitをインストールする.

```
$ sudo apt-get install git
```

Apache Sparkをダウンロード及び解凍して、/usr/local/share/sparkに配置する.
その後、Mavenを使用してビルドする.

```
$ mkdir /usr/local/share/spark
$ sudo curl http://d3kbcqa49mib13.cloudfront.net/spark-2.0.2.tgz | sudo tar xvz -C
/usr/local/share/spark
$ cd /usr/local/share/spark/spark-2.0.2
$ ./build/mvn -DskipTests clean package
```
