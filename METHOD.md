# 一般方法

宣告格式 : 

```
[存取範圍] fun [方法名稱](參數列表) [:回傳值類型] {
}
```

無返回值方法可以宣告回傳值類型為 `Unit` 或者就直接不需要宣告回傳值類型

## 多個回傳值

kotlin 預設有 Pair 與 Triple 類型，可以讓方法回傳兩個或三個回傳值

> 在 2012 年的時候，Kotlin 是有 Tuple 類型的，但在後面的版本移除了
> 官方解釋是有了 Pair 和 Triple 類型已經足夠了，如果回傳值數大於三個
> 那應該要建立一個類型當回傳類型

## 參數

> 在中文翻譯上，我們並不常去區別宣告和呼叫時的參數名詞上的差異，但其實這兩個是不同的
> 在宣告時的參數，大陸翻譯叫 "形式參數" 或 "型參"，台灣這邊就叫做 "參數"，英文是 parameter
> 在實際呼叫時帶入的值，大陸翻譯叫做 "實際參數" 或 "實參"，台灣這邊正式名稱叫做 "引數"，英文是 argument
> 例如
> ```kotlin
> fun Foo(i:Int, f:Float) {}
> Foo(1, 2.0)
> ```
> 其中 `i`、`f` 是 parameter，`1` 和 `2.0` 是 argument

### 命名參數

傳統方法呼叫參數對應是用 **位置對應** 來執行，意思是

```kotlin
fun greeting(name:String, word:String) {
	println("$word $name")
}
```

呼叫的時候是依照引數的 **位置** 來映射對應的變數

```kotlin
greeting("Peter", "Hello,")
```

這樣的呼叫 name 參數會對應 "Peter" 引數，word 參數會對應到 "Hello, " 引數

kotlin 提供命名參數的對應方式，依照參數的名字來實現參數與引數的對應

```kotlin
greeting(word = "Hello, ", name = "Peter")
```

> kotlin 也支援混合使用，條件是 **命名參數必須在位置參數之後**

### 動態數量參數

對於參數數量不確定時，稱為 **動態數量參數**，kotlin 中使用 `vararg` 關鍵字就可以將參數宣告為動態數量

```kotlin
fun sum(vararg n:Int) {
	var result = 0
	for (a in n) {
		result += a
	}
	return result
}
```

### 動態數量搭配命名參數
在 java 中如果要動態數量參數和一般參數混合使用，那動態參數一定要擺在最後宣告
在 kotlin 中因為有命名參數，可以無視位置的限制，使用上更彈性
```kotlin
fun sum(vararg n: Int, init:Int) {
  return n.sum() + init
}
sum(1,2,3, init = 5)
```

### 動態參數與陣列

當一個方法參數被宣告為動態參數時，我們傳入一個陣列當作引數，這時候 kotlin 會不知道要把這整個陣列當成 "一個參數"，還是要將這個陣列中的每一個元素當作 "動態參數" 來對應，意思是

```kotlin
fun get0(vararg n:Int) {
	println(n[0])
}

val arr = intArrayOf(1,2,3)

get0(arr) // <-- 這個結果會是 1, 還是 [1,2,3] ?
```

Kotlin 規定 : **陣列預設會作為動態參數的第一個元素來處理**

所以答案是 `[1,2,3]`?
錯! 答案是 `error: type mismatch: inferred tyep is IntArray but Int was expected`

因為宣告時參數為 Int 的變動參數，這時候因為預設將陣列當作動態參數的第一個元素，而 `arr` 的型別是 IntArray 不是 Int，所以型別錯誤!

如果要讓陣列對應動態變數的元素，在呼叫時，引數要標註星號 `*`，kotlin 會自動**解構**對應到動態變數中

```kotlin
get0(*arr) // 1
```

> 那如果把 get0 設計成 `get00(a:Int, b:Int, c:Int) {}` 然後呼叫 `get00(*arr)` 可以嗎?
> 答案是... 不行!!
> 因為 `*` 前綴只能給動態參數使用

### 參數預設值

kotlin 中宣告方法時可以用 `=` 給定參數預設值，有給定預設值的參數在呼叫時就變成可選填的引數，這在 java 中需要宣告方法多載才能實現

kotlin
```kotlin
fun greeting(name:String,word:String = "Hello, ") {
	println("$word $name")
}

greeting("Peter") // "Hello, Peter"
greeting("Peter", "Holy, ") // "Holy, Peter"
```

java 中的方法多載
```java
void greeting(String name, String word) {
	System.out.println(word + " " + name);
}
void greeting(String name) {
	greeting(name, "Hello, ");
}
```

---

# 方法表達式

方法可以配合 **表達式** 來使用，達成單行方法宣告

##  搭配 if 表達式

```kotlin
fun abs(x:Int):Int {
	if (x > 0) {
		return x
	} else {
		return -x
	}
}
```

單行宣告

```kotlin
fun abs(x:Int):Int = if (x > 0) x else -x
```

## 省略方法 body

1. 回傳成員
```kotlin
class SomeClass {
	var someProperty:Int = 100
	fun getProperty():Int = someProperty
}
```

2. 傳遞參數

```kotlin
class SomeClass {
	private fun print(msg:String) {
		println(msg)
	}
	fun doPrint(message:String) = print(message)
}

```

---

# 內嵌方法

關鍵字 : `inline`

將方法宣告為 `inline` 的影響是，該方法的內容會被覆蓋到呼叫的地方，也就是不會真的產生這個方法

原本是這樣 :

```kotlin
fun show(par:String) {
	println(par)
}

fun main() {
	show("hello")
}
```

改成這樣 :

```kotlin
inline fun show(par:String) {
	println(par)
}
```

編譯後會是這樣 :

```kotlin
fun main() {
  { // 直接把方法內容複製到呼叫的地方
    println("hello")
  }
}
```

這樣除了少一層 stack call 以外
原本 main 方法中的區域資訊都可以存取的到