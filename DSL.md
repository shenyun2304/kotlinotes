# DSL

先來談談 DSL 是什麼

### Domain Specific Language
> 領域 指定 語言

DSL 意思是指 **只用於解決某些特定領域問題** 的語言

例如 SQL 就是一種 DSL，只能用於解決資料庫這一個領域的語言，開發者基本上無法使用它來撰寫一個完整的應用程式

而我們常常上手的那些程式語言如 Java、Kotlin、Golang、JS 則稱為 **通用程式語言 (General Purpose Programming Language)**

DSL 有兩個明顯的特點 :

- 比通用語言省略大量的程式碼，能夠更簡潔的表達在該領域中執行的各種操作
- 通常更符合人類語言習慣

#### 常見 DSL
- SQL : 資料庫操作
- Regex : 正則表達式
- Gradle、SBT : 建構工具
- Freemarker、JSX、Anko : 前端頁面生成

#### DSL 分類

- 外部 DSL :
	保存在應用程式之外，一般應用很難直接和外部 DSL 進行互相呼叫
	
> 像 SQL，Java 就無法直接呼叫，得透過 JDBC 這類的實現 TCP 通訊底層的函式庫 (驅動程式)
- 內部 DSL :
	在應用程式中透過通用程式語言實現 DSL 語言，簡單來說就是 **用語言來創造語言**，
	內部 DSL 通常和實際應用程式採用的通用程式語言進行撰寫，所以可以很容易和應用程式互動
	
---

# Kotlin DSL

在 Kotlin 中實現 DSL
假設一個 Kotlin 的 Class

```kotlin
data class CPU(var core:Int, var arch:String)
```

要創建這個 Class 的物件基本方法就是

```kotlin
val cpu = CPU(8, "64 bit")
```

### 1. 使用 Lambda 表達式來實現 DSL

1. 先調整一下 `CPU` Class

```kotlin
class CPU(var core:Int = 1, var arch:String = "32 bit") {
	fun core(core:Int) {
		this.core = core
	}
	
	fun arch(arch:String) {
		this.arch = arch
	}
}
```

2. 創建一個叫做 `cpu` 的方法，參數為接受 CPU 參數的匿名方法，回傳 CPU 物件

```kotlin
fun cpu(block:(CPU)->Unit):CPU {
	val cpu = CPU() // 創建 CPU 物件
	block(cpu) // 把此物件當作參數呼叫匿名方法
	return cpu // 回傳新建的 CPU 物件
}
```

3. kotlin 中方法最後一個參數如果是匿名方法，則可以在呼叫的時候把 `{}` 放到 `()` 之後

```kotlin
// cpu({}) -> cpu() {} -> cpu {}
val c1 = cpu { c -> // 匿名方法架構是輸入一個 CPU 參數，沒有回傳
	c.core(2)
	c.arch("64 bit")
}
println("c1: core:${c1.core}, arch:${c1.arch}") // c1: core:2, arch:64 bit
```

4. Kotlin 中如果方法參數只有一個，會自動注入隱藏參數 `it` 裡面

```kotlin
val c2 = cpu {
	it.core(2)
	it.arch("64 bit")
}
println("c2: core:${c2.core}, arch:${c2.arch}") // c2: core:4, arch:64 bit
```

5. 如果再把 `cpu` 方法的參數改成傳送 CPU 類別的 **擴展方法**

```kotlin
fun cpu(init:CPU.()->Unit):CPU {
	// 參數為 CPU 類別的一個擴展方法，名稱是 init，此方法無輸入參數也無回傳值
	val cpu = CPU()
	cpu.init()
	return cpu
}
```

因為是 CPU 類別的擴展方法，所以方法內可以直接存取到物件屬性
使用上就可以更簡化 :

```kotlin
val c3 = cpu {
	// 整個方法內容是 CPU 類別的擴展，可以直接呼叫或使用 CPU 物件的方法或屬性
	this.core = 8
	println("Oops I'm in closure") // 呼叫此擴展方法時就會 print
	arch("64 bit")
}
println("c3: core:${c3.core}, arch:${c3.arch}")

/**
Oops I'm in closure
c3: core:8, arch:64 bit
*/
```

這種用法在 Gradle 上非常常見

## 2. 使用 Fluent design 來實現 DSL

fluent design 是一種設計方式，透過方法回傳物件本身來達到連續呼叫方法的用法

1. 調整一下 CPU Class

```kotlin
class CPU(var core:Int = 0, var arch:String = "32 bit") {
	fun core(core:Int):CPU { 
		this.core = core
		return this // 回傳自己
	}
	
	fun arch(arch:String):CPU {
		this.arch = arch
		return this // 回傳自己
	}
}
```

2. 使用上就可以像是 builder pattern 一樣做物件初始化

```kotlin
val cf = CPU().core(2).arch("64 bit")  
  
println("cf: core:${cf.core}, arch:${cf.arch}") //cf: core:2, arch:64 bit
```

3. 搭配 kotlin 方法中的 `infix` 修飾子，讓 `core` 和 `arch` 方法變成一種操作子 (Operator)

```kotlin
class CPU(var core:Int = 0, var arch:String = "32 bit") {
	infix fun core(core:Int):CPU { 
		this.core = core
		return this // 回傳自己
	}
	
	infix fun arch(arch:String):CPU {
		this.arch = arch
		return this // 回傳自己
	}
}

val cf2 = CPU() core 4 arch "64 bit"  
  
println("cf2: core:${cf2.core}, arch:${cf2.arch}") // cf2: core:4, arch:64 bit
```

---

# 比較

#### Lambda 實現 DSL

```kotlin
cpu {
	this.core = 4
	arch("64 bit")
}
```

#### fluent design 實現 DSL

```kotlin
CPU() core 4 arch "64 bit" 
```

---

# 模仿 Gradle 的 dependencies 區塊

```kotlin
class MyGradle {  
	private val libs = mutableListOf<String>()  
	fun implementation(libPath:String) {  
		libs.add(libPath);  
	}  
	fun build() {  
		println(libs)  
	}
}  
  
fun myDependencies(init:MyGradle.()->Unit) {  
	val myGradle = MyGradle()  
	myGradle.init()  
	myGradle.build()  
}  
```

使用上就可以這樣用

```kotlin
myDependencies {  
 	implementation("org.jetbrains.kotlin:ohohohoho-whatever:0.0.1")  
	implementation("org.jetbrains.kotlin:ohohohoho-whatever:0.0.2")  
	implementation("org.jetbrains.kotlin:ohohohoho-whatever:0.0.3")
}
```

執行會創建 `MyGradle` 物件並且執行完 `init()` 後會呼叫 `build()` 方法，印出

```
[org.jetbrains.kotlin:ohohohoho-whatever:0.0.1, org.jetbrains.kotlin:ohohohoho-whatever:0.0.2, org.jetbrains.kotlin:ohohohoho-whatever:0.0.3]
```