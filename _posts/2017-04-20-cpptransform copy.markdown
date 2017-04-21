---
layout: post
title:  "no matching function for call to transform"
date:   2017-04-16 01:00:00
categories: C/C++
---

以下のようなコードを書いた時に発生する。

```c++
#include <iostream>
#include <algorithm>

int main() {
    std::string s="Hello";
    std::transform(s.begin(), s.end(), s.begin(), std::toupper);
}
```

そもそもtoupperはstd名前空間で定義されたものではなく、グローバル名前空間で定義されている。よって、以下のコードであれば正常に動作する。

```c++
#include <iostream>
#include <algorithm>

int main() {
    std::string s="Hello";
    std::transform(s.begin(), s.end(), s.begin(), ::toupper);
}
```

toupper及びtolowerに関しては、名前空間を解決する際に、別のオーバーロードされた関数toupeer、tolowerが存在する。これによって、引数にstd::toupeerを渡すことによって参照しているオーバーロードを解決できなくなる。
そのため、コンパイラはエラーメッセージに未解決のオーバーロードされた関数型を指定している。
