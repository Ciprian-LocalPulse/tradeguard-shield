import type { UserReport } from "@tradeguard/shared";

export interface StoredReport extends UserReport {
  id: string;
  createdAt: string;
  status: "new" | "reviewing" | "closed";
}

const reports: StoredReport[] = [];

export const reportStore = {
  add(report: UserReport): StoredReport {
    const stored = {
      ...report,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new" as const
    };
    reports.push(stored);
    return stored;
  },
  count() {
    return reports.length;
  }
};
