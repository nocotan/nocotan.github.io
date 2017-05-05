---
layout: post
title:  "C++テンプレートメタプログラミング"
date:   2017-05-05 10:00:00
categories: C/C++
---
メタプログラミングとは、他のプログラム(もしくは自身)を操作、出力するようなプロ
グラムを記述するプログラミング手法。また、処理のうちの一部をコンパイル時に行う
ようなコードを記述することである。このメタプログラミングの技法のうち、コンパイ
ラがテンプレートを使用して一時コードを生成し、そうして生成されたコードを他のソ
ースコードと共にコンパイルする方式をテンプレートメタプログラミングという。加え
て、テンプレートメタプログラミングはチューリング完全である。

### テンプレートメタプログラミングの利点と欠点

#### 利点
* コンパイル時に処理されるため、実行コードが最適化される
* エラーが実行時まで残らない

#### 欠点
* コンパイルに時間がかかる
* エラーメッセージが難解
* 一般にソースコードが元の言語のものと異なるため、可読性が落ちる

### テンプレートメタプログラミングの例

#### STLコンテナののサイズを取得する

```cpp
template<typename T>
size_t size_(const T& c) {
    return c.size();
}
```

#### フィボナッチ数列
テンプレートの部分特殊化を利用したコード。テンプレートの部分特殊化(Partial
template specialization)とは、特定の実引数が渡された時、元々のテンプレートの定
義とは異なった動作をさせる機構である。

```cpp
template<size_t N>
struct fibonacci : integral_constant<size_t, fibonacci<N-1>{} + fibonacci<N-2>{}> {};

template<> struct fibonacci<1> : integral_constant<size_t,1> {};
template<> struct fibonacci<0> : integral_constant<size_t,0> {};
```

#### 型の修飾

```cpp
template<typename T>
struct add_ptr {
    typedef T* type;
};
```

#### ifメタ関数

```cpp
template <bool, class L, class R>
struct IF {
    typedef R type;
};

template <class L, class R>
struct IF<true, L, R> {
    typedef L type;
};

IF<false, int, long>::type i; // long
IF<true,  int, long>::type i; // int
```

#### 高階メタ関数

```cpp
template<typename F, int N>
struct twice {
    static const int value =
        F::template apply<F::template apply<N>::value>::value;
};

struct div {
    template<int N>
    struct apply {
        static const int value = N/2;
    };
};
```

### Boost.MPL
[Boost.MPL](http://www.boost.org/doc/libs/1_63_0/libs/mpl/doc/index.html)  
Boost.MPLはコンパイル時の汎用メタプログラミング・フレームワーク。
