---
title: 分布式锁
categories: ['design', 'distributed']
tags: ['design', 'distributed', 'lock']
date: 2019-06-04 23:42
---

# 分布式锁

Java 原生 API 虽然有并发锁，但并没有提供分布式锁的能力，所以针对分布式场景中的锁需要解决的方案。

分布式锁的解决方案大致有以下几种：

- 基于数据库实现
- 基于缓存（redis，memcached 等）实现
- 基于 Zookeeper 实现 ✅

> 注：推荐基于 ZooKeeper 实现分布式锁，具体原因看完本文即可明了。

## 分布式锁思路

分布式锁的总体思路大同小异，仅在实现细节上有所不同。

分布式锁的主要思路如下：

1. **互斥** - 创建锁必须是唯一的，表现形式为向数据存储服务器或容器插入一个唯一的 key，一旦有一个线程插入这个 key，其他线程就不能再插入了。
2. 避免永远不释放锁 - 数据库分布式锁和缓存分布式锁（Redis）的思路都是引入超时机制，即成功申请锁后，超过一定时间，锁失效（删除 key），原因在于它们无法感知申请锁的客户端节点状态。而 ZooKeeper 由于其 znode 以目录、文件形式组织，天然就存在物理空间隔离，只要 znode 存在，即表示客户端节点还在工作，所以不存在这种问题。
3. 容错（只要大部分 redis 节点创建了这把锁就可以）

## 数据库分布式锁

### 具体实现

（1）创建表

```sql
CREATE TABLE `methodLock` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `method_name` varchar(64) NOT NULL DEFAULT '' COMMENT '锁定的方法名',
  `desc` varchar(1024) NOT NULL DEFAULT '备注信息',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '保存数据时间，自动生成',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uidx_method_name` (`method_name `) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='锁定中的方法';
```

（2）获取锁

想要锁住某个方法时，执行以下 SQL：

```sql
insert into methodLock(method_name,desc) values (‘method_name’,‘desc’)
```

因为我们对 `method_name` 做了唯一性约束，这里如果有多个请求同时提交到数据库的话，数据库会保证只有一个操作可以成功，那么我们就可以认为操作成功的那个线程获得了该方法的锁，可以执行方法体内容。

成功插入则获取锁。

（3）释放锁

当方法执行完毕之后，想要释放锁的话，需要执行以下 Sql:

```sql
delete from methodLock where method_name ='method_name'
```

### 问题

- 这把锁强依赖数据库的可用性。如果数据库是一个单点，一旦数据库挂掉，会导致业务系统不可用。
- 这把锁没有失效时间，一旦解锁操作失败，就会导致锁记录一直在数据库中，其他线程无法再获得到锁。
- 这把锁只能是非阻塞的，因为数据的 insert 操作，一旦插入失败就会直接报错。没有获得锁的线程并不会进入排队队列，要想再次获得锁就要再次触发获得锁操作。
- 这把锁是非重入的，同一个线程在没有释放锁之前无法再次获得该锁。因为数据中数据已经存在了。

### 解决办法

- 单点问题可以用多数据库实例，同时塞 N 个表，N/2+1 个成功就任务锁定成功
- 写一个定时任务，隔一段时间清除一次过期的数据。
- 写一个 while 循环，不断的重试插入，直到成功。
- 在数据库表中加个字段，记录当前获得锁的机器的主机信息和线程信息，那么下次再获取锁的时候先查询数据库，如果当前机器的主机信息和线程信息在数据库可以查到的话，直接把锁分配给他就可以了。

### 小结

- 优点: 直接借助数据库，容易理解。
- 缺点: 会有各种各样的问题，在解决问题的过程中会使整个方案变得越来越复杂。操作数据库需要一定的开销，性能问题需要考虑。

## Redis 分布式锁

相比于用数据库来实现分布式锁，基于缓存实现的分布式锁的性能会更好一些。目前有很多成熟的分布式产品，包括 Redis、memcache、Tair 等。这里以 Redis 举例。

### 实现思路

这个分布式锁有 3 个重要的考量点：

1. 互斥（只能有一个客户端获取锁）
2. 不能死锁
3. 容错（只要大部分 redis 节点创建了这把锁就可以）

对应的 Redis 指令如下：

- `setnx` - `setnx key val`：当且仅当 key 不存在时，set 一个 key 为 val 的字符串，返回 1；若 key 存在，则什么都不做，返回 0。
- `expire` - `expire key timeout`：为 key 设置一个超时时间，单位为 second，超过这个时间锁会自动释放，避免死锁。
- `delete` - `delete key`：删除 key

### 具体实现

（1）申请锁

```
SET resource_name my_random_value NX PX 30000
```

执行这个命令就 ok。

- `NX`：表示只有 `key` 不存在的时候才会设置成功。（如果此时 redis 中存在这个 key，那么设置失败，返回 `nil`）
- `PX 30000`：意思是 30s 后锁自动释放。别人创建的时候如果发现已经有了就不能加锁了。

（2）释放锁

释放锁就是删除 key ，但是一般可以用 `lua` 脚本删除，判断 value 一样才删除：

```python
-- 删除锁的时候，找到 key 对应的 value，跟自己传过去的 value 做比较，如果是一样的才删除。
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

