---
layout: post
title:  "ChainerでMNIST"
date:   2017-01-14 20:07:00
categories: Chainer 機械学習
---

Chainer1.19.0版MNISTのコード

### ネットワークの構築
Chainerでは、Linearクラスで全結合層を構築していく.

``` python
class MLP(chainer.Chain):
    def __init__(self, n_units, n_out):
        super(MLP, self).__init__(
            l1=L.Linear(None, n_units),
            l2=L.Linear(None, n_units),
            l3=L.Linear(None, n_out),
        )

    def __call__(self, x):
        h1 = F.relu(self.l1(x))
        h2 = F.relu(self.l2(h1))
        return self.l3(h2)
```

### 訓練用ネットワークの設定

* ユニット数、ミニバッチサイズ、エポック数を決めておく.
* オプティマイザを設定する.
* データセットを読み込む.
* trainerの初期設定をする.

``` python
    unit = 1000
    batchsize = 100
    epoch = 20

    model = L.Classifier(MLP(unit, 10))

    optimizer = chainer.optimizers.Adam()
    optimizer.setup(model)

    train, test = chainer.datasets.get_mnist()
    train_iter = chainer.iterators.SerialIterator(train, batchsize)
    test_iter = chainer.iterators.SerialIterator(test, batchsize, repeat=False, shuffle=False)

    updater = training.StandardUpdater(train_iter, optimizer)
    trainer = training.Trainer(updater, (epoch, 'epoch'), out='result')

    trainer.extend(extensions.Evaluator(test_iter, model))
```

### 表示の設定

学習経過の表示の設定, グラフの出力設定などを行う.

``` python
    trainer.extend(extensions.dump_graph('main/loss'))
    trainer.extend(extensions.snapshot(), trigger=(epoch, 'epoch'))
    trainer.extend(extensions.LogReport())
    trainer.extend(extensions.PrintReport(
        ['epoch', 'main/loss', 'validation/main/loss',
         'main/accuracy', 'validation/main/accuracy', 'elapsed_time']))
    trainer.extend(extensions.ProgressBar())
```

### 訓練の実行

``` python
trainer.run()
```

本記事で使用したコードは[こちら](https://github.com/nocotan/chainer-example/blob/master/examples/mnist-mlp.py)
