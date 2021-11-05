# 內嵌類別 (Nested Class)

定義在類別內部的類別

完整的類別名稱為 "外部類別.內嵌類別"

內嵌類別是靜態存在的，只是邏輯上和外部類別存在一定關聯，但實際上內嵌類別和外部類別是獨立存在的，所以 **內嵌類別無法訪問外部類別的成員**


```kotlin
class Outer {
	val outerProperty:String = "外部類屬性"
	
	class Nested {
		val nestedProperty:String = "內嵌類屬性"
		
		fun printProperty() {
			// 無法訪問 outerProperty
			println(nestedProperty)
		}
	}
}

fun main() {
	val nested = Outer.Nested()
	nested.printProperty() // "內嵌類屬性"
}
```

---

# 內部類別 (Inner Class)

將類別做為另一個類別的成員

修飾子 : `inner`

**內部類別是外部類別的一個成員**，內部類別無法獨立存在，需要透過外部類別的物件才能創建
也因為這樣，所以 **內部類別可以訪問外部類別的屬性**


```kotlin
class Outer(private val name:String = "Outer") {
	inner class Inner {
		fun getOuterName() = name
	}
}

fun main() {
	val outer = Outer()
	val inner = outer.Inner() // 需要透過外部類別物件才能創建
	println(inner.getOuterName()) // "Outer"
}
```

---

# 單一實例 (Singleton)

kotlin 中叫做 "Object Declaration"

關鍵字 : `object`

這種類型的類別只會有單一實例，也就是設計模式中的 Singleton Pattern
此類別實例的創建過程是 thread-safe 的
因為此類別實例只會有一個，使用時 **像** 靜態類別呼叫就好，不需要在創建類別實例

```kotlin
object Singleton {
	private var num:Int = 0
	fun sequence():Int {
		num += 1
		return num
	}
}

fun main() {
	println(Singleton.sequence()) // 1
	println(Singleton.sequence()) // 2
	println(Singleton.sequence()) // 3
}
```

> 這種用法單純是 "像" 靜態方法呼叫而已，實際上差異很大，Kotlin 只是隱藏 Singleton Pattern 的執行過程並簡化呼叫而已
> 實際上在 Kotlin 語法中，**沒有靜態成員這種東西**

---

# 伴生實例 (Companion)
 
 在類別中的 **單一實例** 成員
 **一個類別只能有一個伴生實例**
 
 修飾子 : `companion`
 
 原理同 **單一實例** 類別，使用上加上了 `companion` 修飾子，就可以像呼叫類別靜態方法一樣的使用
 
 > 再次注意，Kotlin 中沒有靜態方法，沒有靜態方法，沒有靜態方法
 > 這裡說的只是 **使用上的類似**

```kotlin
class AlertDialog(var title:String, var message:String) {
	companion object LikeStatic {
		fun method() {}
	}
}

fun main() {
	AlertDialog.LikeStatic.method() // 通過伴生實例呼叫方法
	AlertDialog.method() // 省略伴生實例名稱，外部類別直接呼叫伴生實例的方法
}
```

companion object 不一定需要給名字，使用上就像 `static` 一樣

```kotlin
class AlertDialog(var title:String, var message:String) {
	companion object {
		fun method() {}
	}
}

fun main() {
	AlertDialog.method()
}
```


---

# 物件表達式 (Object Declaration)

類似創建匿名類別物件的方法

1. 使用 `object` 關鍵字

`object` 關鍵字是創建單一實例的方法，也能用來創建匿名類別的物件

```kotlin
fun main() {
	val obj = object {
		fun hello() = "Hello"
		var property = "Oops"
	}
	println("hello:${obj.hello()}, property:${obj.property}") 
	// "hello:hello, property:Oops"
}
```

2. 繼承或實現

```kotlin
interface Valuable {
	fun getPrice():Int
}
abstract class Item {
	abstract var group:String
}

fun main() {
	val obj = object : Item(), Valuable {  
		 override fun getPrice(): Int = 0  
		 override var group: String = "SomeGroup"  
	}
}
```

匿名物件存取範圍限制在 **本地作用域(`{}` 之中)** 或 **物件私有域** 之中

也就是說，在存取範圍內的程式，或者將匿名物件當作 `private` 方法回傳值的時候，是可以存取匿名物件中的屬性或者方法的

相對的，如果該匿名物件被當作 `public` 方法的回傳值，那在第 1. 種情況，回傳的型別會是 `Any`，而第 2. 種情況回傳的會是 `Item, Valuable` 的型別，只能使用父類別或介面的方法和屬性

```kotlin
open class Parent {
	var y:String = "y"
}
class Child {
	private fun privateMethod() = object : Parent() {
		val x:String = "x"
	}
	
	fun publicMethod() = object : Parent() {
		val x:String = "x"
	}
	
	fun test() {
		val priObj = privateMethod()
		println(priObj.x) // 可以存取匿名物件的屬性
		println(priObj.y) // 也可存取匿名物件父類別的屬性
		
		val pubObj = publicMethod()
		println(pubObj.y) // 只能存取到父類別的屬性
	}
}
```

使用上，匿名物件可以存取該作用域內定義的成員

```kotlin
fun test() {
	var x = 10
	var obj = object {
		var y = x * 10
	}
}
```

---

# 數據物件 (Data Object)

