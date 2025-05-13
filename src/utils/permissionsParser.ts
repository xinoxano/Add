import { Domain, Permission, SubPermission, SupportedActions } from '../types/permissions';

interface CsvRow {
  Domain: string;
  'Sub-domain': string;
  Permission: string;
  'Scopable?': string;
  'Supported actions': SupportedActions;
  'Sensitive data flag': string;
}

function parseAccessLevels(supportedActions: SupportedActions): string[] {
  if (supportedActions === 'Yes - No') return [];
  
  return supportedActions.split(' - ').map(level => level.trim());
}

function isScopable(scopableStr: string): boolean {
  return scopableStr === 'Scopable today';
}

function isSensitive(sensitiveStr: string): boolean {
  return sensitiveStr === 'Yes';
}

export function parsePermissionsData(csvData: CsvRow[]): Domain[] {
  const domains = new Map<string, Domain>();

  csvData.forEach(row => {
    if (!row.Domain) return; // Skip empty rows

    // Get or create domain
    if (!domains.has(row.Domain)) {
      domains.set(row.Domain, {
        name: row.Domain,
        subdomain: row['Sub-domain'] || '-',
        permissions: []
      });
    }
    const domain = domains.get(row.Domain)!;

    // Handle permissions
    if (row['Sub-domain'] === '-') {
      // This is a top-level permission
      domain.permissions.push({
        name: row.Permission,
        isScopable: isScopable(row['Scopable?']),
        supportedActions: row['Supported actions'],
        isSensitive: isSensitive(row['Sensitive data flag']),
        subdomain: row['Sub-domain'] || '-',
      });
    } else {
      // This is a permission with a sub-domain
      const accessLevels = parseAccessLevels(row['Supported actions']);
      domain.permissions.push({
        name: row.Permission,
        isScopable: isScopable(row['Scopable?']),
        supportedActions: row['Supported actions'],
        isSensitive: isSensitive(row['Sensitive data flag']),
        subdomain: row['Sub-domain'] || '-',
        subPermissions: []
      });
    }
  });

  return Array.from(domains.values());
} 