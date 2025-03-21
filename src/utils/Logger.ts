declare type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  currentLevel: LogLevel;

  constructor() {
    this.currentLevel = "debug";
  }

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  log(level: LogLevel, message: string) {
    const levelIndex = this.getLogLevelIndex(level);

    const currentLevelIndex = this.getLogLevelIndex(this.currentLevel);

    if (levelIndex >= currentLevelIndex) {
      const timestamp = new Date().toISOString();
      console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
  }

  debug(message: string) {
    this.log("debug", message);
  }

  info(message: string) {
    this.log("info", message);
  }

  warn(message: string) {
    this.log("warn", message);
  }

  error(message: string) {
    this.log("error", message);
  }

  getLogLevelIndex(level: LogLevel): number {
    return ["debug", "info", "warn", "error"].indexOf(level);
  }
}

const logger = new Logger();

export default logger;
