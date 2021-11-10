# 全是 RuntimeException

Kotlin 沿用 Java 例外處理機制，所有例外都是 Throwable 的子類別
和 Java 不同的是

### Kotlin 沒有強制例外檢查機制，**所有的例外都是 RuntimeException**

開發者需要自行決定是否要對例外進行捕捉

# 例外捕捉

## `try-catch-finally` 區塊

和 Java 一模一樣

# try 表達式

`try-catch-finally` 也可以當作表達式
需要注意的是，當作表達式的時候，`finally` 會執行，但是回傳值會忽略，**不會賦值給變數**

```kotlin
val err = try {
	1 / 0 // 除以 0
} catch(e:ArithmeticException) {
	e.printStackTrace()
	-1 // 回傳 -1
} finally {
	println("finally execute")
	-2 // 回傳 -2
}

println("err=$err")

/**
java.lang.ArithmeticException: / by zero
	at MainKt.main(Main.kt:193)
	at MainKt.main(Main.kt)
execute finally // finally 還是會執行
err = -1 // finally 回傳的 -2 被忽略，被賦予 catch 中的 -1
*/

```

如果沒有 catch 到的 Exception，`finally` 區塊還是會執行的，不過會在賦值的地方噴出例外，就不會往下執行

```kotlin
val err = try {  
 	1 / 0  
} finally {  
 	println("execute finally")  
 -2  
}  
  
println("err = $err")

/**
execute finally
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at MainKt.main(Main.kt:193)
	at MainKt.main(Main.kt)
*/

```

