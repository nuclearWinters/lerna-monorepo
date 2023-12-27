module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: "4.0.3",
      skipMD5: true,
    },
    instance: {
      dbName: "auth",
    },
    autoStart: false,
  },
  useSharedDBForAllJestWorkers: false,
};
