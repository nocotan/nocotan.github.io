---
layout: post
title:  "図書館ソート(Library sort)"
date:   2017-01-25 03:00:00
categories: アルゴリズム
---

挿入ソートの亜種。配列の要素間に隙間を設けて、挿入操作の高速化をしている。

> 司書が長い本棚にアルファベット順に本を陳列しようとしているとする。本棚は左端がAで始まり、右端のZの終わりまで隙間なく本で埋まっている。司書が新しい本をBの区画に収めるには、Bの区画に適切な位置を見つけ、スペースを空けるために後ろのすべての本をずらす必要がある。これが挿入ソートである。しかし、各区画の間(BとCの境界など)に空白があったなら、新しい本のためにずらすべき本の数は少なくて済む。これが図書館ソートの基本的な原理である。
[Wikipedia](https://ja.wikipedia.org/wiki/%E5%9B%B3%E6%9B%B8%E9%A4%A8%E3%82%BD%E3%83%BC%E3%83%88)

元の論文は[こちら](https://arxiv.org/abs/cs/0407003)  
挿入ソートでは挿入にO(n)かかるため、全体の計算量はO(n^2)である。現実世界で、物と物の間に隙間があると並びかえやすいように、このアルゴリズムでは隙間を設けて高速化をしている。
論文では、高確率でクイックソートと同水準であるO(n log n)で実行可能なことが示されている。  
以下C++の実装.

```c++
#include <iostream>
#include <cmath>
using namespace std;

#define MAX 10000
#define MAX2 20000

#define NONE -1

bool isempty(int e) {
    return e < 0;
}

void prepareLibrarySort(int epsilon, int n, int S[MAX2], int* sLen) {
    int i;
    *sLen = (1+epsilon)*n;
    for(i=0;i<*sLen;i++) S[i] = NONE;
}

int searchFree(int e, int sorted[MAX2], int last) {
    int first = 0;
    int middle;

    while(last>=0 && isempty(sorted[last])) last --;
    while(first<=last && isempty(sorted[first])) first ++;
    while(first<=last) {
        middle = (first+last)/2;
        if(isempty(sorted[middle])) {
            int tmp = middle + 1;
            while(tmp<last && isempty(sorted[tmp])) tmp ++;
            if(sorted[tmp]>e) {
                tmp = middle - 1;
                while(middle>first && isempty(sorted[middle])) middle --;
                if(sorted[middle]<e)
                    return middle;
                last = middle - 1;
            } else first = tmp + 1;
        } else if(sorted[middle]<e) {
            first = middle + 1;
        } else {
            last = middle - 1;
        }
    }
    if(last>=0 && isempty(sorted[last])) last --;
    return last;
}

void libSort(int A[MAX], int N, int S[MAX2], int EPSILON) {
    if(N==0) return;
    int j, k, step;
    int goal = 1;
    int pos = 1;

    S[0] = A[0];

    int sLen = max((1+EPSILON), goal + 1);

    while(pos<N) {
        for(j=0;j<goal;j++) {
            int insPos = searchFree(A[pos], S, sLen-1);

            insPos ++;
            if(!isempty(S[insPos])) {
                int nextFree = insPos + 1;
                while(!isempty(S[nextFree])) nextFree ++;
                if(nextFree>=sLen) {
                    insPos --;
                    if(!isempty(S[insPos])) {
                        nextFree = insPos - 1;
                        while(!isempty(S[nextFree])) nextFree --;
                        while(nextFree<insPos) {
                            S[nextFree] = S[nextFree+1];
                            nextFree ++;
                        }
                    }
                } else {
                    while(nextFree>insPos) {
                        S[nextFree] = S[nextFree-1];
                        nextFree --;
                    }
                }
            } else if(insPos>=sLen) {
                insPos --;
                int nextFree = insPos - 1;
                while(!isempty(S[nextFree])) nextFree --;
                while(nextFree<insPos) {
                    S[nextFree] = S[nextFree+1];
                    nextFree ++;
                }
            }

            S[insPos] = A[pos ++];

            if(pos>=N)
                return;
        }

        for(j=sLen-1, k=min(goal*(2+2*EPSILON), (1+EPSILON)*N)-1,
                step=(k+1)/(j+1);j>=0;j--, k-=step) {
            S[k] = S[j];
            S[j] = NONE;
        }

        sLen = min(goal*(2+2*EPSILON), N*(1+EPSILON));
        goal <<= 1;
    }
}

void librarySort(int A[MAX], int n) {
    int epsilon = 1;
    int S[MAX2];
    int sLen, i, j;

    prepareLibrarySort(epsilon, n, S, &sLen);
    libSort(A, n, S, epsilon);
    for(i=0, j=0;i<sLen && j<n;i++)
        if(!isempty(S[i])) A[j++] = S[i];
}

int main() {
    int A[MAX];
    A[0] = 6;
    A[1] = 4;
    A[2] = 2;
    A[3] = 5;
    A[4] = 1;

    librarySort(A, 5);
    for (int i=0; i<5; ++i) cout << A[i];
    cout << endl;
}
```
