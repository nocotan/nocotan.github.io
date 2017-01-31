---
layout: post
title:  "enable_shared_from_this"
date:   2017-01-31 03:00:00
categories: アルゴリズム
---

クラスにおいて,thisへのshared_ptr<T>を扱うためのもの。
thisポインタをshared_ptr<T>(this)とすると、参照カウントが増えず、所有権管理が機能しなくなる。
enable_shared_from_thisを、テンプレート引数に扱いたいクラスを指定して継承することによって、
shared_from_this()が使用できるようになる。C++11以降で対応。

#### コード例

```c++
struct X : public std::enabled_shared_from_this<X> {
        void f() {
                return this->shared_from_this();
        }
};
```
