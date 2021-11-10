# High Order Function

一句話 : 將方法的 **格式** 視為一種類別

## 方法的格式

方法的參數型別組合加上回傳值的型別組合為方法的 **格式**

例如 :

`fun plus(x:Int,y:Int):Int = x + y`

就是一個輸入兩個 Int 並回傳一個 Int 類型的方法

而 **輸入兩個 Int 並回傳一個 Int** 就是此方法的型別

所以上述的加法和以下的減法都屬於同一種型別

`fun minus(x:Int, y:Int):Int = x - y`

如果方法的格式可以被視為一種類別，那類別可以怎樣被使用，方法也可以那樣使用

> 方法格式視為類別是在執行時期動態編譯

## 方法類別

語法 : 
- 宣告 : `(參數組合)->回傳值類型`
- 實體 : 關鍵字 `fun` 取代方法名稱，剩下如一般方法實現方法內容

```kotlin
var plus:(Int, Int)->Int = fun(x:Int, y:Int):Int {
  return x + y
}
```

## 方法參數

既然方法可以是一種類別，那就可以當作另一個方法的參數

```kotlin
fun apply100(f:(Int)->Int):Int {  
	return f(100)  
}  
  
fun main() {  
	val inc = fun(x:Int):Int = x+1  
	val dec = fun(x:Int):Int = x-1  
	println(apply100(inc)) // 101
	println(apply100(dec)) // 99
}
```

## 方法回傳

既然方法可以是一種類別，也能當作回傳值

回傳方法時，如果是該方法已經賦予給某個變數，則回傳該變數即可，如果是回傳方法 **實體**，那要使用方法參考子 `::` 來回傳

```kotlin
fun operation(op:String):(Int,Int)->Int {
	fun plus(x:Int, y:Int) = x + y
	val minus = fun(x:Int, y:Int) = x - y
	
	return if(op == "+") ::plus else minus 
	// plus 是方法實體，需使用 :: 回傳
	// minus 已經變數化，可以直接回傳
}

fun main() {
	val add = operation("+")  
	val subtract = operation("-")  
	println(add(1,2)) // 3
	println(subtract(4,3)) // 1
}
```

---

# 方法表達式

## lambda 表達式

- 回傳值就是最後一行的執行結果，不需要再寫 `return`
- 無法聲明回傳型別
- kotlin 支援自動執行 lambda，意思是可以同時宣告並呼叫
	```kotlin
	val result = {x:Int,y:Int -> x+y}(1,2) // 3
	```

語法 :

```
{ 參數列表 ->
	任意執行語句
}
```

範例 :

```kotlin
val sum = { x:Int, y:Int -> x + y }
```

等同於

```kotlin
val sum = fun(x:Int, y:Int):Int {
	return x + y
}
```

### 隱藏參數 `it`

如果 lambda 只包含一個參數，則參數聲明本身可以被省略，此時 lambda 會生成隱藏參數 `it` 可以讓內部方法本體使用

```kotlin
fun main() {
	val square:(Int)->Int = { it * it }
	println(square(5)) // 25
}
```

### 最末參數

如果方法的最後一個參數是方法類型，kotlin 允許用 lambda 表達式提取到參數列表的小括號之外

```kotlin
fun lastLambda(i:Int, lamb:(x:Int)->Int):Int = lamb(i)
  
fun main() {  
	val result = lastLambda(2) {  
		it*it  
	}  
	println(result) // 4
}
```


### lambda 中手動回傳值

lambda 表達式預設式回傳最後一行程式的執行結果，如果要手動回傳 (`return`)，因為在 "使用情境" 下，lambda 的上下文並不值觀，所以需要標明 **返回的作用域**

```kotlin
fun apply(list:List<Int>, lambda:(Int)->String) {  
	for (item in list) {  
		println("將 item:$item 當引數帶入 lambda:${lambda(item)}")  
	}
}  
  
fun main() {  
	apply(listOf(1,2,3)) {  
		if (it % 2 == 0) {  
			return@apply "偶數" //特別標註是 return@apply 這個作用域，而不是 main
		}  
		return@apply "奇數" //特別標註是 return@apply 這個作用域，而不是 main
	}  
	/**
	將 item:1 當引數帶入 lambda:奇數
	將 item:2 當引數帶入 lambda:偶數
	將 item:3 當引數帶入 lambda:奇數
	*/
}
```

---

# 再談內嵌方法

## 不參與內嵌的參數

內嵌方法中，如果該方法有方法類型參數，但是 **不希望該參數被內嵌到使用的地方**，希望該方法能夠獨立出來，可以使用修飾子 `noinline`

```kotlin
inline fun apply(list:List<Int>, noinline lambda:(Int)->String){
}
```

## 返回

因為內嵌方法會將整個方法本體覆蓋到呼叫的地方

這時候如果方法本體內有 `return` 的關鍵字，那呼叫的主程式將會被返回

