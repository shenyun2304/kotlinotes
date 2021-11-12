# 基礎宣告

## 泛型符號

一般使用的泛型符號為大寫英文字母，其中某些字母為使用上的常例

- `T` : 表示 Type : 通用的型別符號
- `K` : 表示 Key : 用於表達該型別為鍵值使用型別
- `V` : 表示 Value : 用於表達該型別為內容值使用型別
- `E` : 表示 Exception : 用於表示例外的型別

## 泛型方法

在 `fun` 關鍵字後方以 `<T>` 宣告方法使用泛型
後方方法宣告鐘就可以使用 `T` 來當作一種型別

```kotlin
fun <T> echo(t:T):T {
	return t
}
```

## 泛型類別

在類別名稱後面加上 `<T>` 來宣告類別使用泛型

> Kotlin 不支援泛型原始型別直接使用

```kotlin
open class SomeClass<T>(obj:T)
```

## 繼承

如果繼承一個泛型類別，子類別需要明確指定父類別泛型的型別，而不能沿用父類別的泛型參數

```kotlin
open class Super<T>(obj:T)

class Sub(obj:Int):Super<Int>(obj)
```

---

# 泛型限制

指定泛型型別的上界，有助於對泛型物件操作的掌握性

```kotlin
fun <T> sum(first:T, second:T) = first + second
```

這樣的方法會導致意料之外的結果，如果 T 是數值型別物件，那可能會照預期結果做相加的動作，但是如果是其他類型物件，則結果就無法預期，這種情況可以對泛型型別 `T` 做型別上界的限制

```kotlin
fun <T:Number> sum(first:T, second:T) = first + second
```

這樣調整可以限制泛型型別 `T` 的上界一定要是 `Number` 型別，這樣的設定就能保證此方法的結果和預料結果相同，當傳入非數值物件時，編譯器會報錯

## 多個限制

使用 `where` 宣告來指定多個限制

`where` 需要放在類別或方法的宣告的地方，多個限制以逗號 `,` 做分隔
- 每一個限制都必須包含泛型型別
- 因為 kotlin 單繼承特性，多個限制型別中只能有一個是具體類別

```kotlin
fun <T> remove(Collection: T, item: T) where T:MutableIterable<T>, T:Collection<T> {}

abstract class MyList<T>:Collection<T> where T:MutableIterable<T>, T:Collection<T> {}
```

## 預設限制

泛型型別 `T`在 kotlin 中預設以 `Any?` 為型別上界，如果沒有特別指明上界了話在使用時需要做可空 `?` 處理

```kotlin
fun <T> eq(first:T,second:T):Boolean {
	return first?.equals(second)
}
```

可空處理在非必要的時候用起來很不方便，可以強制將泛型上界定為 `Any`

```kotlin
fun <T:Any> eq(first:T,second:T):Boolean {
	return first.equals(second)
}
```

> 在 Java 這個預設限制是 `Object`

---

# 轉型

kotlin 泛型預設是不允許向上轉型的，例如

```kotlin
open class Super
class Sub:Super()

class Holder<T>(var obj:T)

fun main() {
	var subHolder:Holder<Sub> = Holder<Sub>(Sub())
	var supHolder:Holder<Super> = Holder<Super>(Super())
	supHolder = subHolder // 向上轉型 -> 編譯錯誤!
}
```

## 向上轉型 (Covariant) -> 協變

如果 Sub 是 Super 的子類別，那 Sub 的型別物件轉換成 Super 型別，這種特性稱為 "向上轉型"

在宣告時，需要在泛型符號前聲明 `out` 關鍵字

```kotlin
class CovariantHolder<out T>(var obj:T)

fun main() {
	val strHolder = CovariantHolder<String>("super")
	val anyHolder:CovariantHolder<Any> = strHolder 
	// 自動將 String 向上轉為 Any, 不會爆錯
}
```

> 向上轉型轉換後只能當做 **取值** 物件，即只能作為**方法回傳值**或**唯讀屬性**
> 例如上面 `anyHolder.obj = Date()` 這種操作是不允許的
> 此例中因為 anyHolder 的 `obj` 實體其實是 strHolder 宣告的 String 型別
> 雖然 anyHolder 以 `Any` 型別轉換，理論上看起來可以
> 但是實際上賦值的時候因為 String 和 Date 型別並不能互轉
> 所以會拋出錯誤
> 因為如此，所以 kotlin **不允許向上轉型轉換後賦值操作**，只允許 **取值操作(out)**

## 向下轉型 (Contravarint) -> 逆變

