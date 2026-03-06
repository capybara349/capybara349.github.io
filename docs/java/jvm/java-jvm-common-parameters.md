---
title: Java 常用 JVM 参数
tags:
  - JVM
---

## 调优堆栈内存

### **堆栈大小典型配置参数**

| 配置参数 | 说明 | 示例 |
| -------------- | -------------- | -------------- | 
| `-Xmx` | 设置最大堆大小。 | `-Xmx3550m`，设置JVM最大可用内存为3550 MB。 |
| `-Xms` | 设置JVM初始内存。 | `-Xms3550m`，设置JVM初始内存为3550 MB。此值建议与`-Xmx`相同，避免每次垃圾回收完成后JVM重新分配内存。 |
| `-Xmn` | 设置年轻代大小。 | `-Xmn2g`，设置年轻代大小为2 GB。整个JVM内存大小=年轻代大小+年老代大小+持久代大小。持久代一般固定大小为64 MB，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun官方推荐配置为整个堆的3/8。 |
| `-Xss` | 设置线程的栈大小。 | `-Xss128k`，设置每个线程的栈大小为128 KB。说明：JDK 5.0版本以后每个线程栈大小为1 MB，JDK 5.0以前版本每个线程栈大小为256 KB。请依据应用的线程所需内存大小进行调整。在相同物理内存下，减小该值可以生成更多的线程。但是操作系统对一个进程内的线程个数有一定的限制，无法无限生成，一般在3000个~5000个。  |
| `-XX:NewRatio=n` | 设置年轻代和年老代的比值。 |`-XX:NewRatio=4`，设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。如果设置为4，那么年轻代与年老代所占比值为1:4，年轻代占整个堆栈的1/5。 |
| `-XX:SurvivorRatio=n` | 年轻代中Eden区与两个Survivor区的比值。 | `-XX:SurvivorRatio=4`，设置年轻代中Eden区与Survivor区的大小比值。如果设置为4，那么两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6。|
| `-XX:MaxPermSize=n` | 设置持久代大小。 | `-XX:MaxPermSize=16m`，设置持久代大小为16 MB。|
| `-XX:MaxTenuringThreshold=n` | 设置垃圾最大年龄。 | `-XX:MaxTenuringThreshold=0`，设置垃圾最大年龄。 如果设置为0，那么年轻代对象不经过Survivor区，直接进入年老代。对于年老代比较多的应用，提高了效率。如果将此值设置为较大值，那么年轻代对象会在Survivor区进行多次复制，增加了对象在年轻代的存活时间，增加在年轻代即被回收的概率。|

### **吞吐量优先的GC典型配置参数**

| 配置参数 | 说明 | 示例 |
| -------------- | -------------- | -------------- | 
| `-XX:+UseParallelGC` | 选择垃圾收集器为并行收集器。 | `-Xmx3800m -Xms3800m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20`，`-XX:+UseParallelGC`此配置仅对年轻代有效，即在示例配置下，年轻代使用并发收集，而年老代仍旧使用串行收集。 |
| `-XX:ParallelGCThreads` | 配置并行收集器的线程数，即同时多少个线程一起进行垃圾回收。说明：此值建议配置与处理器数目相等。 | `-Xmx3800m -Xms3800m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20`，`-XX:ParallelGCThreads=20`表示配置并行收集器的线程数为20个。 |
| `-XX:+UseParallelOldGC` | 配置年老代垃圾收集方式为并行收集。说明：JDK 6.0支持对年老代并行收集。 | `-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20 -XX:+UseParallelOldGC`，`-XX:+UseParallelOldGC`表示对年老代进行并行收集。 |
| `-XX:MaxGCPauseMillis` | 设置每次年轻代垃圾回收的最长时间，如果无法满足此时间，JVM会自动调整年轻代大小，以满足此值。 | `-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:MaxGCPauseMillis=100`，`-XX:MaxGCPauseMillis=100`设置每次年轻代垃圾回收的最长时间为100 ms。 |
| `-XX:+UseAdaptiveSizePolicy` | 设置此选项后，并行收集器自动选择年轻代区大小和相应的Survivor区比例，以达到目标系统规定的最低响应时该间或者收集频率，该值建议使用并行收集器时，并且一直打开。 |-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:MaxGCPauseMillis=100 -XX:+UseAdaptiveSizePolicy |

### **响应时间优先的GC典型配置参数**

