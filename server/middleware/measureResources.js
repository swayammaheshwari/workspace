const measureResources = (req, res, next) => {
  const startUsageCPU = process.cpuUsage();
  const startUsageMemory = process.memoryUsage().rss;

  res.on("finish", () => {
    const endUsageCPU = process.cpuUsage(startUsageCPU);
    const userCPU = endUsageCPU.user / 1000; // Convert microseconds to milliseconds
    console.log(`CPU usage for route ${req.method} ${req.path}: ${userCPU}ms`);

    const endUsageMemory = process.memoryUsage().rss;
    const memoryUsed = (endUsageMemory - startUsageMemory) / 1024 / 1024; // Convert bytes to megabytes
    console.log(
      `Memory usage for route ${req.method} ${req.path}: ${memoryUsed}MB`
    );
  });

  next();
};

export default measureResources;
