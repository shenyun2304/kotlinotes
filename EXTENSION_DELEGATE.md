# 擴展 (Extension)

為既有類別添加新的方法或屬性

> 可以擴展 Kotlin 原生的類別，也可以擴展 Java 的類別
> 實際上很多 Kotlin 中的 lib 或語法糖都是擴展 Java 類別得來的

## 擴展方法

語法 : `fun 類別名稱.擴展方法名稱(參數):回傳型別`

範例 : 對 Num 型別擴展 add 方法

```kotlin
class Num(var x:Int)

fun Num.add(var y:Int) {
	this.x += y
}

fun main() {
	var n = Num(10)
	n.add(4)
	println(n.x) // 14
}
```

> 如果擴展的方法名稱和原本類別中的名稱衝突(相同)，則呼叫的時候 **一定是呼叫類別中定義的方法，不會調用擴展方法**

## 擴展屬性

擴展屬性並不是真的在底層類別中增加一個屬性，而是以增加特殊的 getter/setter 方法來實現

已經定義好的類別本身沒有額外空間來儲存新的屬性，所以擴展屬性不能有初始值和隱藏變數(`field`)

語法 : `val 類別名稱.屬性名稱:屬性型別`

範例 : 為 List 添加一個 second 屬性取得列表第二個值 (索引值為 1)

```kotlin
val <T> List<T>.second:T
	get() = [1]
	
fun main() {
	val list:List<Int> = listOf(1,2,3)
	println(list.second) // 2
}
```

## 擴展伴生實例

語法 : `fun 類別名稱.Companion.伴生實例名稱:回傳值型別`

為 String 類別添加 `random` 伴生實例

```kotlin
fun String.Companion.random():String = UUID.randomUUID().toString()

fun main() {
	println(String.random()) // UUID
}
```

## 擴展可空類型

如果把擴展功能放在可空類型上，則在擴展功能中藥添加判斷當接收者為空時的邏輯，這樣在實際使用時就不用為擴展功能強制加上安全操作 : `?`

語法 : `fun 類別名稱?.擴展方法(參數):回傳型別`

範例 : 如果要幫字串添加一個 `md5` 的屬性，但是當字串是空值時就不要處理，回傳空字串

```kotlin
val String?.md5: String  
	get() {  
		if (this == null) {  
			return ""  
		}  
		return BigInteger(1, MessageDigest.getInstance("MD5").digest(toByteArray())).toString(16).padStart(32, '0')  
	 }
	 
	 
fun main() {
	val s = "123"
	println(s.md5) // "202cb962ac59075b964b07152d234b70"
	val s2:String? = null
	println(s2.md5) // ""
}
```

### 靜態綁定
將擴展方法綁定到類別的過程是採用所謂 **靜態綁定** 的方式
意思是在呼叫擴展方法時，會呼叫的是使用時的 **聲明類型**，而不是運行時實際物件的類協
```kotlin
open class A
class B:A()
fun A.test() = println("test in A")
fun B.test() = println("test in B")
fun call(a:A) = a.test()
fun main() {
  val b:B = B()
  call(b) //  "test in A" : 引數是 B 類型物件，呼叫的卻是 A 類型的擴展方法
  // 因為 call 方法宣告時聲明的是 A 類型，所以會呼叫 A 的擴展方法
   b.test() // "test in B"
}
```

---

# 代理

## 方法代理

代理是一種 Design Pattern，Kotlin 有特殊語法可以省去撰寫代理模式那一堆的程式碼

範例 : 代理模式

```kotlin
interface Base {
	fun log(message:String)
	fun isEnabled():Boolean
}
class BaseImpl:Base {
	override fun log(message:String) = println(message)
	override fun isEnabled() = true
}
class Delegation(val base:Base):Base {
	override fun log(message:String) {
		base.log(message)
	}
	override fun isEnabled() = base.isEnabled()
}

fun main() {
	val baseDelegate = Delegation(BaseImpl())
	baseDelegate.log("test") // "test"
}
```

這就是一個很簡單的代理模式，實際運用上會有個小問題，就是當 Base 介面方法很多的時候，**這個代理也會需要一一實現這些方法**，這些程式碼雖然意義明確但是很瑣碎，kotlin 提供了一種語法可以讓代理只需要覆寫指定的方法，不需要全部方法都覆寫

語法 : `代理介面名稱 by 代理的實例`

```kotlin
class Delegation(base:Base) Base by base {
	override fun log(message:String) {
		println("override log")
		base.log(message)
	}
	// 其他方法如果沒有特殊處理可以不寫，Kotlin 編譯器做掉
}
```


## 屬性代理

除了呼叫方法可以製作代理，屬性也能有代理

底層實現方法原理是將屬性的 getter/setter 呼叫過程讓代理的 `getValue()/setValue()` 來完成

```kotlin
operator fun getValue(thisRef:Any?, prop:KProperty<*>):屬性型別 {
	return 屬性代理物件
}
```

- `thisRef:Any?` : 表示這個被代理的對象實體
- `prop` : 表示對代理屬性的使用
- 回傳值型別必須和被代理的屬性型別一致或為父類別

```kotlin
operator fun setValue(thisRef:Any?, prop:KProperty<*>, value:屬性型別) {
	屬性代理物件 = value
}
```

