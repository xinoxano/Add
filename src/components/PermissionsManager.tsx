import React, { useState } from 'react';
import Modal from './Modal';
import { permissionsData } from '../data/permissionsData';
import { Domain, Permission, AccessLevel } from '../types/permissions';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface PermissionsManagerProps {
  open: boolean;
  onClose: () => void;
  onAddPermissions: (permissions: SelectedPermission[]) => void;
}

export interface SelectedPermission {
  domain: string;
  subdomain: string;
  permission: string;
  isEnabled: boolean;
  accessLevel?: AccessLevel;
  isSensitive: boolean;
  noScopeLimit?: boolean;
}

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  open,
  onClose,
  onAddPermissions,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermission[]>([]);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [expandedSubdomains, setExpandedSubdomains] = useState<Record<string, boolean>>({});

  const handleDomainToggle = (domainName: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainName)) {
        newSet.delete(domainName);
      } else {
        newSet.add(domainName);
      }
      return newSet;
    });
  };

  const handleSubdomainToggle = (subdomain: string) => {
    setExpandedSubdomains(prev => ({
      ...prev,
      [subdomain]: !prev[subdomain]
    }));
  };

  const handlePermissionToggle = (domain: Domain, permission: Permission) => {
    setSelectedPermissions(prev => {
      const existing = prev.find(p => p.permission === permission.name);
      if (existing) {
        const newPermissions = prev.filter(p => p.permission !== permission.name);
        // If all permissions in domain are now disabled, collapse the domain
        const domainPermissions = permissionsData
          .find(d => d.name === domain.name)
          ?.permissions || [];
        const allDisabled = domainPermissions.every(p => 
          !newPermissions.some(sp => sp.permission === p.name)
        );
        if (allDisabled) {
          setExpandedDomains(prev => {
            const newSet = new Set(prev);
            newSet.delete(domain.name);
            return newSet;
          });
        }
        return newPermissions;
      } else {
        const newPermission: SelectedPermission = {
          domain: domain.name,
          subdomain: domain.subdomain,
          permission: permission.name,
          isEnabled: true,
          accessLevel: Array.isArray(permission.supportedActions) && permission.supportedActions.includes('View') ? 'View' : undefined,
          isSensitive: permission.isSensitive,
        };
        return [...prev, newPermission];
      }
    });
  };

  const handleAccessLevelChange = (permission: Permission, level: AccessLevel) => {
    setSelectedPermissions(prev => 
      prev.map(p => 
        p.permission === permission.name 
          ? { ...p, accessLevel: level }
          : p
      )
    );
  };

  const handleAddPermission = () => {
    onAddPermissions(selectedPermissions);
    onClose();
  };

  const isPermissionSelected = (permissionName: string) => {
    return selectedPermissions.some(p => p.permission === permissionName);
  };

  const getSelectedAccessLevel = (permissionName: string) => {
    return selectedPermissions.find(p => p.permission === permissionName)?.accessLevel;
  };

  const isDomainExpanded = (domainName: string) => {
    return expandedDomains.has(domainName);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Permission</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {permissionsData.map((domain: Domain) => (
            <div
              key={domain.name}
              className="mb-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center justify-between px-4 py-2 cursor-pointer" onClick={() => handleDomainToggle(domain.name)}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={domain.permissions.some(p => isPermissionSelected(p.name))}
                    onChange={() => handleDomainToggle(domain.name)}
                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-lg font-semibold text-gray-900">{domain.name}</span>
                </div>
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded" onClick={e => { e.stopPropagation(); handleDomainToggle(domain.name); }}>
                  {isDomainExpanded(domain.name) ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Permissions by subdomain */}
              {isDomainExpanded(domain.name) && (
                <div className="pl-8 pb-4">
                  {(() => {
                    const groupedBySubdomain = domain.permissions.reduce((acc, permission) => {
                      const subdomain = (permission as any).subdomain || domain.subdomain || '-';
                      if (!acc[subdomain]) acc[subdomain] = [];
                      acc[subdomain].push(permission);
                      return acc;
                    }, {} as Record<string, Permission[]>);
                    return (
                      <div>
                        {Object.entries(groupedBySubdomain).map(([subdomain, subPermissions]) => {
                          if (subdomain === '-') {
                            // Render non-grouped permissions directly
                            return subPermissions.map((permission) => (
                              <div
                                key={permission.name}
                                className={`p-3 mb-2 border rounded-lg flex flex-col gap-2 ${isPermissionSelected(permission.name) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'} transition-colors`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isPermissionSelected(permission.name)}
                                    onChange={() => handlePermissionToggle(domain, permission)}
                                    className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                                  />
                                  <span className="text-base text-gray-900">{permission.name}</span>
                                  {permission.isSensitive && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">Sensitive</span>
                                  )}
                                </div>
                                {isPermissionSelected(permission.name) && Array.isArray(permission.supportedActions) && permission.supportedActions.length > 1 && (
                                  <div className="flex gap-2 mt-2 ml-6">
                                    {permission.supportedActions.includes('View') && (
                                      <button
                                        className={`px-3 py-1 rounded text-sm font-medium border ${getSelectedAccessLevel(permission.name) === 'View' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'} transition-colors`}
                                        onClick={() => handleAccessLevelChange(permission, 'View')}
                                      >
                                        View
                                      </button>
                                    )}
                                    {permission.supportedActions.includes('Propose') && (
                                      <button
                                        className={`px-3 py-1 rounded text-sm font-medium border ${getSelectedAccessLevel(permission.name) === 'Propose' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'} transition-colors`}
                                        onClick={() => handleAccessLevelChange(permission, 'Propose')}
                                      >
                                        Propose
                                      </button>
                                    )}
                                    {permission.supportedActions.includes('Edit') && (
                                      <button
                                        className={`px-3 py-1 rounded text-sm font-medium border ${getSelectedAccessLevel(permission.name) === 'Edit' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'} transition-colors`}
                                        onClick={() => handleAccessLevelChange(permission, 'Edit')}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ));
                          }
                          // Grouped permissions by subdomain
                          return (
                            <div key={subdomain} className="mb-4 border rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">{subdomain}</span>
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded border border-primary-200 text-primary-700 bg-primary-50">{subPermissions.length} permissions</span>
                                </div>
                                <button
                                  className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                  onClick={() => handleSubdomainToggle(subdomain)}
                                >
                                  {expandedSubdomains[subdomain] ? (
                                    <ChevronUpIcon className="h-4 w-4" />
                                  ) : (
                                    <ChevronDownIcon className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              {expandedSubdomains[subdomain] && (
                                <div className="p-3">
                                  {subPermissions.map((permission) => (
                                    <div
                                      key={permission.name}
                                      className={`flex flex-col gap-2 mb-2 border rounded-lg p-3 ${isPermissionSelected(permission.name) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'} transition-colors`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={isPermissionSelected(permission.name)}
                                          onChange={() => handlePermissionToggle(domain, permission)}
                                          className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-base text-gray-900">{permission.name}</span>
                                        {permission.isSensitive && (
                                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">Sensitive</span>
                                        )}
                                      </div>
                                      {isPermissionSelected(permission.name) && Array.isArray(permission.supportedActions) && permission.supportedActions.length > 1 && (
                                        <div className="flex gap-2 mt-2 ml-6">
                                          {permission.supportedActions.includes('View') && (
                                            <button
                                              className={`px-3 py-1 rounded text-sm font-medium border ${getSelectedAccessLevel(permission.name) === 'View' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'} transition-colors`}
                                              onClick={() => handleAccessLevelChange(permission, 'View')}
                                            >
                                              View
                                            </button>
                                          )}
                                          {permission.supportedActions.includes('Propose') && (
                                            <button
                                              className={`px-3 py-1 rounded text-sm font-medium border ${getSelectedAccessLevel(permission.name) === 'Propose' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'} transition-colors`}
                                              onClick={() => handleAccessLevelChange(permission, 'Propose')}
                                            >
                                              Propose
                                            </button>
                                          )}
                                          {permission.supportedActions.includes('Edit') && (
                                            <button
                                              className={`px-3 py-1 rounded text-sm font-medium border ${getSelectedAccessLevel(permission.name) === 'Edit' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300'} transition-colors`}
                                              onClick={() => handleAccessLevelChange(permission, 'Edit')}
                                            >
                                              Edit
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-6 py-4 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddPermission}
            className={`rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={selectedPermissions.length === 0}
          >
            Add {selectedPermissions.length} Permission{selectedPermissions.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </Modal>
  );
}; 