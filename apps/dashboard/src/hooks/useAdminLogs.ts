import { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/audit.service.ts';
import type { AuditEvent, AuditActionType } from '../types/audit.types.ts';

export function useAdminLogs() {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionType, setActionType] = useState<AuditActionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await auditService.getLogs({
        actionType,
        searchQuery,
      });
      setLogs(data);
    } finally {
      setIsLoading(false);
    }
  }, [actionType, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    actionType,
    setActionType,
    searchQuery,
    setSearchQuery,
    refresh: fetchLogs,
  };
}
