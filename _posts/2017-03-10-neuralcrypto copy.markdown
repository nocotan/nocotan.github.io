---
layout: post
title:  "ニューラルネットワークと暗号化及び機密性の確保"
date:   2017-03-10 01:00:00
categories: 機械学習 暗号
---
アリスはボブにセキュアにメッセージを送りたいと考えている。
また、第三の攻撃者であるイブはそのメッセージを盗聴したいと考えている。
ここで、セキュリティ属性は機密性であり、攻撃者は通信を傍受できる受動的攻撃者であるが、セッションを開始したり、メッセージを改ざんしたりといった能動的攻撃は制限されているものとする。


## システム構成
アリスはボブに平文Pを送信したいものとする。ここでアリスはPを暗号文Cに暗号化し、ボブに送る。ボブはCを正確に複合し、複合文P<sub>Bob</sub>を得たい。同時に、イブも暗号文Cを傍受し複合文P<sub>Eve</sub>を得ようと試みる。  

![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/neuralcrypto.png)

## 登場人物をニューラルネットワークとして考える
ここで、アリス、ボブ、イブの各登場人物をニューラルネットワークAlice,Bob,Eveとする。

* Aliceは平文Pと秘密鍵Kを入力として受け取り暗号文Cを出力する
* Bobは暗号文Cと秘密鍵Kを入力として受け取り複合文P<sub>Bob</sub>を出力する
* Eveは暗号文Cを入力として受け取り複合文P<sub>Eve</sub>を出力する

ここで注目するのが、暗号化の際に、特定の暗号アルゴリズムを指定して用いている訳ではないという点である。
既知のアルゴリズムを用いていないため、攻撃者もニューラルネットワークを構築して複合化を試みる。
また、攻撃者のニューラルネットワークEveは第三者的立場としての最善のモデルを使用することを仮定する。秘密鍵Kを平文Pごとに新しく作成するワンタイムパッド方式であり、KとPの長さが同じであることは強制されない。

## 定義

それぞれの目的は以下のようになる。

* アリスはボブに、第三者に知られないようにメッセージを送りたい
* ボブとイブは平文との誤りがより少なくなるように複合文を生成したい

それぞれのモデルのパラメータをθ<sub>A</sub>,θ<sub>B</sub>,θ<sub>E</sub>とすると
、

* Aliceの出力: A(θ<sub>A</sub>,P,K) = C
* Bobの出力: B(θ<sub>B</sub>,C,K)
* Eveの出力: E(θ<sub>E</sub>,P)

