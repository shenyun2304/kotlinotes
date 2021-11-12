# thread 方法

Kotlin 提拱高階方法 `thread()` 來簡化執行緒的創建過程

```kotlin
public fun thread(
	start:Boolean = true,
	isDaemon:Boolean = false,
	contextClassLoader:ClassLoader? = null,
	name:String? = null,
	priority:Int = -1,
	block:()->Unit
):Thread
```

- start : 創建後是否立刻啟動，預設值為 `true`
- isDaemon : 是否為守護執行緒，如果 JVM 中只剩守護執行緒，則主程式會停止，所以守護執行緒的流程可能不會被完整執行；如果是普通執行緒會在執行結束後主程式才會停止，預設是 `false`
- contextClassLoader : 類別載入器，用於載入執行緒需要的資源
- name : 執行緒名稱
- priority : 執行緒優先級，預設 5，最小 1，最大 10；數字越大表示越優先，但實際執行優先級取決於 OS
- block : 在 `run()` 方法中要運行的程式碼

```kotlin
// 創建即啟動
thread {
	println("我是新執行緒")
}

// 手動啟動
val thread = thread(start=false,isDaemon=true, name="t1") {
	println("我是手動執行緒")
}

thread.start() // 手動啟動
```

---

# Kotlin Coroutine

coroutine 是一個用來取代 thread 的函式庫
- 可以指定執行緒的執行 Scope
- 更靈活的操縱非同步執行緒
- google 翻譯叫 **"協程"**

## 依賴

maven : `org.jetbrains.kotlinx:kotlinx-coroutines-core:版本號`

## 創建協程

### `runBlocking` 方法

閉包內容的程式碼將會被以阻斷的方式執行，並且回傳閉包內容的最後一行執行結果

```kotlin
public fun<T> runBlocking(
	context:CoroutineContext = EmptyCoroutineContext,
	block: suspend CorourtineScope.()->T
):T
```

- context : 協程的上下文，決定執行緒的作用範圍
- block : 協程的具體內容程式碼閉包，注意此方法回傳的型別 `T` 和 block 區塊回傳的型別相同，也就是說創建協程的執行緒可以取得協程內執行的回傳值，**注意 block 會以 CoroutineScope 的擴展方法帶入，整個 block 程式內容範圍都處於 CoroutineScope 作用域之內**


```kotlin
fun main() {
	runBlocking {
		delay(1000)
		println("world")
	}
	println("hello")
}

/**
world
hello
*/
```

如果要將 main 方法就當作一個 CoroutineScope 可以這樣宣告

```kotlin
fun main() = runBlocking {
}
```


### `launch` 方法

方法內容的程式碼將會非同步執行，回傳包含該執行緒的操作類別 Job 的物件

```kotlin
public fun CoroutineScope.launch(
	context: CoroutineContext = EmptyCoroutineContext,
	start: CoroutineStart = CoroutineStart.DEFAULT,
	block: suspend CoroutineScope.()->Unit
):Job
```

- 此方法必須被執行於 CoroutineScope 範圍內 -> `CoroutineScope.launch`
- context : 協程的上下文，決定執行緒的作用範圍
- start : 創建後行為，預設 `CoroutineStart.DEFAULT` 為創建後立即啟動
- block : 協程的具體內容程式碼閉包

```kotlin
fun main(){
	GlobalScope.launch {
	// launch 必須在 CoroutineScope 範圍內才能執行，這裡指定在 GlobalScope 中執行
		 delay(1000)  
		 println("world")  
	}
	println("hello")
}

/**
hello
// 主執行緒已經結束，不會印出 world
*/
```

如果將 main 宣告為一個 CoroutineScope 並且 `launch` 也在這個範圍內執行，則會全部執行完畢

```kotlin
fun main() = runBlocking {
	launch {
		// 和 main 在同一個 CoroutineScope
		delay(1000)
		println("world")
	}
	println("hello")
}

/**
hello
(一秒)
world
*/
```

---

# Job 類別

`launch` 方法回傳的型別，該物件表示一個協程任務，可以透過以下方法控制協程運行

- `job.start()` : 啟動協程，如果協程創建時 start 選項設為 `CoroutineStart.LAZY`，則需要手動用此方法啟動
- `job.join()` : 呼叫的執行緒阻斷直到 job 執行結束
- `job.cancel()` : 取消指定任務，非同步執行
- `job.cancelAndJoin()` : 呼叫的執行緒阻斷直到任務真的被取消
- `delay()` : 可以使當前執行緒暫停

```kotlin
fun main() = runBlocking {
	val job1 = launch {
		delay(1000)
		println("協程 1 執行中")
	}
	job1.join()
	println("協程 1 執行結束")
	
	val job2 = launch {
		delay(1000)
		println("協程 2 執行中")
	}
	job2.cancel()
	
	delay(1200) // 暫停 1200，如果 job2 有被執行則會打印
	println("主程式結束")
}

/**
協程 1 執行中
協程 1 執行結束
主程式結束
*/
```


呼叫 `cancel()` 後協程並不會立刻被取消，而只是改變了協程的狀態，滿足特定條件協程才會被真正的取消

