# 類別 (Class)

類別亦稱 "型別" 或 "類型"，描述一種資料結構的樣子
程式中看到英文描述 Class、Type 都是類似的概念

宣告格式 :

```
[存取範圍] class [類別名稱] {
	// ... 屬性
	// ... 方法
}
```

> 如果一個類別沒有實體內容，kotlin 允許省略 `{}`

- 存取範圍 : `public`、`internal`、`private` 三種

---

# 物件 (Object)

物件亦稱 "實例"、"實體"，是指照著類別描述的樣子創造出來的物體
程式中看到英文描述 Object、Instance 都是這個概念

在 java 中需要透過 `new` 關鍵字來創建物件，kotlin 中可以省略 `new` 關鍵字

---

# 類別建構子 (constructor)

kotlin 中類別建構子分為主建構子及副建構子

## 主建構子

主建構子的宣告緊跟在類別宣告之後
- **所有物件在創建時，都必須使用主建構子進行初始化**
- **一個類別只能有一個主建構子**

宣告格式 :

```
class [類別名稱] [存取範圍] constructor(屬性列表) {}
```

- `constructor` 關鍵字 : 當主建構子前不包含任何存取範圍宣告時，此關鍵字可以省略
- 存取範圍 : 預設為 `public` (可省略)，並還有 `protected`、`internal`、`private` 共四種
- 屬性列表 : 在這裡宣告此類別有哪些屬性，此處宣告的屬性必須加上 `val` 或 `var` 的前綴，如果沒有加上前綴，則該參數會被當成常數存在於初始化後的物件中


範例

```kotlin
// 基礎宣告式
class Button(var text:String, val width:Int, val height:Int)

// 給定參數預設值 -> 建構子多載
class Button(var text:String = "Click", val width:Int, val height:Int)
```

### 初始化區塊

kotlin 的主建構子沒有 java 中的建構實體區塊，對應的是提供初始化區塊來實現相同功能

不一樣的是一個類別中可以擁有多個初始化區塊，這些初始化區塊的執行順序為由上往下一次執行

```kotlin
class Button(var text:String, val width:Int, val height:Int) {
	val area:Int
	init {
		area = width * height
		println("初始化區塊 1")
	}
	init {
		println("初始化區塊 2")
	}
}
```

## 副建構子

- 副建構子的作用在於 **輔助主建構子**
- 所以 **所有的副建構子最終都必須呼叫主建構子**
- 形成 **間接呼叫主建構子==的使用方式**
- **副建構子可以有 0 個或多個，但是主建構子只能有一個**

宣告方式 :

```
constructor(參數列表1):this(參數列表2) {}
```

- 參數列表 1 : 表示此副建構子的參數列表
- 參數列表 2 : 表示呼叫主建構子或其他副建構子

> 副建構子的參數並不是屬性，只有主建構子才能定義屬性，副建構子只是輔助，並不會產生物件
> 使用副建構子創建最終還是靠主建構子來產生物件

```kotlin
class Button(var text:String, val width:Int, val height:Int) {
	// 副建構子 1 呼叫主建構子
	constructor(text:String):this(text,0,0) {} 
	
	// 副建構子 2 呼叫主建構子
	constructor(width:Int, height:Int):this("",width,height) {} 
	
	// 副建構子 3 呼叫 副建構子 1
	constructor():this("Default") 
}
```

---

# 屬性

來深入思考一下屬性是什麼

在 JavaBean 中，我們一般不會嚴格區分成員和屬性的差別，意思是

```java
class Demo {
	private String _alias_;
	public String getName() {
		return _alias_;
	}
	public void setName(String name) {
		_alias_ = name;
	}
}
```

在上述範例中 `_alias_` 是類別成員，
但是對於這個類別的物件來說，能夠操作的屬性是 `name`
而屬性 `name` 對應的訪問器 (getter/setter) 就是 `getName` 和 `setName` 方法

會特別把這件事提出來是因為在 kotlin 中開發者只能定義屬性，不能定義成員

> 由上述例子可以看出，事實上我們並不在意真正成員叫什麼名字，對於物件來說，屬性才是操作標的

在 kotlin 中 **每一個屬性都會自動創建預設的訪問器**
某些情況下，我們需要自定義屬性的訪問器 :

- getter 和 setter 必須緊跟在屬性名稱後面
- getter 和 setter 沒有先後順序的要求
- getter 需要回傳屬性值
- setter 會包含一個參數，該參數用來保存傳遞過來的引數