また、距離関数d(P,P') = Σ<sub>i=1,N</sub>|P<sub>i</sub> - P'</sub>i</sub>|とする。(Nは平文の長さ)。Eveについての誤差関数L<sub>E</sub>は、  
**L<sub>E</sub>(θ<sub>A</sub>,θ<sub>E</sub>,P,K) = d(P,E(θ<sub>E</sub>,A(θ<sub>A</sub>,P,K)))**  

Eveの目的関数O<sub>E</sub>は、  
**O<sub>E</sub>(θ<sub>A</sub>) = argmin<sub>θE</sub>(L<sub>E</sub>(θ
<sub>A</sub>,θ<sub>E</sub>))**  

同様に、Bobには例ごとの複合化誤差を定義し、平文と秘密鍵の分布に拡張する。  
**L<sub>B</sub>(θ<sub>A</sub>,θ<sub>B</sub>,P,K) = d(P,B(θ<sub>B</sub>,A(θ
<sub>A</sub>,P,K),K))**  
**L<sub>B</sub>(θ<sub>A</sub>,θ<sub>B</sub>) = iE<sub>P,K</sub>(d(P,B(θ
<sub>B</sub>,A(θ<sub>A</sub>,P,K),K)))**  

AliceとBobの誤差関数L<sub>AB</sub>は、  
**L<sub>AB</sub>(θ<sub>A</sub>,θ<sub>B</sub>) = L<sub>B</sub>(θ<sub>A</sub>,θ<sub>B</sub>) - L<sub>E</sub>(θ<sub>A</sub>,O<sub>E</sub>(θ<sub>A</sub>))**  

最後に、AliceとBobの目的関数O<sub>A</sub>,O<sub>B</sub>は、  
**(O<sub>A</sub>,O<sub>B</sub>) = argmin<sub>(θA,θB)</sub>(L<sub>AB</sub>(θ<sub>A</sub>,θ<sub>B</sub>))**

## 学習及びアーキテクチャ
学習はSGDに基づく。また、それぞれのモデルは個別に学習を行う。
* 全結合層を最初の層にもつ
* 全結合層の後に畳み込み層のシーケンスが続き、最終的に平文または暗号文に適した
  サイズの出力を生成する

Python(TensorFlow)による実装(一部抜粋)
```
def build_model(self):
        # Weights for fully connected layers
        self.w_alice = init_weights("alice_w", [2 * self.N, 2 * self.N])
        self.w_bob = init_weights("bob_w", [2 * self.N, 2 * self.N])
        self.w_eve1 = init_weights("eve_w1", [self.N, 2 * self.N])
        self.w_eve2 = init_weights("eve_w2", [2 * self.N, 2 * self.N])

        # Placeholder variables for Message and Key
        self.msg = tf.placeholder("float", [None, self.msg_len])
        self.key = tf.placeholder("float", [None, self.key_len])

        # Alice's network
        # FC layer -> Conv Layer (4 1-D convolutions)
        self.alice_input = tf.concat(concat_dim=1, values=[self.msg, self.key])
        self.alice_hidden = tf.nn.sigmoid(tf.matmul(self.alice_input, self.w_alice))
        self.alice_hidden = tf.expand_dims(self.alice_hidden, 2)
        self.alice_output = tf.squeeze(conv_layer(self.alice_hidden, "alice"))

        # Bob's network
        # FC layer -> Conv Layer (4 1-D convolutions)
        self.bob_input = tf.concat(concat_dim=1, values=[self.alice_output, self.key])
        self.bob_hidden = tf.nn.sigmoid(tf.matmul(self.bob_input, self.w_bob))
        self.bob_hidden = tf.expand_dims(self.bob_hidden, 2)
        self.bob_output = tf.squeeze(conv_layer(self.bob_hidden, "bob"))

        # Eve's network
        # FC layer -> FC layer -> Conv Layer (4 1-D convolutions)
        self.eve_input = self.alice_output
        self.eve_hidden1 = tf.nn.sigmoid(tf.matmul(self.eve_input, self.w_eve1))
        self.eve_hidden2 = tf.nn.sigmoid(tf.matmul(self.eve_hidden1, self.w_eve2))
        self.eve_hidden2 = tf.expand_dims(self.eve_hidden2, 2)
        self.eve_output = tf.squeeze(conv_layer(self.eve_hidden2, "eve"))

 def train(self):
        # Loss Functions
        self.decrypt_err_eve = tf.reduce_mean(tf.abs(self.msg - self.eve_output))
        self.decrypt_err_bob = tf.reduce_mean(tf.abs(self.msg - self.bob_output))
        self.loss_bob = self.decrypt_err_bob + (1. - self.decrypt_err_eve) ** 2.

        # Get training variables corresponding to each network
        self.t_vars = tf.trainable_variables()
        self.alice_or_bob_vars = [var for var in self.t_vars if 'alice_' in var.name or 'bob_' in var.name]
        self.eve_vars = [var for var in self.t_vars if 'eve_' in var.name]

        # Build the optimizers
        self.bob_optimizer = tf.train.AdamOptimizer(self.learning_rate).minimize(
            self.loss_bob, var_list=self.alice_or_bob_vars)
        self.eve_optimizer = tf.train.AdamOptimizer(self.learning_rate).minimize(
            self.decrypt_err_eve, var_list=self.eve_vars)

        self.bob_errors, self.eve_errors = [], []

        # Begin Training
        tf.initialize_all_variables().run()
        for i in range(self.epochs):
            iterations = 2000

            print 'Training Alice and Bob, Epoch:', i + 1
            bob_loss, _ = self._train('bob', iterations)
            self.bob_errors.append(bob_loss)

            print 'Training Eve, Epoch:', i + 1
            _, eve_loss = self._train('eve', iterations)
            self.eve_errors.append(eve_loss)

        self.plot_errors()
```

[Google Brainによる論文](https://arxiv.org/pdf/1610.06918.pdf)