### 小结

为啥要用 `random_value` 随机值呢？因为如果某个客户端获取到了锁，但是阻塞了很长时间才执行完，比如说超过了 30s，此时可能已经自动释放锁了，此时可能别的客户端已经获取到了这个锁，要是你这个时候直接删除 key 的话会有问题，所以得用随机值加上面的 `lua` 脚本来释放锁。

但是这样是肯定不行的。因为如果是普通的 redis 单实例，那就是单点故障。或者是 redis 普通主从，那 redis 主从异步复制，如果主节点挂了（key 就没有了），key 还没同步到从节点，此时从节点切换为主节点，别人就可以 set key，从而拿到锁。

### RedLock 算法

这个场景是假设有一个 redis cluster，有 5 个 redis master 实例。然后执行如下步骤获取一把锁：

1. 获取当前时间戳，单位是毫秒；
2. 跟上面类似，轮流尝试在每个 master 节点上创建锁，过期时间较短，一般就几十毫秒；
3. 尝试在**大多数节点**上建立一个锁，比如 5 个节点就要求是 3 个节点 `n / 2 + 1`；
4. 客户端计算建立好锁的时间，如果建立锁的时间小于超时时间，就算建立成功了；
5. 要是锁建立失败了，那么就依次之前建立过的锁删除；
6. 只要别人建立了一把分布式锁，你就得**不断轮询去尝试获取锁**。

