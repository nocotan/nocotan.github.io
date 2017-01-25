---
layout: post
title:  "最短経路問題(ベルマンフォード法)"
date:   2017-01-24 01:00:00
categories: アルゴリズム
---

最短経路問題のうち始点を固定した時に、
他のすべての頂点との間の最短路を求める問題を単一始点最短経路問題と言う。  
頂点i, jについて、  

**d[i] = min(d[j]+(jからiへのコスト))**  

と定義する。初期化はd[0]=0,d[i]=INFとする。グラフが有効グラフで閉路を持たないDAG(Directed
Acyclic Graph)であるならば、頂点を順序付けることができるため、dを更新していくことができる。  
辺e, 頂点i, jについて、  
i ----e----> j  
の時、それまでに計算してあるd[j]よりもd[i]+eのコストが小さければd[j]を更新できる。グラフに負のコストの閉路が存在しなければ最短路は同じ頂点を通らないので計算量はO(|V||E|)。
以下C++のコード。


```c++
#include <iostream>
using namespace std;

#define INF 1e+9
#define MAX_E 50
#define MAX_V 10

struct edge {
    int from;
    int to;
    int cost;
};

edge es[MAX_E];
int d[MAX_V];
int  V, E;

void solve(int s) {
    for (int i=0; i<V; ++i) d[i] = INF;
    d[s] = 0;
    while(true) {
        bool update = false;
        for (int i=0; i<E; ++i) {
            edge e = es[i];
            if (d[e.from] != INF && d[e.to] >d[e.from] + e.cost) {
                d[e.to] = d[e.from] + e.cost;
                update = true;
            }
        }
        if (!update) break;
    }
}

int main() {
    cin >> V >> E;
    for(int i=0; i<E; ++i) {
        int from, to, cost;
        cin >> from >> to >> cost;
        es[i] = edge{from,to,cost};
    }
    solve(0);
    for(int i=0; i<V; ++i) {
        if (d[i] != INF)
            cout << "0から" << i << "までのコスト: " << d[i] << endl;
    }
}
```