如果 Sub 是 Super 的子類別，那 Super 的型別物件轉換成 Sub 型別，這種特性稱為 "向下轉型"

在宣告時，需要在泛型符號前聲明 `in` 關鍵字

和向上轉型相反，向下轉型 **只允許賦值操作(in)**，即只能當作引數輸入到其他地方

```kotlin
class ContravarintHolder<in T>(obj:T) {
	fun test(param:T) {
		println(param)
	}
}

fun main() {
	var any = ContravarintHolder<Any>(10) // Any 型別，值為 10
	var str:ContravarintHolder<String> = any // 因為 String 是 Any 的子類別，所以可以向下轉型 Any -> String
	str.test("hello") // 逆變型別只允許賦值操作
}
```

## 轉型邊界

如果同一個參數同時需要有賦值和取值的功能，那怎麼辦?
以上的泛型型別宣告都是在類別宣告的時候就指定了，影響範圍是整個類別的成員 = 無解

要實現可以輸入也輸出，只能縮小轉型範圍，例如縮小到只存在於方法的參數中

```kotlin
fun covariant(holder: Holder<out Number>) {
	val value = holder.obj // 可以! 輸出屬性
	holder.obj = 5 // 噴錯! out 只能用於輸出
}

fun contravarint(holder: Holder<in Number>) {
	holder.obj = 5 // 可以! 輸入屬性 -> setter 的引數
	val any:Any? = holder.obj // 因為 in Number 的宣告表示，輸入進來的是 Number 的父類別物件(逆變)，但是在這裡並不知道是哪個父類別，所以只能轉型成 kotlin 中的頂層父類別 Any?
}
```

---

# 泛型擦除

和 Java 一樣，泛型聲明只存在於編譯期，編譯後泛型的型別不會保留泛型的類型在編譯後的 class 檔中

這表示無法將泛型型別當作普通類別來使用，例如 `obj is Holder<Int>`，後方那個 `Holder<T>` 的 `<T>` 的型別 `<Int>` 在編譯後並不會保存

也無法用泛型型別來創建物件

```kotlin
fun <T> newIt(t:T):T {
	return T::class.java.newInstance() // nope! 編譯器錯誤
}
```

要解決這種問題處理方式一般都是在使用時也帶入一個類別型別的參數來做判斷

```kotlin
fun <T> fillList(list:MutableList<T>, size:Int, clazz: Class<T>) {
	for (i in 1..size) {
		val obj = clazz.newInstance()
		list.add(obj)
	}
}
```

那有沒有什麼辦法可以讓方法保留泛型資訊

有!

1. 使用 `inline` 內嵌方法，原理是內嵌方法本體會被覆蓋到呼叫的位置，所以原本輸入泛型引數的地方會被 "真正的引數" 代替，所以拿到會是 "真正引數的型別"
2. 對於泛型型別 `T` 增加 `reified` 修飾子，告訴編譯器 **用 "真正的類別參數型別" 來替代這個泛型型別**

### `reified` 只能搭配 `inline` 使用

```kotlin
inline fun <reified T> fillList(list:MutableList<T>, size:Int) {
	for (i in 1..size) {
		val obj = T::class.java.newInstance() // 用真實類型產生實例
		list.add(obj)
	}
}
```

---

#  範例

使用泛型實現 Dao 架構

```kotlin
open class Entity() {
	var id:Long?
	var createdAt:Data?
	var updateAt:Date?
}

class Product:Entity() {
	var code:String?
	var name:String?
	var price:BigDecimal?
}

class Stock:Entity() {
	var name:String?
	var products:List<Product> = mutableListOf()
}

interface Dao<T> {
	fun save(t:T):Long
	fun get(id:Long):T?
}

abstract class BaseDao<T:Entity>:Dao<T> {
	var table = mutableMapOf<Long,T>()
	
	override fun save(t:T):Long {
		t.id = System.currentTimeMillis()
		t.createdAt = Date()
		t.updateAt = t.createAt
		table[t.id!!] = t
		return t.id!!
	}
	
	override fun get(id:Long):T? {
		return table[id]
	}
}

class ProductDao:BaseDao<Product>()
class StockDao:BaseDao<Stock>()

fun main() {
	val productDao = ProductDao()
	val product = Product().apply {
		code = "B00001"
		name = "Kotlin"
		price = BigDecimal("60")
	}
	val pid = productDao.save(product)
	
	varl productRecord = productDao.get(pid)
	
	val stockDao = StockDao()
	val sotck = Stock().apply {
		name = "Storage 1"
		products = mutableListOf(product)
	}
	val sid = stockDao.save(stock)
	val stockRecord = stockDao.get(sid)
}
```