> 貧血模型 (Anemic Domain Model) 是一種除了 getter 和 setter 以外沒有別的方法的類別結構
> 在 Java 中常用的 JavaBean 就是一種典型的貧血模型
> 也類似 Lombok 中的 @Data 標註

Kotlin 中將類別宣告為 `data` 型類別，並有一些條件

- 主建構子至少需要一個屬性
- 主建構子只能包含屬性，不能包含參數 -> 一定要使用 `var` 或 `val` 修飾
- 類別宣告不能有 `abstract`、`open`、`sealed`、`inner` 修飾子
- 不可以覆寫 `copy()` 及 `componentN()` 方法

kotlin 會自動覆蓋以下方法 :

- `equals()` : 會自動比較屬性內容，而不是參考位置
- `hashCode()` : 雜湊值也會依照屬性內容計算
- `toString()` : 自動套用 `類別名稱(屬性名稱=屬性值)` 的文字模板
- `componentN()` : 自動產生依照建構順序的解構方法
- `copy()` : 淺層複製物件

### 注意細節

1. 基本上屬性都包含在主建構子中，如果希望某些屬性能夠被排除，那就得將屬性宣告在類別內部
	```kotlin
	data class SomeData(val name:String, val age:Int) {
		var size:Int = 0 // 會被排除計算
	}
	```
	
2. 如果手動實現了自動覆蓋的方法，或者父類別對這些方法宣告了 `final`，則不會覆蓋
3. 如果父類別中聲明了 final 的 componentN 解構方法，或者該方法的簽名與子類別不兼容，編譯器會直接報錯
4. 不能繼承有自定義 `copy()` 方法的父類別

---

# 列舉 (enum)

修飾子 : `enum`

星期範例 :

```kotlin
enum class WeekDay(val abbr:String) {
	Monday("Mon"), Tuesday("Tue"), Wednesday("Wed"), Thursday("Thu"),
	Friday("Fri"), Saturday("Sat"), Sunday("Sun");
	
	fun isWeekEnd():Boolean = this == Saturday && this == Sunday
}
```

> # 重要!
> 如果在列舉值之下還有其他部分程式，像是方法或其他宣告，那列舉值結束需要以分號 `;` 結尾
> 這可能是整個 kotlin 語言中唯一強制需要加上分號的地方了

使用方法 :

1. 直接使用
	```kotlin
	val monday = WeekDay.Monday
	```

2. 透過隱藏的 name 屬性 (name 屬性和列舉成員值相同)
	```kotlin
	val mondayByName = WeekDay.valueOf("Monday")
	```
	使用這種方法取得，如果帶入的字面值沒有對應的列舉值，則會拋出 java.lang.IllegalArgumentException: No enum constant
3. 透過位置取得
	```kotlin
	val mondayByOrder = WeekDay.values()[0]
	```
	
## 列舉值方法

列舉值的方法會寫在每一個列舉對象的閉包內

```kotlin
enum class WeekEnd(val abbr:String) {
	Saturday("Sat") {
		override fun chineseDesc() = "星期六"
	},
	Sunday("Sun") {
		override fun chineseDesc() = "星期日"
	};
	
	abstract fun chineseDesc():String // 此類別的實例(列舉對象)都要實現此方法
}
```

---

# 密封

修飾子 : `sealed`

密封類別個人解讀是一種強化列舉的類別，在列舉中，所有列舉值的型別都是該列舉類別，所有列舉對象具有相同的屬性，相同的方法

但是在密封類別中，每一個密封對象可以有不同的屬性和不同的方法，因為其實他們都是不同的類別，只是有共同的父類別而已

使用上 `open` 和 `sealed` 的差異是
密封類別的主建構子是私有的，所以無法在其他地方直接生成密封類別的物件
但是 `sealed` 的 **內嵌子類別** 就沒有這個限制


```kotlin
sealed class Event {  
	class Send(val target:String):Event()  
	class Receive(val from:String):Event()  
}
```

- `Send` 有 `target` 的屬性
- `Receive` 有 `from` 屬性

使用上相當於建立一個 Event 子類別的實例

```kotlin
val sendToJhon = Event.Send(target = "John")
val receiveFromTom = Event.Receive(from = "Tom")
val event = Event() // 報錯! 不能直接產生密封類別的物件
```

如果說只需要一個純粹的子類別不含屬性並且希望像 enum 那樣使用，可以搭配 `object` 關鍵字

```kotlin
sealed class Event {
	class Send(val target:String):Event()  
	class Receive(val from:String):Event()
	object OnTheWay : Event()
}
```

這樣在取得 `Event.OnTheWay` 的時候就會取得單一實例的物件，不會每一次使用都創建新物件出來

使用上搭配 `when` 可以用 `is` 來判定型別，並且在每一個區塊內會自動轉型

```kotlin
fun main() {  
	 val sendToJhon = Event.Send(target = "John")  
	 val receiveFromTom = Event.Receive(from = "Tom")  
	 val transmitting = Event.OnTheWay  

	 val listEvents = listOf(sendToJhon, receiveFromTom, transmitting)  

	 when(val obj:Event = listEvents.random()) {
	 	// 會將 obj 自動轉型成 Event.Send，所以可以存取 target 屬性
	 	is Event.Send -> println(obj.target) 
		// 會將 obj 自動轉型成 Event.Send，所以可以存取 from 屬性
		is Event.Receive -> println(obj.from) 
		// 單一實例不需要用 is 型別判斷，直接等於判斷即可
		Event.OnTheWay -> println("event on the way") 
	 }
}
```