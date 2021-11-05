# 套件 (Package)

## 預設導入的套件

- `kotlin.*`
- `kotlin.annotation.*`
- `kotlin.collections.*`
- `kotlin.comparisons.*`
- `kotlin.io.*`
- `kotlin.ranges.*`
- `kotlin.sequences.*`
- `kotlin.text.*`

不同平台可能會額外導入其他的套件

- JVM : `java.lang.*`、`kotlin.jvm.*`
- JS : `kotlin.js.*`

## 修改套件名稱

可以使用 `as` 來修改套件在本地端的名稱

```kotlin
val bar = foo.Bar()
```

等同於

```kotlin
import foo.Bar
val bar = Bar()
```

等同於

```kotlin
import foo.Bar as FooBar
val bar = FooBar()
```

---

# 存取修飾子

用於類別、介面、建構子、方法、屬性

- `public` : 預設，可省略，被修飾的對象全域可存取
- `private` : 被修飾的對象只能在類別內部存取
- `protected` : 被修飾的對象只能在類別內部或者子類別中存取
- `internal` : 被修飾的對象只有在類別所在的 "模組" 中可存取

> ## Kotlin 模組
> 模組是一個編譯單元，表示放在一起編譯的原始碼，一般來說，實際項目打包輸出的 jar 檔就算是一個模組

## 建構子上的存取修飾子

預設建構子的存取修飾子是 `public`

> 只要能存取到該類別就能建構該類別的物件

如果要修改建構子的預設存取級別，則要使用 `constructor` 關鍵字 (預設省略) 來宣告主建構子

```kotlin
class A private constructor(desc:String) {}
```

這種情況下可以使用伴生實例來創建類別物件

```kotlin
class A private constructor(desc:String) {
	private constructor():this("default")
	companion object {
		fun create():A = A()
	}
}

fun main() {
	val a:A = A.create()
}
```


## 類別上的存取修飾子

在類別成員上的存取修飾子是具有 **傳遞性** 的，意思是如果被覆寫的成員用 `xxx(public/protected/private/internal)` 修飾，則覆寫後的成員預設也是由 `xxx` 修飾

# 其他修飾子

## open / final

`open` 和 `final` 是互斥的修飾子

- `open` 修飾類別表示該類別可以被繼承，`final` 修飾類別表示該類別不可以被繼承，具體類別預設是 `final`，抽象類別預設是 `open`
- `final` 不可使用在介面上，介面預設是 `open`，所以也不需要多寫 `open`
- `open` 修飾方法或屬性表示該方法或屬性可以被覆寫，`final` 修飾方法或屬性表示該方法或屬性不能被覆寫，預設方法或屬性都是 `final`，而抽象方法或屬性預設是 `open`

## override

只能用於子類別覆寫父類別的方法或屬性上，只能覆寫 `open` 的成員