[Redis 官方](https://redis.io/)给出了以上两种基于 Redis 实现分布式锁的方法，详细说明可以查看：<https://redis.io/topics/distlock> 。

## ZooKeeper 分布式锁

### 实现思路

这也是 ZooKeeper 客户端 curator 的分布式锁实现。

1. 创建一个目录 mylock；
2. 线程 A 想获取锁就在 mylock 目录下创建临时顺序节点；
3. 获取 mylock 目录下所有的子节点，然后获取比自己小的兄弟节点，如果不存在，则说明当前线程顺序号最小，获得锁；
4. 线程 B 获取所有节点，判断自己不是最小节点，设置监听比自己次小的节点；
5. 线程 A 处理完，删除自己的节点，线程 B 监听到变更事件，判断自己是不是最小的节点，如果是则获得锁。

### 具体实现

```java
/**
 * ZooKeeperSession
 *
 * @author bingo
 * @since 2018/11/29
 *
 */
public class ZooKeeperSession {

    private static CountDownLatch connectedSemaphore = new CountDownLatch(1);

    private ZooKeeper zookeeper;
    private CountDownLatch latch;

    public ZooKeeperSession() {
        try {
            this.zookeeper = new ZooKeeper("192.168.31.187:2181,192.168.31.19:2181,192.168.31.227:2181", 50000, new ZooKeeperWatcher());
            try {
                connectedSemaphore.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println("ZooKeeper session established......");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取分布式锁
     *
     * @param productId
     */
    public Boolean acquireDistributedLock(Long productId) {
        String path = "/product-lock-" + productId;

        try {
            zookeeper.create(path, "".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
            return true;
        } catch (Exception e) {
            while (true) {
                try {
                    // 相当于是给node注册一个监听器，去看看这个监听器是否存在
                    Stat stat = zk.exists(path, true);

                    if (stat != null) {
                        this.latch = new CountDownLatch(1);
                        this.latch.await(waitTime, TimeUnit.MILLISECONDS);
                        this.latch = null;
                    }
                    zookeeper.create(path, "".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
                    return true;
                } catch (Exception ee) {
                    continue;
                }
            }

        }
        return true;
    }

    /**
     * 释放掉一个分布式锁
     *
     * @param productId
     */
    public void releaseDistributedLock(Long productId) {
        String path = "/product-lock-" + productId;
        try {
            zookeeper.delete(path, -1);
            System.out.println("release the lock for product[id=" + productId + "]......");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 建立zk session的watcher
     *
     * @author bingo
     * @since 2018/11/29
     *
     */
    private class ZooKeeperWatcher implements Watcher {

        public void process(WatchedEvent event) {
            System.out.println("Receive watched event: " + event.getState());

            if (KeeperState.SyncConnected == event.getState()) {
                connectedSemaphore.countDown();
            }

            if (this.latch != null) {
                this.latch.countDown();
            }
        }

    }

    /**
     * 封装单例的静态内部类
     *
     * @author bingo
     * @since 2018/11/29
     *
     */
    private static class Singleton {

        private static ZooKeeperSession instance;

        static {
            instance = new ZooKeeperSession();
        }

        public static ZooKeeperSession getInstance() {
            return instance;
        }

    }

    /**
     * 获取单例
     *
     * @return
     */
    public static ZooKeeperSession getInstance() {
        return Singleton.getInstance();
    }

    /**
     * 初始化单例的便捷方法
     */
    public static void init() {
        getInstance();
    }

}
```

也可以采用另一种方式，创建临时顺序节点：

如果有一把锁，被多个人给竞争，此时多个人会排队，第一个拿到锁的人会执行，然后释放锁；后面的每个人都会去监听**排在自己前面**的那个人创建的 node 上，一旦某个人释放了锁，排在自己后面的人就会被 zookeeper 给通知，一旦被通知了之后，就 ok 了，自己就获取到了锁，就可以执行代码了。

```java
public class ZooKeeperDistributedLock implements Watcher {

    private ZooKeeper zk;
    private String locksRoot = "/locks";
    private String productId;
    private String waitNode;
    private String lockNode;
    private CountDownLatch latch;
    private CountDownLatch connectedLatch = new CountDownLatch(1);
    private int sessionTimeout = 30000;

    public ZooKeeperDistributedLock(String productId) {
        this.productId = productId;
        try {
            String address = "192.168.31.187:2181,192.168.31.19:2181,192.168.31.227:2181";
            zk = new ZooKeeper(address, sessionTimeout, this);
            connectedLatch.await();
        } catch (IOException e) {
            throw new LockException(e);
        } catch (KeeperException e) {
            throw new LockException(e);
        } catch (InterruptedException e) {
            throw new LockException(e);
        }
    }

    public void process(WatchedEvent event) {
        if (event.getState() == KeeperState.SyncConnected) {
            connectedLatch.countDown();
            return;
        }

        if (this.latch != null) {
            this.latch.countDown();
        }
    }

    public void acquireDistributedLock() {
        try {
            if (this.tryLock()) {
                return;
            } else {
                waitForLock(waitNode, sessionTimeout);
            }
        } catch (KeeperException e) {
            throw new LockException(e);
        } catch (InterruptedException e) {
            throw new LockException(e);
        }
    }

    public boolean tryLock() {
        try {
 		    // 传入进去的locksRoot + “/” + productId
		    // 假设productId代表了一个商品id，比如说1
		    // locksRoot = locks
		    // /locks/10000000000，/locks/10000000001，/locks/10000000002
            lockNode = zk.create(locksRoot + "/" + productId, new byte[0], ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);

            // 看看刚创建的节点是不是最小的节点
	 	    // locks：10000000000，10000000001，10000000002
            List<String> locks = zk.getChildren(locksRoot, false);
            Collections.sort(locks);

            if(lockNode.equals(locksRoot+"/"+ locks.get(0))){
                //如果是最小的节点,则表示取得锁
                return true;
            }

            //如果不是最小的节点，找到比自己小1的节点
	  int previousLockIndex = -1;
            for(int i = 0; i < locks.size(); i++) {
		if(lockNode.equals(locksRoot + “/” + locks.get(i))) {
	         	    previousLockIndex = i - 1;
		    break;
		}
	   }

	   this.waitNode = locks.get(previousLockIndex);
        } catch (KeeperException e) {
            throw new LockException(e);
        } catch (InterruptedException e) {
            throw new LockException(e);
        }
        return false;
    }

    private boolean waitForLock(String waitNode, long waitTime) throws InterruptedException, KeeperException {
        Stat stat = zk.exists(locksRoot + "/" + waitNode, true);
        if (stat != null) {
            this.latch = new CountDownLatch(1);
            this.latch.await(waitTime, TimeUnit.MILLISECONDS);
            this.latch = null;
        }
        return true;
    }

    public void unlock() {
        try {
            // 删除/locks/10000000000节点
            // 删除/locks/10000000001节点
            System.out.println("unlock " + lockNode);
            zk.delete(lockNode, -1);
            lockNode = null;
            zk.close();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (KeeperException e) {
            e.printStackTrace();
        }
    }

    public class LockException extends RuntimeException {
        private static final long serialVersionUID = 1L;

        public LockException(String e) {
            super(e);
        }

        public LockException(Exception e) {
            super(e);
        }
    }
}
```

### 小结

ZooKeeper 版本的分布式锁问题相对比较来说少。

- 锁的占用时间限制：redis 就有占用时间限制，而 ZooKeeper 则没有，最主要的原因是 redis 目前没有办法知道已经获取锁的客户端的状态，是已经挂了呢还是正在执行耗时较长的业务逻辑。而 ZooKeeper 通过临时节点就能清晰知道，如果临时节点存在说明还在执行业务逻辑，如果临时节点不存在说明已经执行完毕释放锁或者是挂了。由此看来 redis 如果能像 ZooKeeper 一样添加一些与客户端绑定的临时键，也是一大好事。
- 是否单点故障：redis 本身有很多中玩法，如客户端一致性 hash，服务器端 sentinel 方案或者 cluster 方案，很难做到一种分布式锁方式能应对所有这些方案。而 ZooKeeper 只有一种玩法，多台机器的节点数据是一致的，没有 redis 的那么多的麻烦因素要考虑。

总体上来说 ZooKeeper 实现分布式锁更加的简单，可靠性更高。但 ZooKeeper 因为需要频繁的创建和删除节点，性能上不如 Redis 方式。

## 分布式锁方案对比

- 数据库分布式锁，问题比较多，解决起来比较麻烦，不推荐

- redis 分布式锁，其实**需要自己不断去尝试获取锁**，比较消耗性能。
- zk 分布式锁，获取不到锁，注册个监听器即可，不需要不断主动尝试获取锁，性能开销较小。

另外一点就是，如果是 redis 获取锁的那个客户端出现 bug 挂了，那么只能等待超时时间之后才能释放锁；而 zk 的话，因为创建的是临时 znode，只要客户端挂了，znode 就没了，此时就自动释放锁。

总体上来说，ZooKeeper 实现分布式锁更加的简单，可靠性更高。

## 参考资料

- [分布式锁实现汇总](https://juejin.im/post/5a20cd8bf265da43163cdd9a)