| 配置参数 | 说明 | 示例 |
| -------------- | -------------- | -------------- | 
| `-XX:+UseConcMarkSweepGC` | 设置年老代为并发收集。说明：配置了`-XX:+UseConcMarkSweepGC`，建议年轻代大小使用`-Xmn`设置。 | `-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC` |
| `-XX:+UseParNewGC` | 设置年轻代为并行收集。可与CMS收集同时使用。JDK 5.0以上版本，JVM根据系统配置自行设置，无需再设置此值。 | `-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC` |
| `-XX:CMSFullGCsBeforeCompaction` | 由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。 | `-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseConcMarkSweepGC -XX:CMSFullGCsBeforeCompaction=5 -XX:+UseCMSCompactAtFullCollection`，`-XX:CMSFullGCsBeforeCompaction=5`，表示运行GC5次后对内存空间进行压缩、整理。 |
| `-XX:+UseCMSCompactAtFullCollection` | 打开对年老代的压缩。说明：该值可能会影响性能，但是可以消除碎片。 | `-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseConcMarkSweepGC -XX:CMSFullGCsBeforeCompaction=5 -XX:+UseCMSCompactAtFullCollection` |

### **用于辅助的GC典型配置参数**

| **配置参数** | **说明** | 
| -------------- | -------------- | 
| `-XX:+PrintGC` | 用于输出GC日志。 | 
| `-XX:+PrintGCDetails` | 用于输出GC日志详情。 |
| `-XX:+PrintGCTimeStamps` | 用于输出GC时间戳（JVM启动到当前日期的总时长的时间戳形式）。示例如下：`0.855: [GC (Allocation Failure) [PSYoungGen: 33280K->5118K(38400K)] 33280K->5663K(125952K), 0.0067629 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]` |
| `-XX:+PrintGCDateStamps` | 用于输出GC时间戳（日期形式）。示例如下：`2022-01-27T16:22:20.885+0800: 0.299: [GC pause (G1 Evacuation Pause) (young), 0.0036685 secs]` |
| `-XX:+PrintHeapAtGC` | 在进行GC前后打印出堆的信息。 |
| `-Xloggc:../logs/gc.log` | 日志文件的输出路径。 |

## JVM内存配置最佳实践

如果JVM堆空间大小设置过大，可能会导致Linux系统的OOM Killer被激活，进而结束（kill）Java应用进程，在容器环境下可能会表现为频繁异常重启。本文介绍在容器环境下JVM堆参数的配置建议，以及OOM的相关常见问题。

### 通过-XX:MaxRAMPercentage限制堆大小（推荐）

- 在容器环境下，Java只能获取服务器的配置，无法感知容器内存限制。您可以通过设置`-Xmx`来限制JVM堆大小，但该方式存在以下问题：
    -   当规格大小调整后，需要重新设置堆大小参数。
    -   当参数设置不合理时，会出现应用堆大小未达到阈值但容器OOM被强制关闭的情况。
        > **说明** 应用程序出现OOM问题时，会触发Linux内核的OOM Killer机制。该机制能够监控占用过大内存，尤其是瞬间消耗大量内存的进程，然后它会强制关闭某项进程以腾出内存留给系统，避免系统立刻崩溃。

- 推荐的JVM参数设置。

```shell
-XX:+UseContainerSupport -XX:InitialRAMPercentage=70.0 -XX:MaxRAMPercentage=70.0 -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/home/admin/nas/gc-${POD_IP}-$(date '+%s').log -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/nas/dump-${POD_IP}-$(date '+%s').hprof
```

| **参数** | **说明** |
| -------------- | -------------- | 
| `-XX:+UseContainerSupport` | 使用容器内存。允许JVM从主机读取cgroup限制，例如可用的CPU和RAM，并进行相应的配置。当容器超过内存限制时，会抛出OOM异常，而不是强制关闭容器。 |
| `-XX:InitialRAMPercentage` | 设置JVM使用容器内存的初始百分比。建议与`-XX:MaxRAMPercentage`保持一致，推荐设置为70.0。 |
| `-XX:MaxRAMPercentage` | 设置JVM使用容器内存的最大百分比。由于存在系统组件开销，建议最大不超过75.0，推荐设置为70.0。 |
| `-XX:+PrintGCDetails` | 输出GC详细信息。 |
| `-XX:+PrintGCDateStamps` | 输出GC时间戳。日期形式，例如2019-12-24T21:53:59.234+0800。 |
| `-Xloggc:/home/admin/nas/gc-${POD_IP}-$(date '+%s').log` | GC日志文件路径。需保证Log文件所在容器路径已存在，建议您将该容器路径挂载到NAS目录或收集到SLS，以便自动创建目录以及实现日志的持久化存储。 |
| `-XX:+HeapDumpOnOutOfMemoryError` | JVM发生OOM时，自动生成Dump文件。 |
| `-XX:HeapDumpPath=/home/admin/nas/dump-${POD_IP}-$(date '+%s').hprof` | Dump文件路径。需保证Dump文件所在容器路径已存在，建议您将该容器路径挂载到NAS目录，以便自动创建目录以及实现日志的持久化存储。 |

