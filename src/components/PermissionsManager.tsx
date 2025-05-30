import React from 'react';
import Modal from './Modal';
import { AccessLevel } from '../types/permissions';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export interface SelectedPermission {
  domain: string;
  subdomain: string;
  permission: string;
  isEnabled: boolean;
  accessLevel?: AccessLevel;
  isSensitive: boolean;
  noScopeLimit?: boolean;
  supportedActions?: string[];
}

interface PermissionsManagerProps {
  open: boolean;
  onClose: () => void;
  onAddPermissions: () => void;
  domain: string;
  permissions: SelectedPermission[];
  expandedSubdomains: Record<string, boolean>;
  onToggleSubdomain: (subdomain: string) => void;
  onTogglePermission: (permission: SelectedPermission) => void;
  onChangeAccessLevel: (permission: SelectedPermission, level: AccessLevel) => void;
  onEnableAll: (subdomain: string) => void;
  onDisableAll: (subdomain: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  isEdit?: boolean;
}

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  open,
  onClose,
  onAddPermissions,
  domain,
  permissions,
  expandedSubdomains,
  onToggleSubdomain,
  onTogglePermission,
  onChangeAccessLevel,
  onEnableAll,
  onDisableAll,
  search,
  onSearchChange,
  isEdit = false,
}) => {
  // Group permissions by subdomain
  const grouped = permissions.reduce((acc, p) => {
    const sub = p.subdomain || '-';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(p);
    return acc;
  }, {} as Record<string, SelectedPermission[]>);
  const groupedEntries = Object.entries(grouped).filter(([sub]) => sub !== '-');
  const ungroupedEntries = Object.entries(grouped).filter(([sub]) => sub === '-');

  React.useEffect(() => {
    if (search.trim() === '') return;
    const newExpanded: Record<string, boolean> = {};
    groupedEntries.forEach(([subdomain, subPermissions]) => {
      newExpanded[subdomain] = subPermissions.some(p =>
        p.permission.toLowerCase().includes(search.trim().toLowerCase())
      );
    });
    Object.keys(newExpanded).forEach(sub => {
      if (newExpanded[sub] && !expandedSubdomains[sub]) {
        onToggleSubdomain(sub);
      }
    });
    // Optionally, collapse groups with no matches
    // Object.keys(expandedSubdomains).forEach(sub => {
    //   if (!newExpanded[sub] && expandedSubdomains[sub]) {
    //     onToggleSubdomain(sub);
    //   }
    // });
  }, [search]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[704px] max-w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 sticky top-0 bg-white z-20 border-b border-gray-100" style={{ minHeight: 72 }}>
          <div className="flex items-center gap-1">
            <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Permission' : 'Add Permission'}</h2>
            {domain && (
              <span className="text-2xl font-bold text-gray-900 align-middle">·</span>
            )}
            {domain && (
              <span className="text-2xl font-bold text-gray-900 align-middle">{domain}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Content area: fixed height, search always visible, list scrolls */}
        <div className="flex flex-col min-h-[600px] max-h-[600px]">
          {/* Search always visible */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="bg-white px-8 pt-3 pb-2 flex items-center gap-2" style={{ minHeight: 56 }}>
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="Search permissions..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {search && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="px-8 py-6 space-y-6">
              {/* If only ungrouped permissions, show flat list with enable/disable all button */}
              {groupedEntries.length === 0 && ungroupedEntries.length > 0 ? (() => {
                const subPermissions = ungroupedEntries.flatMap(([_, perms]) => perms);
                const allEnabled = subPermissions.every(p => p.isEnabled);
                return (
                  <div className="mb-3">
                    <div className="flex items-center justify-between px-1 pb-2">
                      <span className="text-base font-semibold text-gray-900">Permissions</span>
                      <button
                        className={`rounded-lg bg-white px-4 py-2 text-sm font-medium ${allEnabled ? 'text-gray-500' : 'text-primary-700'} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[88px]`}
                        onClick={() => allEnabled ? onDisableAll('-') : onEnableAll('-')}
                      >
                        {allEnabled ? 'Disable all' : 'Enable all'}
                      </button>
                    </div>
                    <div>
                      {subPermissions.map(permission => (
                        <PermissionRow
                          key={permission.permission}
                          permission={permission}
                          onToggle={() => onTogglePermission(permission)}
                          onChangeAccessLevel={onChangeAccessLevel}
                          className="border border-gray-200 rounded-xl bg-white min-h-[56px] mb-3 hover:bg-gray-50 transition-colors px-4 py-0 flex items-center h-[56px]"
                        />
                      ))}
                    </div>
                  </div>
                );
              })() : null}

              {/* Otherwise, show grouped and 'Other' as before */}
              {groupedEntries.length > 0 && (
                <>
                  {groupedEntries.map(([subdomain, subPermissions]) => {
                    const expanded = expandedSubdomains[subdomain] || false;
                    const selectedCount = subPermissions.filter(p => p.isEnabled).length;
                    return (
                      <div key={subdomain} className="border border-gray-200 rounded-xl bg-white mb-3">
                        <div
                          className={`flex items-center gap-3 justify-between px-4 py-0 min-h-[56px] h-[56px] cursor-pointer group hover:bg-gray-50 bg-white ${expanded ? 'rounded-t-xl' : 'rounded-xl'} text-left`}
                          onClick={() => onToggleSubdomain(subdomain)}
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                            <span className="text-base font-semibold text-gray-900">{subdomain}</span>
                            <span className="flex items-center gap-0.5 h-[17px] px-[6px] pt-[2px] pb-[3px] rounded-full text-xs font-medium text-primary-700" style={{ background: '#F5F5F5' }}>
                              <span className="text-[10px] font-medium text-[#696968] leading-[12px] flex items-center justify-center">{selectedCount}</span>
                              <span className="text-[10px] text-[#696968] opacity-40 font-sans">/</span>
                              <span className="text-[10px] text-[#696968] opacity-60 font-medium leading-[12px] flex items-center justify-center" style={{ width: 5, height: 12 }}>{subPermissions.length}</span>
                            </span>
                          </div>
                          {expanded && (
                            <div className="flex gap-2">
                              {subPermissions.every(p => p.isEnabled) ? (
                                <button
                                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[88px]"
                                  onClick={e => { e.stopPropagation(); onDisableAll(subdomain); }}
                                >
                                  Disable all
                                </button>
                              ) : (
                                <button
                                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[88px]"
                                  onClick={e => { e.stopPropagation(); onEnableAll(subdomain); }}
                                >
                                  Enable all
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {expanded && (
                          <div className="p-4 space-y-3 bg-white rounded-b-xl">
                            {subPermissions.map(permission => (
                              <PermissionRow
                                key={permission.permission}
                                permission={permission}
                                onToggle={() => onTogglePermission(permission)}
                                onChangeAccessLevel={onChangeAccessLevel}
                                className="bg-white rounded-xl min-h-[56px] hover:bg-gray-50 transition-colors px-4 py-3 text-left flex items-center"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Ungrouped permissions grouped under 'Other' */}
                  {ungroupedEntries.length > 0 && (() => {
                    const subPermissions = ungroupedEntries.flatMap(([_, perms]) => perms);
                    const expanded = expandedSubdomains['Other'] || false;
                    const selectedCount = subPermissions.filter(p => p.isEnabled).length;
                    return (
                      <div key="Other" className="border border-gray-200 rounded-xl bg-white mb-3">
                        <div
                          className={`flex items-center gap-3 justify-between px-4 py-0 min-h-[56px] h-[56px] cursor-pointer group hover:bg-gray-50 bg-white ${expanded ? 'rounded-t-xl' : 'rounded-xl'} text-left`}
                          onClick={() => onToggleSubdomain('Other')}
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                            <span className="text-base font-semibold text-gray-900">Other</span>
                            <span className="flex items-center gap-0.5 h-[17px] px-[6px] pt-[2px] pb-[3px] rounded-full text-xs font-medium text-primary-700" style={{ background: '#F5F5F5' }}>
                              <span className="text-[10px] font-medium text-[#696968] leading-[12px] flex items-center justify-center">{selectedCount}</span>
                              <span className="text-[10px] text-[#696968] opacity-40 font-sans">/</span>
                              <span className="text-[10px] text-[#696968] opacity-60 font-medium leading-[12px] flex items-center justify-center" style={{ width: 5, height: 12 }}>{subPermissions.length}</span>
                            </span>
                          </div>
                          {expanded && (
                            <div className="flex gap-2">
                              {subPermissions.every(p => p.isEnabled) ? (
                                <button
                                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[88px]"
                                  onClick={e => { e.stopPropagation(); onDisableAll('-'); }}
                                >
                                  Disable all
                                </button>
                              ) : (
                                <button
                                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[88px]"
                                  onClick={e => { e.stopPropagation(); onEnableAll('-'); }}
                                >
                                  Enable all
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {expanded && (
                          <div className="p-4 space-y-3 bg-white rounded-b-xl">
                            {subPermissions.map(permission => (
                              <PermissionRow
                                key={permission.permission}
                                permission={permission}
                                onToggle={() => onTogglePermission(permission)}
                                onChangeAccessLevel={onChangeAccessLevel}
                                className="bg-white rounded-xl min-h-[56px] hover:bg-gray-50 transition-colors px-4 py-3 text-left flex items-center"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-8 py-5 bg-white rounded-b-2xl sticky bottom-0 z-20" style={{ minHeight: 72 }}>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[88px]"
          >
            Cancel
          </button>
          <button
            onClick={onAddPermissions}
            className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[88px]"
            type="button"
          >
            {isEdit ? 'Save' : `Add ${permissions.filter(p => p.isEnabled).length} Permission${permissions.filter(p => p.isEnabled).length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const PermissionRow: React.FC<{
  permission: SelectedPermission;
  onToggle: () => void;
  onChangeAccessLevel: (permission: SelectedPermission, level: AccessLevel) => void;
  className?: string;
}> = ({ permission, onToggle, onChangeAccessLevel, className }) => {
  const actions = permission.supportedActions || [];
  // Only add border if no className is provided (ungrouped)
  const baseClass = className ? className : `flex items-center gap-2 border border-gray-200 rounded-lg p-4 bg-white ${permission.isEnabled ? 'border-primary-500 bg-primary-50' : ''} transition-colors`;
  return (
    <div className={baseClass}> 
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={permission.isEnabled}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${permission.isEnabled ? 'bg-primary' : 'bg-gray-200'}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${permission.isEnabled ? 'translate-x-5' : 'translate-x-1'}`}
          />
        </button>
        <span className="text-base text-gray-900 font-medium">{permission.permission}</span>
        {permission.isSensitive && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 font-semibold">Sensitive</span>
        )}
        {permission.noScopeLimit && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800 font-semibold whitespace-nowrap">No scope limit</span>
        )}
      </div>
      {permission.isEnabled && actions.length > 1 && !actions.includes('Yes - No') && (
        <div className="ml-auto flex h-8 p-0.5 bg-gray-100 rounded-lg">
          {['View', 'Propose', 'Edit'].map(action => (
            <button
              key={action}
              className={`rounded-md px-3 h-7 text-sm font-medium border-0 shadow-none ${
                permission.accessLevel === action
                  ? 'bg-white text-gray-900'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              } disabled:cursor-not-allowed disabled:opacity-50`}
              onClick={() => onChangeAccessLevel(permission, action as AccessLevel)}
              disabled={!actions.includes(action)}
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 