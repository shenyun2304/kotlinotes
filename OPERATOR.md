# 一元操作符

##### 正負操作子 

|符號|等價方法|
|:--:|:--:|
|`+`|`unaryPlus()`|
|`-`|`unaryMinus()`|

```kotlin
var a = 10
var b = -a // b = -10
var c = a.unaryMinus() // c = -10
```

##### 遞增抵減操作子

|符號|等價方法|
|:--:|:--:|
| `++`|`inc()`|
|`--`|`dec()`|

##### 否定操作子

|符號|等價方法|
|:--:|:--:|
|`!`|`not()`|

---

# 二元操作子

##### 四則運算

|符號|等價方法|
|:--:|:--:|
|`+`|`plus()`|
|`-`|`minus()`|
|`*`|`times()`|
|`/`|`div()`|
|`%`|`rem()`|

##### 複合操作子

|符號|等價方法|
|:--:|:--:|
|`+=`|`plusAssign()`|
|`-=`|`minusAssign()`|
|`*=`|`timesAssign()`|
|`/=`|`divAssign()`|
|`%=`|`remAssign()`|

##### 比較操作子

|符號|等價方法|
|:--:|:--:|
|`>`|`compareTo()`|
|`<`|`compareTo()`|
|`>=`|`compareTo()`|
|`<=`|`compareTo()`|

> 等價方法 : `compareTo()`
>	- 左大於右 : 返回大於 0
>	- 右大於左 : 返回小於 0
>	- 左右相等 : 返回等於 0

##### 位元運算子

> kotlin 中沒有位元運算子的符號，只提供等價方法

|符號|等價方法|說明|
|:--:|:--:|:--|
|`&`|`and()`|交集|
|`｜`|`or()`|聯集|
|`!`|`inv()`|反向|
|`^`|`xor()`|邏輯互斥或|
|`<`|`shl()`|左移位元|
|`>`|`shr()`|右移位元|
|`>>`|`ushr()`|保持最左方位元(正負號)不變，其餘位元右移|

### 包含操作子

關鍵字 : `in` 

判斷左方目標是否包含於右方目標，`a in b` 類似 java 中的 `b.contains(a)`

不包含符號 : `!in`

### 內容相等(等同)

關鍵字 : `==` 

相當於 java 中的 `equals` 方法，比較兩個目標內容是否相同

不等同符號 : `!=`


### 參考相等(等於)

關鍵字 : `===` 

相當於 java 中的 `==` 運算，比較兩個目標是否指向同一個參考對象

不等於符號 : `!==`

---

# 貓王操作子

關鍵字 : `?:`

當第一個目標為空值時，**執行** 第二個目標

第二個目標可以是回傳值，也可以是一段可執行程式

語法 : 第一目標 `?:` 第二目標

可以做連鎖空值表達式

> ```kotlin
> var a:String = null ?: null ?: null ?: null ?: "hi I'm a"
> ```
> 結果 `a = "hi I'm a"`

---

# 索引操作子

符號 `[]` 可以對集合型別存取部分數據

取值 : `a[index]` -> 相當於 getter 方法
賦值 : `a[index] = x` -> 相當於 setter 方法

---

# 區間操作子

符號 `..` 可以創建區間物件，相當於第一個目標呼叫 `rangeTo()` 方法

```kotlin
var range = 1..3 // [1,2,3]
var range2 = 1.rangTo(3) // [1,2,3]
```

---

# 覆寫預設操作子

kotlin 允許覆寫預設操作子的行為，當然也能為自定義的類別撰寫特殊的操作子行為

例如使用 `+` 符號實現 黃色 + 藍色 = 綠色 的範例

```kotlin
class Blue {
	operator fun plus(y: Yellow):Green = Green()
}
class Yellow {
	operator fun plus(b:Blue):Green = Green()
}
class Green

fun main() {
	val blue:Blue = Blue()
	val yellow:Yellow = Yellow()
	val green = blue + yellow // Green 型別物件
}
```