```kotlin
inline fun apply(list:List<Int>, lambda:(Int)->String) {  
	for (item in list) {  
		println("將 item:$item 當引數帶入 lambda:${lambda(item)}")  
	}
}  
  
fun main() {  
	apply(listOf(1,2,3)) {  
		if (it % 2 == 0) {  
			println("偶數")
			return
		}
		println("奇數")
		return
	}  
	/**
	"奇數"
	*/
}
```

第一次進入 lambda 的時候印出 "奇數" 後就直接把 main 返回了
如果不希望有這種誤用發生
可以用 `crossinline` 來修飾方法類型變數，這樣就不允許再方法本體內撰寫 `return` 關鍵字，編譯器會值報錯

```kotlin
inline fun apply(list:List<Int>, crollinline lambda:(Int)->String) {  
	for (item in list) {  
		println("將 item:$item 當引數帶入 lambda:${lambda(item)}")  
	}
}  

fun main() {  
	apply(listOf(1,2,3)) {  
		if (it % 2 == 0) {  
			println("偶數")
			return // <-- 報錯! 'return' is not allowed here
		}
		println("奇數")
		return // <-- 報錯! 'return' is not allowed here
	}
}
```

---

# 遞迴轉迴圈

有些方法會以自己遞迴呼叫自己的方法撰寫
有些時候這種情況會造成效能上的消耗
kotlin 可以自動將這種方法轉換為迴圈呼叫的方式
開發者可以不用自己去轉換

修飾子 : `tailrec`

```kotlin
tailrec fun factorial(n:Int, result:int = 1):Int {
	if (n == 1) {
		return result	
	}
	return factorial(n-1, result*n)
}
```

並不是所有遞迴呼叫 kotlin 都能自動轉換成迴圈呼叫，需要滿足以下條件

- 方法最後一個宣告 **若且唯若** 是呼叫該方法
- 上述宣告除了呼叫方法以外不能出現其他運算符號，即上述範例中最後一行如果是 `return factorial(n-1, result*n) * 1` 就不行，不行了話表示 `tailrec` 失敗，方法還是保持遞迴呼叫

---

# 集合內建 lambda 方法

## map()

結構 : `map(transform:(T)->R):List<R>`

將一個 T 型別集合內的元素帶入 transform 操作後回傳 R 型別的回傳值並把結果集合成 List

```kotlin
val numbers = intArrayOf(1,2,3,4,5)
val squares = numbers.map { it * it } // 1, 4, 9, 16, 25
```

## flatMap()

結構 : `flatMap(transform:(T)->Iterable<R>):List<R>`

將一個以上 T 型別集合中的元素一起做 transform 操作最終集合成一個 R 型別的 List

```kotlin
val numbers1 = listOf(1,2,3,4,5,6)
val numbers2 = listOf(10,20,30)

listOf(numbers1, numbers2).flatMap { it + 1 } // 2,3,4,5,6,7,11,21,31
```

如果只是要把多個同型別集合平拍在一起，沒有要另外操作，可以使用 `flatten`

```kotlin
listOf(numbers1,numbers2).flatten() // 1,2,3,4,5,6,10,20,30
```

## zip()

結構 : `zip(other:Array<out R>):List<Pair<T,R>>`

連接兩個集合中的數據
以一對一的方式進行組合成 Pair
並將 Pair 物件集合成 List
最終結果會取決於長度較短的那個集合

```kotlin
val numbers1 = listOf(1,2,3,4,5,6)
val numbers2 = listOf(10,20,30)
println(numbers1.zip(numbers2)) // [(1, 10), (2, 20), (3, 30)]
```

## reduce()

結構 : `reduce(operation:(acc:S,T)->S):S`

對集合中元素做累計操作
累計初始元素為集合中第一個元素
每一次將計算結果再次帶入 `acc` 參數並以此跌代值到最後一個元素

```kotlin
listOf(1,2,3,4,5,6).reduce { acc, n -> acc - n } 
//初始 acc=1, n=2 並將 1-2 的結果帶到下一輪的 acc
// 1-2-3-4-5-6 = -19

listOf(1,2,3,4,5,6).reduce { acc, n -> acc + n } // 1+2+3+4+5+6=21
```

## filter()

結構 : `filter(predicate:(T)->Boolean)List<T>`

對集合中元素做過濾，最終集合只會有經過 `predicate` 運算後回傳 `true` 的元素

```kotlin
listOf(1,2,3,4,5).filter { it % 2 == 0 } // [2,4]
```

## forEach()

結構 : `forEach(action:(T)->Unit):Unit`

對集合元素進行輪巡操作

```kotlin
listOf(1,2,3,4,5).forEach { print("$it->") } //1->2->3->4->5->
```

## partition()

結構 : `partition(predicate:(T)->Boolean):Pair<List<T>,List<T>>`

將資料依照 `predicate` 回傳 `true` 和 `false` 分成兩群，並收集到一個 Pair 物件中

Pair 第一個元素表示 `predicate` 回傳 `true` 的元素集合 List
Pair 第一個元素表示 `predicate` 回傳 `false` 的元素集合 List

```kotlin
val c = listOf(1,2,3,4,5).partition { it % 2 == 0 } // ([2, 4], [1, 3, 5])
```