```kotlin
class Computer(val disk:Int) {
	var availableSpace:Int = 0
	var usedSpace:Int
		get() {
			return disk - availableSpace
		}
		set(value) {
			availableSpace -= value
		}
}
```

讓我們思考一下這段程式

```kotlin
var price:Int = 0
	set(value) {
		if (value < 0) {
			price = 0
		} else {
			price = value
		}
	}
```

價格不能小於零，看起來很正常，問題在哪?


當呼叫 `price = 0` 的時候，stack 就爆了，why? 思考一下

```
設定 `price = 0` -> 呼叫 `price` 的 `set` 方法 -> 
判斷 `value` 沒有小於零 -> 執行 `else` 區塊 -> 
設定 `price = 0` -> 回到一開始
```

看出來了嗎? 這樣的呼叫會像無限遞迴一樣的呼叫，直到 stack 記憶體被 function call stack 填滿噴出 stackoverflow

### 隱藏成員

要在 setter 中修改真正的成員值而不是再次使用 setter 方法來賦值，可以呼叫隱藏參數 `field`，設定了 `field` 參數值等於設定了該屬性背後的成員變數值

```kotlin
var price:Int = 0
 set(value) {
   if (value < 0) {
     field = 0
   } else {
     field = value
   }
 }
```

這樣就不會造成無限遞迴呼叫的狀況，因為設定不是 price 這個屬性，而是此屬性的隱藏成員

## 內聯屬性

關鍵字 `inline` 宣告的屬性不會有隱藏成員，這也表示開發者需要自己去實現那個隱藏成員的動作，就像上述 java 範例那樣

```kotlin
class Student {
	var _alias_ = ""
	inline var username:String
		get() = _alias_
		set(value) {
			this._alias_ = value
		}
}
```

## 延遲初始化屬性

在 Kotlin 中，類別定義的所有屬性都必須明顯的被初始化，這個規定可以提醒開法者及時注意屬性是否有正確被初始化，但某些時候會造成開發者必須多寫一些程式碼，例如必須要延遲初始化的屬性，在創建物件時不會帶入主建構子，就必須宣告為可空 (Optional -> `?`)，一旦宣告為可空，之後對於屬性的操作就必須做非空處理

例如 Android，屬性必須在 `onCreate` 後才會被初始化，之前都是空

```kotlin
class SomeActivity:Activity {
	var txtTitle:TextView? = null
	override fun onCreate(savedInstanceState:Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_some)
		
		txtTitle = findViewById(R.id.title)
		
		txtTitle!!.text = "手動強制非空賦值"
	}
}
```

Kotlin 有提供 `lateinit` 關鍵字來聲明屬性一定會被初始化，只是會延遲，這種屬性有幾個限制 :

- 屬性必須是在類別中的成員，不能在主建構子中宣告
- 屬性必須使用預設的訪問器，不支援自定義訪問器
- 屬性必須宣告為 `var`
- 屬性必須宣告為非空
- 屬性必須非基本數據類型

```kotlin
class SomeActivity:Activity {
	lateinit var txtTitle:TextView
	override fun onCreate(略) {
		txtTitle = findViewById(R.id.title)
		txtTitle.text = "屬性為非空，無須強轉"
	}
}
```

---

# 類別方法

有些方法的使用必須搭配類別

## infix

infix 方法是一種 **若且為若只有一個參數** 的方法
效果是可以像 **二元操作子** 那樣使用

```kotlin
class TeamMember {
	var point:Int = 0
	infix fun addPoint(p:Int) {
		this.point += p
	}
}

fun main() {
	val student = Student()
	student addPoint 2 // 二元操作方式
	println(student.point) // 2
}
```

## componentN

是 `operator` 方法的一種特別修飾字
以 `component` 開頭並且以自然數為結尾命名的方法
此類方法沒有任何參數，其主要目的從物件中提取對應的屬性值
**常用於物件的解構式中**

```kotlin
class Student(val name:String) {
	var height:Int = 0
	var weight:Int = 0
	
	operator fun component1():String = name
	
	operator fun component2():Int = height
	
	operator fun component3():Int = weight
}

fun main() {
	val peter = Student("Peter")
	peter.height = 180
	peter.weight = 70
	println(peter.component1()) // "Peter"
	println(peter.component2()) // 180
	
	// 解構式
	
	val (name, height, weight) = peter // 依照位置解構
	println(name) // "Peter"
	println(height) // 180
	println(weight) // 70
}
```