```kotlin
fun main() = runBlocking {  
	val job = launch {  
		 var i = 0  
		 while(i < 10) {  
		 	println("執行第 ${++i} 次")  
		 } 
	}  
	delay(1)  
	println("取消 job")  
	job.cancel()  
	println("主程式結束")  
}
/**
執行第 1 次
執行第 2 次
執行第 3 次
執行第 4 次
執行第 5 次
執行第 6 次
執行第 7 次
執行第 8 次
執行第 9 次
執行第 10 次
取消 job
主程式結束
*/
```

雖然呼叫了 `cancel` 方法，但是協程依然被執行完畢，因為整個 while 的執行過程是不可以被取消的，一旦執行，就會全部執行

## 協程狀態

協程是一個狀態機物件

協程內建三個屬性可以用來判斷狀態，而協程的狀態有分六種

#### 屬性

- isActive : 執行中
- isCompleted : 任務完成
- isCancelled : 任務被取消

#### 狀態

- `_New_` : 初始狀態 -> CoroutineStart.LAZY 創建，需手動啟動
- `_Active_` : 初始狀態 -> CoroutineStart.DEFAULT 預設，創建即啟動
- `_Completing_` : 過程狀態 -> 執行中
- `_Cancelling_` : 過程狀態 -> 取消中
- `_Cancelled_` : 完結狀態 -> 已被取消
- `_Completed_` : 完結狀態 -> 已完成

#### 屬性狀態表

狀態|isActive|isCompleted|isCancelled
:--|:--|:--|:--
`_New_`|false|false|false
`_Active_`|true|fasle|false
`_Completing_`|true|false|false
`_Cancelling_`|false|false|true
`_Cancelled_`|false|true|true
`_Completed_`|false|true|false

> 呼叫 `cancel` 方法或者在協程發生例外，該協程狀態會變成 `_Cancelling_`，協程一樣會繼續執行，結束後狀態會變成 `_Cancelled_`

### 可中斷方法

只要方法宣告時有 `suspend` 修飾，就屬於可中斷方法

這類方法只能運行在協程的作用域中，在其他地方呼叫編譯器都會直接報錯

當協程 isCancelled 屬性為 true 的時候，呼叫可中斷方法都會拋出 `CancellationException` 例外，所以這類方法可以被用於即時取消協程任務的場景

內建可中斷方法有 :

- `delay`
- `yeild`


## 立即取消任務

1. 在閉包中穿插檢查邏輯

```kotlin
fun main() = runBlocking {
	val job = launch {
		var i = 0
		while(isActive && i < 15) {
			// 當狀態是 _Cancelling_ 的時候就會跳出 -> isActive = false
			println("執行 ${++i} 次")
		}
	}
	job.cancel()
}
```

2. 呼叫 `yield()` 方法

```kotlin
fun main() = runBlocking {
	var i = 0
	while(i < 15) {
		yield() // 如果狀態 isActive = false 就會跳出
		println("執行 ${++i} 次")
	}
}
```

### finally 區塊

在協程中如果用 `try-catch-finally` 包住可中斷方法

當可中斷方法拋出例外的時候，`finally` 區塊一樣會執行

```kotlin
fun main() = runBlocking {
	val job = launch {
		try {
			repeat(1000) {
				println("執行第 $it 次")
				delay(20) // 可中斷方法
			}
		} finally {
			println("finally 被呼叫")
		}
	}
	delay(1000)
	println("等待協程取消")
	job.cancelAndJoin()
	println("主程式結束")
}
```

要注意一點，如果在 finally 區塊裡又呼叫了可中斷方法，這時候因為協程狀態已經是取消了，所以這時候會從 finally 裡面再噴出例外，如果可中斷方法後還有程式碼，則不會執行

```kotlin
try {
	//...
} finally {
	println("finally 被呼叫")
	yeild() // 這邊就會再次噴出例外
	println("finally 可中斷方法之後的程式碼") // <-- 這段不會被執行
}
```

如果 finally 區塊中的程式碼非常重要，一定要完整執行，則需要在 finally 區塊中使用 `withContext()` 方法將 Context 切換到 `NonCancellable` 

```kotlin
try {
	//...
} finally {
	withContext(NonCancellable) {
		println("finally 被呼叫")
		yeild() // <-- 這裡不會噴出例外
		println("finally 可中斷方法之後的程式碼") // <-- 這裡會執行到
	}
}
```

## 超時取消任務

如果任務執行超過設定的時常，則取消任務

1. 用 `withTimeout(時間)` 方法閉包

```kotlin
withTimeout(1300) {
	repeat(1000) {
		println("執行第 $it 次")
		delay(500)
	}
}

/**
執行第 0 次
執行第 1 次
執行第 2 次
Exception in thread "main" kotlinx.coroutines.TimeoutCancallationException:
Timedout waiting for 1300 ms
*/
```

2. 如果要在任務被取消後進行邏輯處理，可以用 `withTimeoutOrNull(時間)` 方法閉包
	如果閉包內超過設定時間則會回傳 null
	
