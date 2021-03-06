---
layout: post
title:  "Triple DES"
date:   2017-02-25 01:00:00
categories: 暗号
---
トリプルDES(Triple DES)は暗号アルゴリズムのうちの一つ。
正式名称はTriple Data Encryption Algorithm。
共通鍵ブロック暗号であるDESを三回施すアルゴリズム。

## DES(Data Encryption Standard)
平文を64ビット単位のブロックに分割して暗号化及び復号化を行う暗号アルゴリズム。
(64ビットのうち8ビットをパリティチェックに使用するため鍵長は56ビット)。
16ラウンドのうち、最初と最後に並び替え処理を置く。(IP/FP)。
Feistel構造を使い、各ラウンドでの処理の前に、ブロックは32ビットずつに分割され、それらに対して異なる処理を施していく。
処理の流れは以下のようになる。

1. 初期転置(IP)
2. 転置
3. シフト演算
4. ラウンド
5. 上記ラウンドを16回繰り返す
6. 最終転置(FP)

```c++
void des_decrypt(char* input, char* key, char* output){
	char subkeys[NUM_ROUNDS][SUBKEY_SIZE], temp[BLOCK_SIZE], temp2[BLOCK_SIZE];
	char rev_subkeys[NUM_ROUNDS][SUBKEY_SIZE];
	int i, j;

	key_sched(key, subkeys);

	for(i = 0, j = NUM_ROUNDS - 1; i < NUM_ROUNDS; i++, j--){
		memcpy(rev_subkeys[j], subkeys[i], SUBKEY_SIZE);
	}

	initial_permutation(input, temp);
	feistel_encrypt(temp, des_round, rev_subkeys, temp2);
	final_permutation(temp2, output);
}
```

## Triple DES(Triple Data Encryption Algorithm)
DESを三回施すアルゴリズムであるが、単に平文に暗号化を繰り返すのではなく、処理の流れは以下のようになる。

### 暗号化
Triple DESは8バイトDES暗号鍵を三つ用いて8バイトデータを復号化する。
* 最初の鍵を使用して、データを暗号化する
* 2番目の鍵を使用して、上記で得られた結果を復号する
* 3番目の鍵を使用して、上記で得られた結果を暗号化する

### 復号化
復号化は、暗号化の手順の逆をたどる
* 3番目の鍵を使用してデータを復号化する
* 2番目の鍵を使用して、上記で得られた結果を暗号化する
* 最初の鍵を使用して、上記で得られた結果を復号化する

### Keying options
三つの鍵(k1, k2, k3)の組み合わせとして、以下の三種類が存在する

#### k1,k2,k3が全て異なる
通称3TDEA, 3-Key。鍵長は168ビット。

#### k1,k2が異なり、k3とk1が同じ
中間一致攻撃(Meet-in-the-middle Attack)への耐性がある。鍵長は112ビット。

#### k1,k2,k3が全て同じ
DESと同一の結果が得られる。鍵長は56ビット。

### 鍵強度
Triple DESは168ビットの鍵長を持っているが、実際の鍵強度は112ビットとなる。
これは既知の攻撃手法である中間一致攻撃が存在するためである。
中間一致攻撃とは、攻撃者が平文と暗号文を持っている場合、任意の暗号鍵x平文の暗号化結果と任意の暗号鍵x暗号文の復号結果を使い、鍵を特定するという攻撃手法である。
ちなみに112ビットの鍵強度を持つ暗号の解読時間は約30兆年とされている。
