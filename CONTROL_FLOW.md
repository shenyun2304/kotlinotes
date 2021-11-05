# 條件

## if 條件

語法 : 

```kotlin
if (條件) {
} else if(條件) {
} else {
}
```

## when 條件

##### when 宣告 (when-statement)

類似 java 的 switch-case 宣告

語法 :

```kotlin
when(變數) {
	條件一 -> 變數滿足條件一執行區塊
	條件二 -> 變數滿足條件二執行區塊
	else -> 其他條件執行區塊
}
```

**當使用 when 宣告的時候，`else` 區塊不可省略**

##### when 區塊 (when-block)

可以當作是加強的 if-else 語法

語法 :

```kotlin
when {
	條件一 -> 變數滿足條件一執行區塊
	條件二 -> 變數滿足條件二執行區塊
}
```

**當使用 when 區塊的時候，`else` 區塊非必要**

這種特性使得 when 區塊可以處理多個完全不相關的條件

例如

```kotlin
when {
	x + y == 5 -> println("x+y=5")
	age < 10 -> println("age under ten")
	else -> println("none of above") // 非必要
}
```


### when 使用展示

when 的條件可以有很多種宣告方式，比 switch-case 還要強很多

##### 基礎

```kotlin
when(lang) {
	"Java" -> "Java picked"
	"Kotlin" -> "Kotlin rocks"
	"Scala" -> "It's Scala"
	else -> "$lang selected"
}

```

##### 多值共結果

```kotlin
when(lang) {
	"Java", "Kotlin" -> "JVM base"
	"js", "ts" -> "V8 base"
	else -> "what is $lang"
}
```

##### 範圍

```kotlin
when(score) {
	in 90..100 -> "A"
	in 80..89 -> "B+"
	in 60..79 -> "B"
	!in 0..100 -> "score incorrect"
	else -> "F"
}
```

##### 型別

```kotlin
when(變數) {
	is Boolean -> "布林值"
	is Int -> "整數"
	is String -> "字串"
	else -> "其他型別"
}
```

##### 綜合應用

> ```kotlin
> fun testWhen(target:Any):String {
>   return when(target) {
>     0 -> "object equals match"
>     3, 10 -> "or match"
>     in 11..20 -> "range match"
>     is Date -> "type match"
>     !in 4..30 -> "range not match"
>     else -> "default"
>   }
> }
> testWhen(0) // "object equals match"
> testWhen(3) // "or match"
> testWhen(11) // "range match"
> testWhen(33) // "range not match"
> testWhen(Date()) // "type match"
> testWhen("whatever") // "default"
> ```

---

# 迴圈

kotlin 中迴圈宣告主要 `for` 和 `while`，和條件不同的是迴圈宣告不可當作表達式


## while

分為 while 與 do-while，用法和 java 相同

語法 :

```kotlin
while(條件) {
}

do {
} while(條件)
```

## for

kotlin 中的 for 很特別，沒有  `for(初始;條件;跌代)` 這種用法

注意是 **沒有!!**

語法 :

```kotlin
for (區域變數 in <Iterable>對象) {
}
```

### repeat

repeat 區塊單純是實現重複執行 n 次區塊內的程式，雖然同樣的功能也能用 for 或 while 實現，不過這種簡單的流程用 repeat 看起來更簡潔

語法 :

```kotlin
repeat(次數) {
}
```

---

# 迴圈標籤

可以在迴圈之前做標籤，給內部的 `continue` 或 `break` 使用

```kotlin
outer@
for(i in 1..3) {
	for(j in 11..13) {
		if (j % 2 == 0) {
			continue@outer
		}
	}
}
/**
i=1, j=11
i=2, j=11
i=3, j=11
*/
```