> 说明 ：
> -   使用`-XX:+UseContainerSupport`参数需JDK 8u191+、JDK 10及以上版本。
> -   JDK 11版本下日志相关的参数`-XX:+PrintGCDetails`、`-XX:+PrintGCDateStamps`、`-Xloggc:$LOG_PATH/gc.log`参数已废弃，请使用参数`-Xlog:gc:$LOG_PATH/gc.log`代替。
> -   Dragonwell 11不支持`${POD_IP}`变量。
> -   如果您没有将/home/admin/nas容器路径挂载到NAS目录，则必须保证该目录在应用启动前已存在，否则将不会产生日志文件。

### 通过-Xms -Xmx限制堆大小

您可以通过设置`-Xms`和`-Xmx`来限制堆大小，但该方式存在以下两个问题：

-   当规格大小调整后，需要重新设置堆大小参数。

-   当参数设置不合理时，会出现应用堆大小未达到阈值但容器OOM被强制关闭的情况。
    > 说明： 应用程序出现OOM问题时，会触发Linux内核的OOM Killer机制。该机制能够监控占用过大内存，尤其是瞬间消耗大量内存的进程，然后它会强制关闭某项进程以腾出内存留给系统，避免系统立刻崩溃。

- 推荐的JVM参数设置。

```shell
-Xms2048m -Xmx2048m -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:/home/admin/nas/gc-${POD_IP}-$(date '+%s').log -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/nas/dump-${POD_IP}-$(date '+%s').hprof
```

参数说明如下。

| **参数** | **说明** |
| -------------- | -------------- | 
| `-Xms` | 设置JVM初始内存大小。建议与`-Xmx`相同，避免每次垃圾回收完成后JVM重新分配内存。 |
| `-Xmx` | 设置JVM最大可用内存大小。为避免容器OOM，请为系统预留足够的内存大小。 |
| `-XX:+PrintGCDetails` | 输出GC详细信息。 |
| `-XX:+PrintGCDateStamps` | 输出GC时间戳。日期形式，例如2019-12-24T21:53:59.234+0800。 |
| `-Xloggc:/home/admin/nas/gc-${POD_IP}-$(date '+%s').log` | GC日志文件路径。需保证Log文件所在容器路径已存在，建议您将该容器路径挂载到NAS目录或收集到SLS，以便自动创建目录以及实现日志的持久化存储。 |
| `-XX:+HeapDumpOnOutOfMemoryError` | JVM发生OOM时，自动生成Dump文件。 |
| `-XX:HeapDumpPath=/home/admin/nas/dump-${POD_IP}-$(date '+%s').hprof` | Dump文件路径。需保证Dump文件所在容器路径已存在，建议您将该容器路径挂载到NAS目录，以便自动创建目录以及实现日志的持久化存储。 |

- 推荐的堆大小设置。

| **内存规格大小** | **JVM堆大小** |
| -------------- | -------------- | 
| 1 GB | 600 MB |
| 2 GB | 1434 MB |
| 4 GB | 2867 MB |
| 8 GB | 5734 MB |


### 常见问题

#### 容器出现137退出码的含义是什么？

当容器使用内存超过限制时，会出现容器OOM，导致容器被强制关闭。此时业务应用内存可能并未达到JVM堆大小上限，所以不会产生Dump日志。建议您调小JVM堆大小的上限，为容器内其他系统组件预留足够多的内存空间。

#### 为什么发生OOM却没有生成Dump文件？

当发生OOM Killer时，并不一定会发生JVM OOM，所以不会生成Dump文件。您可以采取以下方式来避免这种情况。

-   如果是Java应用，可以适当调小JVM的堆内存大小。具体配置，请参见本文。

-   如果是非Java应用，可以调整实例规格，保证充裕的内存资源。

#### 堆大小和规格内存的参数值可以相同吗？

不可以。因为系统自身组件存在内存开销，所以不能将JVM堆大小设置为和规格内存大小相同的数值，需要为这些系统组件预留足够的内存空间。

#### 在JDK 8版本下设置-XX:MaxRAMPercentage值为整数时报错怎么处理？

这是JDK 8的一个Bug。具体信息，请参见[Java Bug Database](https://bugs.java.com/bugdatabase/view_bug?bug_id=8219312)。例如，在JDK 8u191版本下，设置`-XX:MaxRAMPercentage=70`，此时JVM会启动报错。

解决方案如下：

- 方式一：设置`-XX:MaxRAMPercentage`为`70.0`

  >如果您使用了`-XX:InitialRAMPercentage`或`-XX:MinRAMPercentage`，参数值同样不可设置为整数，需按照方式一的形式来设置。

- 方式二：升级JDK版本至JDK 10及以上版本。

#### 为什么JVM参数设置了6 GB，但是内存使用率却很低？

虽然JVM参数已设置`-Xms6g -Xmx6g`，但是操作系统不会马上分配6 GB的物理内存，需要实际使用后才分配。因此，内存使用率在应用启动的时候，会相对较低，后续会出现攀爬现象。