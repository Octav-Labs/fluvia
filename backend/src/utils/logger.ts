export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getLogger(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, ...args: any[]): void {
    console.log(`[INFO] ${message}`, ...args);
  }

  public error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
}
