# 動機

- 減少開發速度
- 提高程式穩定度

### 開發速度

開發速度與穩定度是相對互斥的兩個方向，在 Java 中提高穩定度可以使用框架或者決定團隊的 coding style 來處理這件事

相對的開發者就必須要符合框架規則或者熟悉團隊規定的 coding style，這樣的做法很可能就會造成開發速度降低

### 程式穩定性

追求開發速度，很多事情就只能睜一隻眼閉一隻眼的放過，反正功能先出來，優化之後做

但是需求會一直來，根本不會有時間做優化，導致債築高牆，堆到某個程度也沒人可以改

最後就成為補丁般的程式，各種問題只能人工上線針對個案處理

---

# 預備知識

具備以下知識有助於更滑順的理解此份報告內容

- 任何一款靜態語言
- Java 8+
- TypeScript

---

# 選擇條件

Koltin 的程式結構比 Java 簡潔，但是語言特性上比卻比 Java 嚴謹，想較於其他語言而言，對 incrte 來說可以算是有機會同時提升開發速度與穩定性的語言

- Kotlin 可以幫助開發者在撰寫程式碼時，比較容易注意到可能發生 NullPointer 的地方，但是又不需要一直在那邊 if null

  kotlin
  ```kotlin
  var s:String? = null
  println("string length:${s?.length}")
  ```

  java
  ```java
  String s = null;
  if (null != s) {
    System.out.println("string length:"+s.length());
  } else {
    System.out.println("string length:null");
  }
  ```
- 支援 High Order Function : 可以撰寫更靈活的程式碼，在 Java 上要實現需要做很多工

  kotlin
  ```kotlin
  var intOpt = fun(x:Int, y:Int, f:(Int,Int)->Int):Int = f(x,y)
  var optAdd = fun(x:Int, y:Int):Int = x + y
  val result = intOpt(1,2, optAdd)
  println(result)
  ```
  java
  ```java
  public class MainJava {
      public static Integer intOpt(Integer x, Integer y, BiFunction<Integer, Integer, Integer> f) {
          return f.apply(x, y);
      }
      public static void main(String[] args) {
          BiFunction<Integer, Integer, Integer> f = (x,y)->x+y;
          Integer result = intOpt(1,2, f);
          System.out.println(result);
      }
  }
  ```
  > java: 微臣辦不到啊。。。


- 兼容 Java : 編譯後產生 class 檔一樣跑在 JVM 上，程式上也能和 Java 互相呼叫，對目前 incrte 技術親合度很高
  
  kotlin (承接上例)
  ```kotlin
  val result = MainJava.intOpt(1,2, { x, y -> x+y })
  println(result)
  ```