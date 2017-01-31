---
layout: post
title:  "最短経路問題(ワーシャルフロイド法)"
date:   2017-01-26 03:00:00
categories: アルゴリズム
---

最短経路問題のうち、すべての二頂点間の最短路を求める問題を全点間最短経路問題という。
ワーシャルフロイドは、全ノードの最短経路をO(N^3)で計算できる。

* i: 接続元ノード
* j: 接続先ノード
* k: 中韓ノード

とした時、i-->jのコストと、i-->k-->jのコストを全パターン比較し、最小となるものを記録していく。

```c++
#include <iostream>
using namespace std;

#define MAX_V 10
#define INF 1e+9

int d[MAX_V][MAX_V];
int V;

void warshall_floyd() {
    for (int k=0; k<V; k++) {
        for (int i=0; i<V; i++) {
            for (int j=0; j<V; j++)
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
        }
    }
}

int main() {
    int E;
    cin >> V >> E;
    for(int i=0; i<V; ++i) {
        for(int j=0; j<V; ++j) {
            if(i==j) d[i][j] = 0;
            else d[i][j] = INF;
        }
    }

    for(int i=0; i<E; ++i) {
        int a, b, c;
        cin >> a >> b >> c;
        d[a][b] = c;
        d[b][a] = c;
    }

    warshall_floyd();

    for(int i=0; i<V; ++i)
        for(int j=0; j<V; ++j)
            if(i!=j&&d[i][j]!=INF)
                cout << i << "から" << j << "へのコスト: " << d[i][j] << endl;

    return 0;
}
```
