# 原始碼檔案

以 `.kt` 為結尾的檔案，經過 `kotlinc` 編譯後產生 `.class` 檔

---

# 語法

- 預設不需要 `;` 做結尾，除非將多行程式寫在同一行
- `main` 方法為程式進入點，預設為含參數方法 `main(args:ArrayList<String>)`，如果不需要處理指令參數則也可以省略參數宣告，如 `main()`
- Kotlinc 編譯原則是將檔名當成一個 class，所有在原始碼中宣告的類別都是此類別的內部類別，預設 class 名稱是`檔名+Kt`，如 `HelloWorld.kt` -> `HelloWorldKt.class`

---

# 變數宣告

- 格式 : `var/val 變數名稱:型別`
- `var` : 表示此變數為可異動變數
- `val` : 表示此變數為不可異動變數 (常數)

```kotlin
val DEPARTMENT = "CSO"
DEPARTMENT = "PDT" // <-- error
var version:String = ""
version = "v3"
```

---

# 型別

所有型別都是參考型別
> 沒有 java 中的 primitive type

### 整數

`Int`、`Long`、`Short` 長度分別為 32 、64、16 位元

> 長整數的宣告只允許使用大寫 `L`

### 位元組

`Byte` 長度為 8 位元

### 布林值

`Boolean` 長度為 1 位元

### 浮點數

`Float`、`Double` 長度分別為 32、64 位元

### 字元

`Char` 長度為 16 位元

### 字串

`String`

##### 字串模板

在 `""` 之間如果需要呼叫變數，可以使用 `$變數名稱` 或者 `${變數.屬性名稱}`來將成員嵌入字串中

> 不需要像 java 有那麼多字串串接的貓毛

如果要串接錢字號 `$`，則需要使用字面值宣告 `${'$'}` 來使用

##### 多行文字

在三個雙引號之間的文字會被視為多行文字

> 不需要像 java 一樣 + 來 + 去

```kotlin
"""
第一行
第二行
第三行
""";
```

---

# 空值

所有變數預設**不可為空!!!**

### 空值宣告

如果某變數確實可能為空，那必須將此變數宣告為**可空狀態**

##### 可空狀態

在變數宣告的型別後方加上問號 `?` 來表示此變數可能為空值

編譯器對可不可空變數的處理不同，編譯器對於不同狀態的變數有不同的處理方式

在編譯期就可以比較安全的撰寫程式

同一個型別可不可空是兩種不同的狀態，即 : `String?` 與 `String` 是不同的

##### 安全操作

###### 阻擋呼叫

呼叫可空狀態的變數時，如果該變數真的是空值，則不會繼續往下呼叫，避免噴出 NullPointerException

```kotlin
var nullString:String?
println(nullString?.length) // <-- 不會真的去呼叫 length : 不會噴錯
```

###### 阻擋賦值

可空變數不可賦值給非空變數，編譯器會直接報錯，就算該可空變數不為空

```kotlin
var nullString:String? = "123"
var s:String = nullString // <-- error
var l:Int = nullString?.length // <-- error
```

###### 強制非空

要將可空變數強制當作非空存取，可以使用 `!!` 符號

> 設計上盡量避免這樣使用

```kotlin
var nullString:String? = "123"
var s:String = nullString!! // <-- it's ok, but not recommand
```

---

# 最大父類別

`Any`

類似 java 中的 `Object` 類別，但是少了一些方法

是所有類別的父類別

---

# 最小子類別

`Nothing`

和 `Any` 相反，是所有類別的子類別

> 就算你不想要，他一定是你的子類別

---

# "無" 型別

`Unit`

就是 void

---

# 型別轉換

### 直接賦值不會自動轉換

```kotlin
var b:Byte = 1
var i:Int = b // <-- error
```

### 運算會自動想上轉型

```kotlin
var i:Int = 100
var d:Double = 20.0
val result:Double = i - d // it's ok
```

### 強制轉型

使用 `as` 可以強制轉型

```kotlin
var b:Byte = 1
var i:Int = b as Int
```

### 安全轉型

使用 `as?` 配上可空宣告來達成安全轉換，如果轉換錯誤或者無法轉換

該變數就為空

```kotlin
var number:Int? = "foo" as? Int // number 是空，但不會噴錯
```

### 判定後自動轉換

使用 `is` 判定後的區塊內該變數會自動轉換成判定的型別

```kotlin
var foo:Any = "I am a string"

if (foo is String) {
  println(foo.toUpperCase()) // <-- 區塊內 foo 就當作是 String 型別，可以呼叫該型別的方法
}
```

---

# 表達式

在 kotlin 中只要看到某些**操作子可以做表達式使用**

表示該操作子可以寫在賦值操作符 `=` 的右方

最後會回傳該表達式的最後一行執行結果，且不需要 `return` 關鍵字

例如 : 
```kotlin
val s = if (true) "Hello" else "Kotlin" // s = "Hello"
val s2 = if(false) {
  "Hello"
} else {
  "Kotlin"
} // s2 = "Kotlin"
```