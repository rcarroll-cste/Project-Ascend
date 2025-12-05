/**
 * Debug Logger for Project Ascend
 *
 * Collects logs in memory and provides ways to export them.
 * Logs are not shown in console by default, but can be enabled.
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *   logger.info('CharterBuilder', 'Submit clicked', { sections: charterSections });
 *   logger.error('Validation', 'Charter rejected', { errors });
 *
 * To view logs:
 *   - In browser console: window.__ASCEND_LOGS__
 *   - Or call: window.__EXPORT_LOGS__() to download as file
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 entries
  private consoleEnabled = false; // Set to true to also show in console

  constructor() {
    // Expose logs globally for debugging
    if (typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>).__ASCEND_LOGS__ = this.logs;
      (window as unknown as Record<string, unknown>).__EXPORT_LOGS__ = () => this.exportToFile();
      (window as unknown as Record<string, unknown>).__CLEAR_LOGS__ = () => this.clear();
      (window as unknown as Record<string, unknown>).__ENABLE_CONSOLE__ = () => { this.consoleEnabled = true; };
      (window as unknown as Record<string, unknown>).__DISABLE_CONSOLE__ = () => { this.consoleEnabled = false; };
    }
  }

  private addLog(level: LogLevel, component: string, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data,
    };

    this.logs.push(entry);

    // Trim old logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Optionally log to console
    if (this.consoleEnabled) {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${component}]`;
      if (data !== undefined) {
        console.log(prefix, message, data);
      } else {
        console.log(prefix, message);
      }
    }
  }

  debug(component: string, message: string, data?: unknown) {
    this.addLog('debug', component, message, data);
  }

  info(component: string, message: string, data?: unknown) {
    this.addLog('info', component, message, data);
  }

  warn(component: string, message: string, data?: unknown) {
    this.addLog('warn', component, message, data);
  }

  error(component: string, message: string, data?: unknown) {
    this.addLog('error', component, message, data);
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs filtered by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs filtered by component
  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component.toLowerCase().includes(component.toLowerCase()));
  }

  // Clear all logs
  clear() {
    this.logs.length = 0;
  }

  // Export logs to a downloadable file
  exportToFile() {
    const content = this.logs.map(log => {
      const dataStr = log.data !== undefined ? ` | Data: ${JSON.stringify(log.data)}` : '';
      return `[${log.timestamp}] [${log.level.toUpperCase().padEnd(5)}] [${log.component}] ${log.message}${dataStr}`;
    }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascend-debug-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return `Exported ${this.logs.length} log entries`;
  }

  // Format logs as string (for display)
  formatLogs(): string {
    return this.logs.map(log => {
      const dataStr = log.data !== undefined ? ` | ${JSON.stringify(log.data)}` : '';
      return `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.component}] ${log.message}${dataStr}`;
    }).join('\n');
  }
}

// Singleton instance
export const logger = new Logger();
