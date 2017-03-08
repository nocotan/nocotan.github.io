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

Scalaをインストールする

```
$ wget http://downloads.lightbend.com/scala/2.12.1/scala-2.12.1.deb
$ dpkg -i scala-2.12.1.deb
```

Apache Spark2.02をインストールする.

```
$ wget http://d3kbcqa49mib13.cloudfront.net/spark-2.0.2-bin-hadoop2.7.tgz
$ tar xvf spark-2.0.2-bin-hadoop2.7.tgz
$ cp -rv spark-2.0.2-bin-hadoop2.7 /opt/spark
$ cd /opt/spark
```

動作確認.

```
$ ./bin/spark-shell --master local[2]
```
