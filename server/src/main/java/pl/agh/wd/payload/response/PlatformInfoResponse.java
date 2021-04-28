package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


/**
 * Handles /api/admin/platforminfo response
 *
 * @author howkymike
 */

@Getter
public class PlatformInfoResponse {

    private static final String PROP_MEMORY = "memory";
    private static final String PROP_OS = "os";
    private static final String PROP_THREADS = "threads";

    private static final String PROP_MEMORY_INIT = "init";
    private static final String PROP_MEMORY_USED = "used";
    private static final String PROP_MEMORY_MAX = "max";
    private static final String PROP_MEMORY_COMMITTED = "committed";

    private String os;
    private HashMap<String, Double> memoryMap;
    private List<ThreadModel> threadList;


    public PlatformInfoResponse() {
        setOs();
        setMemory();
        setThreads();
    }

    private void setOs() {
        this.os = System.getProperty("os.name");
    }

    private void setMemory() {
        memoryMap = new HashMap<>(4);
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        memoryMap.put(PROP_MEMORY_INIT, ((double)memoryMXBean.getHeapMemoryUsage().getInit() /1073741824));
        memoryMap.put(PROP_MEMORY_USED,((double)memoryMXBean.getHeapMemoryUsage().getUsed() /1073741824));
        memoryMap.put(PROP_MEMORY_MAX,((double)memoryMXBean.getHeapMemoryUsage().getMax() /1073741824));
        memoryMap.put(PROP_MEMORY_COMMITTED,((double)memoryMXBean.getHeapMemoryUsage().getCommitted() /1073741824));
    }

    private void setThreads() {
        threadList = new ArrayList<>();
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        for(Long threadID : threadMXBean.getAllThreadIds()) {
            ThreadInfo info = threadMXBean.getThreadInfo(threadID);
            threadList.add(new ThreadModel(
                    info.getThreadName(),
                    info.getThreadState().toString(),
                    threadMXBean.getThreadCpuTime(threadID)));
        }
    }

    @Getter
    @Setter
    static class ThreadModel {
        private static final String THREAD_NAME = "name";
        private static final String THREAD_STATE = "state";
        private static final String THREAD_CPU_TIME = "cpu_time";

        private String name;
        private String state;
        private long cpu_time;

        public ThreadModel(String name, String state, long cpu_time) {
            this.name = name;
            this.state = state;
            this.cpu_time = cpu_time;
        }
    }
}
