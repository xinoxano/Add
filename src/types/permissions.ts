export type AccessLevel = 'View' | 'Propose' | 'Edit';

export type SupportedActions = 'View - Propose - Edit' | 'View - Edit' | 'View only' | 'Edit only' | 'Yes - No';

export interface SubPermission {
  name: string;
  accessLevels: AccessLevel[];
  defaultAccessLevel: AccessLevel;
  isSensitive: boolean;
}

export interface Permission {
  name: string;
  isScopable: boolean;
  supportedActions: SupportedActions;
  isSensitive: boolean;
  subPermissions?: SubPermission[];
  subdomain?: string;
  noScopeLimit?: boolean;
}

export interface Domain {
  name: string;
  subdomain: string;
  permissions: Permission[];
}

export interface PermissionsData {
  domains: Domain[];
} 