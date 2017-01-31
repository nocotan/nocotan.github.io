---
layout: post
title:  "最短経路問題(ダイクストラ法)"
date:   2017-01-26 03:00:00
categories: アルゴリズム
---

* ベルマンフォード法よりも高速
* 負の経路がある場合はうまく計算されないため使えない
* [ベルマンフォード法](http://nocotan.github.io/%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0/2017/01/24/bellmanford-copy.html)

手順としては、

1. 最短経路が確定した頂点と隣接している頂点を更新する
2. 1で使った頂点はもう使わない

初期状態では、始点のみの最短経路が確定している。
ここで、負の経路がないことを想定すると、まだ使われていない頂点のうち、d[i]が最小の頂点も、最短経路が確定している。  
また、値の挿入と最小値の取り出しを高速化するためにデータ構造にヒープを用いる。
これで、全体の計算量はO(E log N)となる。以下C++実装。

```c++
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

#define INF 1e+9
#define MAX_V 10

struct edge {
    int to;
    int cost;
};

// <最短距離, 頂点の番号>
using P = pair<int, int>;

int V;
vector<edge> G[MAX_V];
int d[MAX_V];

void dijkstra(int s) {
    priority_queue<P, vector<P>, greater<P> > que;
    fill(d, d+V, INF);
    d[s] = 0;
    que.push(P(0, s));

    while (!que.empty()) {
        P p = que.top();
        que.pop();
        int v = p.second;
        if (d[v] < p.first) continue;

        for (int i=0; i<G[v].size(); ++i) {
            edge e = G[v][i];
            if (d[e.to] > d[v] + e.cost) {
                d[e.to] = d[v] + e.cost;
                que.push(P(d[e.to], e.to));
            }
        }
    }
}

int main() {
    cin >> V;
    int E;
    cin >> E;
    for (int i=0; i<E; ++i) {
        int a, b, c;
        cin >> a >> b >> c;
        edge e = {b, c};
        G[a].push_back(e);
    }
    dijkstra(0);
    for (int i=0; i<V; ++i) {
        if(d[i] != INF)
            cout << "0から" << i << "までのコスト: " << d[i] << endl;
    }
}
```