```kotlin
val timeout? = withTimeoutOrNull {
	repeat(1000) {
		println("執行第 $it 次")
		delay(500)
	}
	
	println(timeout)
}

/**
執行第 0 次
執行第 1 次
執行第 2 次
null
*/
```

---

# async 方法

```kotlin
public fun <T> CoroutineScope.async(
	context: CoroutineContext = EmptyCoroutineContext,
	start: CoroutineStart = CoroutineStart.DEFAULT,
	block: suspend CoroutineScope.()->T
): Deferred<T>
```

`async` 和 `launch` 的差異

- `launch` 回傳的是單純的 job 物件
- `async` 回傳的是 Deferred 並且包含內容執行結果的物件，Deferred 是 Job 的子類別
	- 呼叫 `await()` 方法可以等待並取得執行結果

如果多個任務之間沒有依賴關係，可以使用 async 來提高執行效率

```kotlin
fun main() = runBlocking {
	val duration = measureTimeMillis {
		val action1: Deferred<Int> = async { getNumber1() }
		val action2: Deferred<Int> = async { getnumber2() }
		println("a1: ${action1.await()}, a2:${action2.await()}")
	}
	println("耗時: $duration")
}

/**
a1: 1, a2:2
耗時: 2026
*/

suspend fun getNumber1():Int {
	delay(1000)
	return 1
}

suspend fun getNumber2():Int {
	delay(2000)
	return 2
}
```

# await 方法

取得 Deferred 類別物件的回傳值
如果等待過程中該任務被取消，則呼叫此方法會拋出 `CancellationException`

## awaitAll

如果要等待很多非同步的協程結束並取得回傳值，可以使用 awaitAll 方法，每一個協成的回傳值會被包在一個 List 的集合中

```kotlin
val action1: Deferred<Int> = async { getNumber1() }
val action2: Deferred<Int> = async { getnumber2() }

val resultList:List<Int> = awaitAll(action1, action2)
println(resultList) // [1,2]
```

---

# 前後文 (Context)

CoroutineContext 代表著協程的前後文範圍

- 不指定 : 和外部 CoroutineContext 相同 Context
- `Dispatchers.Default` : 使用 JVM 的 ForkJoinPool 來調度協程
- `Dispatchers.Unconfined` : 不具體指定 Context，協程會在乎叫的外部執行緒中執行，如果執行中這個協程被中斷，則恢復外部執行緒中原來執行到的地方
- `Dispatchers.Main` : 平台的 Context，對於 Android 來說就是 UI thread
- `Dispatchers.IO` : 背景 IO 操作的 Context
- 自定義 Context : 在自定義的 ThreadPool 中執行
	```kotlin
	val executor:ExecutorService = Executors.newSingleThreadExecutor {
		Thread("thread-1")
	}
	
	val dispatcher = executor.asCoroutineDispatcher()
	val job = launch(dispatcher) {
		println("協程執行 Context:${Thread.currentThread().name}")
	}
	job.join()
	// 協程執行 Context:thread-1
	```
	
---

# 作用域

在一個協程中啟動一個和原協程相同作用域的新協程時，這兩個協程就形成了父子協程

- 取消父協程可以立即取消子協程
- 子協程中拋出例外會導致父協程被取消
- 可以取消子協程而不影響父協程
- 在呼叫父協程的 `join` 方法後，會等待此協程所有子協程執行完畢才回傳
- 通過 **GlobalScope** 執行的協程為獨立狀態，**不會和外部協程形成父子關係**

```kotlin
fun main() = runBlocking {
	val job = launch {
		launch {
			println("子協程1 開始")
			delay(700)
			throw RuntimeException()
			println("子協程1 結束")
		}
		launch {
			println("子協程2 開始")
			delay(1000)
			println("子協程2 結束")
		}
	}
	
	job.join()
	println("主程式結束")
}

/**
子協程1 開始
子協程2 開始
Exception in thread "main" java.lang.RuntimeException
*/
```
> 一個子協程拋出例外，整個父協程都被取消

---

# debug

非同步程式 debug 有時候很麻煩，kotlin 提供了 `-Dkotlinx.coroutines.debug` 這個 JVM 參數，讓呼叫 `Thread.currentThread().name` 的時候可以待有多一點的協程資訊

```kotlin
fun main() = runBlocking {  
	async {  
		println("none:${Thread.currentThread().name}")  
	}  

	async(CoroutineName("my routine")) {  // 給協程命名 
		println("named:${Thread.currentThread().name}")  
	}  

	async (Dispatchers.IO) {  
		println("io:${Thread.currentThread().name}")  
	}  

	delay(3000)  
	println("主程式結束")  
}
```

以上的程式如果再 **沒有使用** JVM 參數 kotlinx.coroutines.debug 的時候顯示

```
io:DefaultDispatcher-worker-2
none:main
named:main // 沒指定 Context -> 和外部相同 Context:main
主程式結束
```

使用了 JVM 參數 kotlinx.coroutines.debug

```
io:DefaultDispatcher-worker-1 @coroutine#4
none:main @coroutine#2 // 沒指定也會有特別的別名做區隔
named:main @my routine#3 // 一樣是 main 但是可以看到協程別名
主程式結束
```

