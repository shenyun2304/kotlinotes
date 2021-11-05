# 繼承
Kotlin 中預設所有類別都會被冠上 `final` 的關鍵字以後編譯成 class 檔
所以如果要把類別開放給其他類別繼承，要在類別宣告前加上 `open` 修飾子
同樣的邏輯也用於方法和屬性，預設都是 `final`，如果要開放則要增加 `open` 修飾子

- 如果要繼承某個類別，要在類別宣告最後方加上冒號 `:` 並指定要繼承的類別

```kotlin
open class Super {}
class Sub:Super {}
```

> Kotlin 中只能繼承一個類別 (和 Java 相同)

- 如果父類別有自定義建構子，那子類別宣告時也要指定使用父類別的哪一個建構子
	子類別建構子中的屬性不需要再宣告 `val` 或 `var`

```kotlin
open class Super(val name:String = "")
class Sub(n:String):Super(n)
class Sub2:Super() // 因為父類別 name 屬性有給預設，可以呼叫無參數建構子
```

- 透過建構子實現繼承
	```kotlin
	class Sub3:Super {  
		constructor(n:String) : super(n)  
	}
	```
		
## 覆寫屬性

覆寫屬性可以把屬性從 `var` 覆寫為 `val`，但是反過來不行

```kotlin
open class View(val width:Int, val height:Int) {
	open var size:Int = 0
}

class SmallView(width:Int, height:Int):View(width, height) {
	override var size:Int = width * height
}

class largeView(width:Int, height:Int):View(width, height) {
	override var size:Int = width * height
		get() = width * width // 宣告只有 get()，表示此屬性從 var 變成 val 唯毒
}
```

### 內部類訪問父類別

子類別的內部類別要訪問外部類別的父類別屬性，要使用 `super@外部類別.父類別屬性`

```kotlin
open class View(val width:Int, val height:Int) {
	open var size:Int = 0
}

class SmallView(width:Int, height:Int):View(width,height) {
	override var size:Int = width * height
	
	inner class Painter {
		fun sizeInOuterClass():Int = size // 拿到的會是 SmallView 的 size
		fun sizeInSuperClass():Int = super@SmallView.size
	}
}
```

---

# 抽象類別

修飾子 : `abstract`

組成 :
- 抽象屬性
- 抽象方法
- 實體屬性
- 實體方法

## 繼承規則
- 如果實體類別繼承抽象類別，實體類別必須實現所有抽象類別的屬性和方法
- 如果抽象類別繼承抽象類別，則可以選擇想要實現的屬性和方法，也可以都不要

---

# 介面

關鍵字 : `interface`

組成 :
- 實體方法
- 抽象方法
- 抽象屬性
	- 聲明屬性而不進行初始化操作
	- 聲明屬性後提供自定義 getter，因為抽象屬性不包含隱藏成員，所以不能使用 `field`
	```kotlin
	interface OnTouchListener {
		var target:View
		val description:String
			get() = "a touch listener"
	}
	```

> Kotlin 一個類別可以實現多個介面 (也和 Java 一樣)

## 實現衝突

當一個類別實現的多個介面有實現相同命名的方法
**子類別必須實現該方法**
可以使用 `super<父類別型別>.方法()` 在實現方法的區塊內分別呼叫不同覆類別的該方法

```kotlin
interface A {
	fun call() {
		println("call in A")
	}
}

interface B {
	fun call() {
		println("call in B")
	}
}

class Concrete : A, B {
	override fun call() {
		super<A>.call()
		super<B>.call()
		println("call in Concrete")
	}
}

fun main() {
	val con = Concrete()
	con.call()
	/**
	call in A
	call in B
	call in Concrete
	*/
}
```