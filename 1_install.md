# 讀音

"咖林"

<iframe width="560" height="315" src="https://www.youtube.com/embed/uE-1oF9PyiY?start=9&end=12&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 安裝

IntelliJ IDEA 預設就有內建 Kotlin 編譯器

~~所以裝 IntelliJ IDEA 就好~~

Kotlin 官方提供 unix like 系統的簡易安裝方法

在 windows 上可以用 WSL2 來進行

[Kotlin Compiler Install](https://kotlinlang.org/docs/command-line.html#sdkman)

# 哈囉! 世界!

先來一個簡單的哈囉世界吧

- 建立一個 ooxx.kt 的檔案
- ```kotlin
  fun main() {
    println("Hello, World")
  }
   ```
- 執行編譯 : `kotlinc ooxx.kt`
- 編譯後會發現生出一個 `OoxxKt.class` 的檔案
- 執行 : `kotlin OoxxKt` -> "Hello, World"