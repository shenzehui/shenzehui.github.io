---
title: Java并发 精选面试题🔥
tag: Java并发
category:
  - 面试题
  - Java
article: false
---

## ❄️ 基础

### 并行和并发有什么区别？

从操作系统的角度来看，线程是 CPU 分配的最小单位。

- 并行就是同一时刻，两个线程都在执行。这就要求有两个 CPU 去分别执行两个线程。
- 并发就是同一时刻，只有一个执行，但是一个时间段内，两个线程都执行了。并发的实现依赖于 CPU 切换线程，因为切换的时间特别短，所以基本对于用户是无感知的。

![image-20221201163934896](https://s1.vika.cn/space/2022/12/01/3cc9d3e8a2374e4fae81b69722547d03)

就好像我们去食堂打饭，并行就是我们在多个窗口排队，几个阿姨同时大菜；并发就是我们挤在一个窗口，阿姨给这个大一勺，又手忙脚乱地給那个打一勺。

![image-20221201164054406](https://s1.vika.cn/space/2022/12/01/029e8daf700e4c49b67ae62d209ceee1)

### 说说什么是进程和线程？

要说线程，必须得先说说进程。

- 进程：进程是代码在数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位。
- 线程：线程是进程的一个执行路径，一个进程中至少有一个线程，进程中的多个线程共享进程的资源。

操作系统在分配资源时把资源分配给进程的，但是 CPU 资源比较特殊，它是分配到线程的，因为真正要占用 CPU 运行的是线程，所以也说线程是 CPU 分配的基本单位。

比如在 Java 中，当我们启动 main 函数其实就启动了一个 JVM 进程，而 main 函数在线程就是这个进程中的一个线程，也称主线程。

![image-20221203111405719](https://s1.vika.cn/space/2022/12/03/96e6baae6f7f4b109cc47fc27a5136e2)

一个进程中有多个线程，多个线程共用进程的堆和方法区资源，但是每个线程都有自己的程序计数器和栈。

### 说说线程有几种创建方式？

Java 中创建线程主要有三种方式，分别为继承 Thread 类、实现 Runnable 接口、实现 Callable 接口

![image-20221203122717685](https://s1.vika.cn/space/2022/12/03/3de0a24fd1aa407ca50cabcd5a871c07)

- 继承 Thread 类，重写 run() 方法，调用 start() 方法启动线程

```java
public class ThreadTest {
    /**
    * 继承Thread类
    */
    public static class MyThread extends Thread {
        @Override
        public void run () {
            System.out.println("This is child thread") ;
        }
    }
    public static void main ( String [] args) {
        MyThread thread = new MyThread ();
        thread .start();
    }
}
```

- 实现 Runnable 接口，重写run()方法

```java
public class RunnableTask implements Runnable {
    public void run () {
        System.out.println("Runnable!");
    }
    public static void main ( String [] args) {
        RunnableTask task = new RunnableTask ();
        new Thread(task).start();
    }
}
```

上面两种都是没有返回值的，但是如果我们需要获取线程的执行结果，该怎么办呢？

- 实现 Callable 接口，重写 call() 方法，这种方法可以通过 FutureTask 获取任务执行的返回值

```java
public class CallerTask implements Callable<String> {
    public String call() throws Exception {
        return "Hello,i am running!";
    }
    public static void main(String[] args) {
        //创建异步任务
        FutureTask<String> task = new FutureTask<String>(new CallerTask());
        //启动线程
        new Thread(task).start();
        try {
            //等待执行完成，并获取返回结果
            String result = task.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

为什么调用 start() 方法时会执行 run() 方法，那怎么不直接调用 run() 方法？

JVM 执行 start 方法，会先创建一条线程，由创建出来的新线程去执行 Thread 的 run 方法，这才起到多线程的效果。

![image-20221201165601138](https://s1.vika.cn/space/2022/12/01/0840d8c4795549e7a148ad7eca92d752)

为什么我们不能直接调用 run() 方法？也很清楚，如果直接调用 Thread 的 run() 方法，那么 run 方法还是运行在主线程中，相当于顺序执行，就起不到多线程的效果。

### 线程有哪些常用的调度方法？

![image-20221201170822561](https://s1.vika.cn/space/2022/12/01/95527a1a93554d568b1782e2646001cb)

**线程等待与通知**

在 Object 类中有一些函数可以用于线程的等待与通知。

- wait()：但一个线程A 调用一个共享变量的 wait() 方法时，线程 A 会被阻塞挂起，发生下面几种情况才会返回：
  - （1）线程 A 调用了共享对象 notify() 或者 notifyAll() 方法；
  - （2）其他线程调用了线程 A 的 interrupt() 方法，线程 A 抛出 InterruptedException 异常返回。
- wait(long timeout)：这个方法相比 wait() 方法多了一个超时参数，它的不同之处在于，如果线程 A 调用共享对象的 wait(long timeout) 方法后，没有在指定的 timeout ms 时间内被其他线程唤醒，那么这个方法还是会因为超时而返回。
- wait(long timeout，int nanos)，其内部调用的是 wait(long timeout) 函数。

上面是线程等待的方法，而唤醒线程主要是下面两个方法：

- notify()：一个线程 A 调用共享对象的 notify() 方法后，会唤醒一个在这个共享变量上 wait 系列方法后被挂起的线程。一个共享变量上可能会有多个线程在等待，具体唤醒哪个等待的线程是随机的。
- notifyAll()：不同于在共享变量上调用 notify() 函数会唤醒被阻塞到该共享变量上的一个线程，notifyAll() 方法则会唤醒所有在该共享变量上由于调用 wait 系列方法而被挂起的线程。

Thread 类也提供了一个方法用于等待的方法：

- join()：如果一个线程 A 执行了 thread.join() 语句，其含义是：当期线程 A 等待 thread 线程终止之后才从 thread.join() 返回。

**线程休眠**

- sleep(long millis)：Thread 类中的静态方法，当一个执行中的线程 A 调用了 Thread 的 sleep 方法后，线程 A 会暂时让出指定时间的执行权，但是线程 A 所拥有的监视器资源，比如锁还是持有不让出的。指定的睡眠时间到了后该函数会正常返回，接着参与 CPU 的调度，获取到 CPU 资源后就可以继续执行。

**让出优先权**

- yeild()：Thread 类中的静态方法，当一个线程调用 yield 方法时，实际就是在暗示线程调度器当前线程请求让出自己的 CPU，但是线程调度器可以无条件忽略这个暗示。

**线程中断**

Java 中的线程中断是一种线程间的协作模式，通过设置线程的中断标志并不能直接终止该线程的执行，而是被中断的线程根据中断状态自行处理。

- void interrupt()：中断线程，例如，当线程 A 运行时，线程 B 可以调用线程 interrupt() 方法来设置线程的中断标志 true 并立即返回。设置标志仅仅是设置标志，线程 A 实际并没有被中断，会继续往下执行。
- boolean isInterrupt() 方法：检查当前线程是否被中断。
- boolean interrupted() 方法：检查当前线程是否被中断，与 isInterrupt() 不同的是，该方法如果发现当前线程被中断，则会清除中断标志。

### 线程有几种状态？

在 Java  中，线程共有六种状态：

| 状态         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| NEW          | 初始状态：线程被创建，但还没有调用 start() 方法              |
| BUNNABLE     | 运行状态：Java 线程将操作系统中的就绪和运行两种状态笼统的称作“运行” |
| BLOCKED      | 阻塞状态：表示线程阻塞干预                                   |
| WAITING      | 等待状态：表示线程进入等待状态，进入该状态表示当前线程需要等待其他线程做出一些特定动作（通知或中断） |
| TIME_WAITING | 超时等待状态：该状态不同于 WAITING，它是可以在指定的时间自行返回的 |
| TERMINATED   | 终止状态：表示当前线程已经执行完毕                           |

线程在自身的生命周期中，并不是固定地处于某个状态，而是随着代码的执行在不同的状态之间进行切换，Java 线程状态变化如图所示：

![image-20221201185353650](https://s1.vika.cn/space/2022/12/01/922402de50f7428b8badc7d31f1bda3a)

## 公众号

 ![](https://s1.vika.cn/space/2022/12/01/f1f467dd3b8e4984a50dce782aa346ff)
