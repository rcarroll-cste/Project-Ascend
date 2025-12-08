/**
 * Debug Logger for Project Ascend
 *
 * Collects logs in memory and persists them to localStorage.
 * Logs survive page reloads and can be exported.
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *   logger.info('CharterBuilder', 'Submit clicked', { sections: charterSections });
 *   logger.error('Validation', 'Charter rejected', { errors });
 *
 * To view logs:
 *   - In browser console: window.__ASCEND_LOGS__
 *   - Or call: window.__EXPORT_LOGS__() to download as file
 *   - Call: window.__CLEAR_LOGS__() to clear all logs (including persisted)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: unknown;
}

const STORAGE_KEY = 'ascend_logs';
const MAX_LOGS = 500;
const DEBOUNCE_MS = 500;

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = MAX_LOGS;
  private consoleEnabled = false;
  private persistTimeout: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load existing logs from localStorage
      this.loadFromStorage();

      // Expose logs globally for debugging
      (window as unknown as Record<string, unknown>).__ASCEND_LOGS__ = this.logs;
      (window as unknown as Record<string, unknown>).__EXPORT_LOGS__ = () => this.exportToFile();
      (window as unknown as Record<string, unknown>).__CLEAR_LOGS__ = () => this.clear();
      (window as unknown as Record<string, unknown>).__ENABLE_CONSOLE__ = () => { this.consoleEnabled = true; };
      (window as unknown as Record<string, unknown>).__DISABLE_CONSOLE__ = () => { this.consoleEnabled = false; };
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.logs.push(...parsed);
          // Enforce max limit on load
          while (this.logs.length > this.maxLogs) {
            this.logs.shift();
          }
        }
      }
    } catch (e) {
      // If parsing fails, start fresh
      console.warn('[Logger] Failed to load persisted logs:', e);
    }
  }

  private persistLogs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      // Handle quota exceeded or other storage errors
      console.warn('[Logger] Failed to persist logs:', e);
    }
  }

  private schedulePersist() {
    // Debounce persistence to avoid blocking main thread
    if (this.persistTimeout !== null) {
      clearTimeout(this.persistTimeout);
    }
    this.persistTimeout = window.setTimeout(() => {
      this.persistLogs();
      this.persistTimeout = null;
    }, DEBOUNCE_MS);
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

    // Schedule persistence
    this.schedulePersist();

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

  // Clear all logs (including persisted)
  clear() {
    this.logs.length = 0;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[Logger] Failed to clear persisted logs:', e);
    }
    return 'Logs cleared';
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
