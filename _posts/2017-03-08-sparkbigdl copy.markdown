---
layout: post
title:  "Apache SparkでDeep Learning: BigDLのインストール"
date:   2017-03-08 01:00:00
categories: Spark
---
[Apache Spark](http://spark.apache.org/)  
[Sparkのインストール](http://nocotan.github.io/spark/2017/03/06/sparkinstall-copy.html)は完了しているものとする.  

[BigDL](https://github.com/intel-analytics/BigDL)  
Apache Spark用の分散型ディープラーニングライブラリ.以下のような特徴がある.
* 豊富なディープラーニングのサポート.Torchをモデルにしており、数値計算や高レベルのニューラルネットワークを包括的にサポートする.BigDLを使用してSparkプログラムに事前に学習したCaffeまたはTorchモデルを読み込むことができる.
* 非常に高いパフォーマンス.高性能を実現するために、各Sparkタスクでintel MKLとマルチスレッドプログラミングを使用する.その結果、単一ノードXeon上のCaffe,Torch,TensorFlowよりも数桁高速である.
* 高効率なスケールアウト.Apache Sparkを活用し、同期SGDを効率的に実装し、Sparkで全ての通信を削減することでデータ分析を効率的にスケールアウトすることができる.

Mavenが必要なのでインストールしておく.

```
$ sudo apt-get install maven
```

BigDLのダウンロード

```
$ git clone https://github.com/intel-analytics/BigDL.git
$ cd BigDL
$ source scripts/bigdl.sh
```

ビルドする.この時、java.lang.OutOfMemoryError対策で、PermSizeを設定しておく.

```
$ export MAVEN_OPTS="-Xmx512m -XX:MaxPermSize=128m"
$ bash make-dist.sh
```

もしここで以下のようなエラーが出たら、リブートする.

```
[error] Required file not found: sbt-interface.jar
[error] See zinc -help for information about locating necessary files
```

spark-shellから使用するには、以下のようにする.

```
$ spark-shell --jars BigDL/dist/lib/bigdl-0.1.0-SNAPSHOT-jar-with-dependencies.jar
```
