---
layout: post
title:  "Apache Sparkでk-means"
date:   2017-03-07 01:00:00
categories: Spark 機械学習
---
[Apache Spark](http://spark.apache.org/)  
[Sparkのインストール](http://nocotan.github.io/spark/2017/03/06/sparkinstall-copy.html)は完了しているものとする.  

### k-means
k-meansは、データセットをあらかじめ決めておいたクラスタ数にクラスタリングする一
般的なクラスタリングアルゴリズムのうちの一つ.
MLlibの実装には、kmeans||と呼ばれる、k-means++の並列化変形が含まれる.

### 例

org.apache.spark.ml.clustering.KMeansをインポートすることでk-meansが使用できる.  
* 2行目はデータセットの読み込みを行う.データセットのパスは適宜変更する.
* 3行目でクラスタ数、及びランダムシードを与えている.
* 4行目でデータセットに対して学習させる.
* 最後の行では各クラスタの重心を表示している.

```
scala> import import org.apache.spark.ml.clustering.KMeans
import org.apache.spark.ml.clustering.KMeans

scala> val dataset = spark.read.format("libsvm").load("/opt/spark/data/mllib/sample_kmeans_data.txt")
dataset: org.apache.spark.sql.DataFrame = [label: double, features: vector]

scala> val kmeans = new KMeans().setK(2).setSeed(1L)
kmeans: org.apache.spark.ml.clustering.KMeans = kmeans_480ce4224497

scala> val model = kmeans.fit(dataset)
model: org.apache.spark.ml.clustering.KMeansModel = kmeans_480ce4224497

scala> val WSSSE = model.computeCost(dataset)
WSSE: Double = 0.11999999999994547

scala> model.clusterCenters.foreach(println)
[9.1,9.1,9.1]
[0.1,0.1,0.1]
```

