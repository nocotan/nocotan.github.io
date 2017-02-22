---
layout: post
title:  "std::shared_mutex"
date:   2017-02-21 01:00:00
categories: C/C++
---

C++14以降で使用可能。
shared_mutexは、共有データが複数のスレッドによって同時にアクセスされるのを防ぐための
ミューテックスクラスを提供する。排他アクセスを容易にする他のミューテクス型とは異なり、
shared_mutexには二つのアクセスレベルがある。

* shared: 複数のスレッドが同じmutexの所有権を共有できる
* exclusive: 一つのスレッドだけがmutexを所有できる

共有ミューテクスは、通常複数の読み取り手が同時にデータの競合を起こすことなく同じリソースに
アクセスできる状況で使用されるが、単一の書き込み手のみアクセスを許される。

```c++
#include <iostream>
#include <shared_mutex>
using namespace std;


class X {
    private:
        mutable shared_timed_mutex mut;
        int val = 0;

    public:
        int get() const {
            shared_lock<shared_timed_mutex> lock(this->mut);
            return this->val;
        }
};

int main() {
    X x;
    int val = x.get();
    cout << val << endl;
}
```