- `value` : setter 方法中的 value 是屬性被賦值時傳遞的的真實值
- setter 的 value 型別必須和被代理的屬性型別一致或為子類別


語法 : `var/val 屬性名稱:屬性類型 by 代理對象`

1. 創建代理對象類別
2. 使用 `by` 語法


```kotlin
class IntDelegate {
	private var logLevel:Int = -1
	
	operator fun getValue(thisRef:Any?, prop:KProperty<*>):Int { 
		// 回傳值型別可以是 Int 的父類別
		return logLevel
	}
	
	operator fun setValue(thisRef:Any?, prop:KProperty<*>, value:Int) {
		// 回傳值型別可以是 Int 的子類別
		logLevel = value
	}
}

class Logger {
	var intLogger:Int by IntDelegate() // 宣告使用 IntDelegate 來代理實際 Int 物件
	intLogger.logLevel = 3 // 呼叫到 IntDelegate 的 setValue
	pirintln(intLogger.logLevel) // 呼叫 IntDelegate 的 getValue
}
```

## Kotlin  內建屬性代理

### 惰性初始 (lazy initial)

Kotlin 中的非空屬性初始值是一種立刻初始的方式，當物件創建完成後該物件的初始值也給定了

惰性初始可以讓該屬性的初始過程從創建時被延遲到 **第一次使用時** 才初始

語法 : `val 屬性名稱:屬性類型 by lazy`

使用 Lazy 類型作為屬性委託，就可以達成惰性初始的效果

```kotlin
class A {
	val lazyProp:Long by lazy {  
		println("Compute...")  
		System.currentTimeMillis() // lambda 不需寫 return
	}
}
fun main() {  
	println("main start")  
	val e:E = E()  
	println("E initialized")  
	println("access E's lazyProp:${e.lazyProp}")  
	println("access E's lazyProp:${e.lazyProp}")  
}
/**
main start
E initialized
Computer
access E's lazyProp:1634881534943
access E's lazyProp:1634881534943
*/
```

可以看到當物件 e 初始化的時候並沒有初始 `lazyProp` 屬性
而是在第一次呼叫 access 之前才做初始動作打印出 `Compute...`
之後第二次 access 就直接回傳屬性值，沒有在進行重新初始的動作 (沒有印出 `Compute...`)
> 惰性初始因為沒有 setter 方法，所以只能用於取值，不能用賦值操作

### 觀察者 (observer)

觀察屬性值變化的情況，並在變化時執行代理定義的操作

語法 : `var/val 屬性名稱:屬性類型 by Delegates.observable("屬性初始值") { prop, old, new -> ()->Unit }`

- `prop` : 被代理的屬性物件
- `old` : 賦值操作前的值
- `new` : 正在被賦予的新值

```kotlin
class User {  
	var name:String by Delegates.observable("初始值") { prop, old, new ->  
		if (old != new) {  
			println("from $old to $new")  
		} 
	}  
}  
  
fun main() {  
	val user = User()  
	println(user.name) // "初始值"

	user.name = "John" // "from 初始值 to John"
	println(user.name) // "John"

	user.name = "John" // 雖然賦值但是沒改變內容 (old == new) -> 不會打印
	println(user.name) // "John"
}
```

### 觀察並判斷是否允許操作 (vetoable)

語法 : `var/val 屬性名稱:屬性類型 by Delegates.vetoable("屬性初始值") { prop, old, new -> ()->Boolean }`

當屬性值變化時，回傳 `true` 表示允許操作成功，回傳 `false` 則表示操作失敗，屬性值不變

```kotlin
class User {
	var age:Int by Delegates.vetoable(0) { prop, old, new ->  
		new < 20  
	}
}

fun main() {
	val user = User()
	println(user.age) // 0
	user.age = 10
	println(user.age) // 10
	user.age = 21  
	println(user.age) // 10 : 因為回傳 false, 賦值操作失敗
}
```

### 非空代理 (notNull)

可以允許屬性非空直到 **使用前才進行初始**

> 和惰性初始的差異是，惰性初始化後，就不能再改變，而非空可以

語法 : `var 屬性名稱:屬性類型 by Delegates.notNull<屬性類型>()`

```kotlin
class User {
	var notNullStr:String by Delegates.notNull<String>()
}

fun main() {
	val user = User()  
	// println(user.notNullStr)  // 在初始化之前呼叫 getter 會噴 IllegalStateException:Property notNullStr should be initialized before get
	user.notNullStr = "initial"  
	println(user.notNullStr) // "initial"
	user.notNullStr = "after"  
	println(user.notNullStr) // "after"
}
```

### 映射代理 (map)

可以將類別中的屬性全部保存到 Map 物件中，於是存取屬性就變成存取 Map 裡面的鍵值組，但是操作起來卻是像屬性一樣的操做

語法 : `var 屬性名稱:屬性類型 by 映射變數名稱`

```kotlin
class Person(map: Map<String, Any?>) {
	val name:String by map
	val age:Int by map
}

fun main() {
	val person = Person(mapOf(
		"name" to "John",
		"age" to 13
	)) // 用 map 當引數傳入
	println(person.name) // 使用屬性存取 map["name"]
	println(person.age) // 使用屬性存取 map["age"]
}
```