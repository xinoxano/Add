import React, { useState, useEffect, useRef } from 'react';
import { AccessLevel } from './types/permissions';
import { permissionsData } from './data/permissionsData';
import { SelectedPermission } from './components/PermissionsManager';
import {
  HomeIcon,
  InboxIcon,
  UserGroupIcon,
  BoltIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ChartPieIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const steps = ['Get started', 'Permissions', 'Assignees', 'Confirm'];
const drawerWidth = 240;

const sidebarItems = [
  { label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
  { label: 'Inbox', icon: <InboxIcon className="h-5 w-5" />, badge: 6 },
  { label: 'Assistant', icon: <BoltIcon className="h-5 w-5" /> },
  { label: 'Employees', icon: <UserGroupIcon className="h-5 w-5" /> },
  { label: 'Automations', icon: <BoltIcon className="h-5 w-5" /> },
  { label: 'Calendars', icon: <CalendarIcon className="h-5 w-5" /> },
  { label: 'Analytics', icon: <ChartBarIcon className="h-5 w-5" /> },
  { label: 'Time Tracking', icon: <ClockIcon className="h-5 w-5" /> },
  { label: 'Payroll', icon: <CurrencyDollarIcon className="h-5 w-5" /> },
  { label: 'Recruiting', icon: <BriefcaseIcon className="h-5 w-5" /> },
  { label: 'Performance & Development', icon: <ChartBarIcon className="h-5 w-5" /> },
  { label: 'Training', icon: <AcademicCapIcon className="h-5 w-5" /> },
  { label: 'Compensation', icon: <CurrencyDollarIcon className="h-5 w-5" /> },
  { label: 'Whistleblowing', icon: <ExclamationTriangleIcon className="h-5 w-5" /> },
  { label: 'Surveys', icon: <ChartPieIcon className="h-5 w-5" /> },
  { label: 'Marketplace', icon: <ShoppingBagIcon className="h-5 w-5" /> },
  { label: 'Imports', icon: <ArrowPathIcon className="h-5 w-5" /> },
];
const bottomSidebarItems = [
  { label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" /> },
  { label: 'Help', icon: <QuestionMarkCircleIcon className="h-5 w-5" /> },
];
const sidebarUser = {
  name: 'Sana Dawoud',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
};

const scopeOptions = [
  { value: '', label: 'Select scope' },
  { value: 'everyone-but-self', label: 'Everyone but self' },
  { value: 'self', label: 'Self' },
  { value: 'direct-reports', label: 'Direct reports' },
  { value: 'indirect-reports', label: 'Indirect reports' },
  { value: 'reporting-line', label: 'Reporting line' },
  { value: 'legal-entity', label: 'Legal entity' },
  { value: 'department', label: 'Department' },
  { value: 'team', label: 'Team' },
  { value: 'workplace', label: 'Workplace' },
  { value: 'country', label: 'Country' },
  { value: 'custom', label: 'Custom conditions...' },
];

const mockEmployees = [
  { id: 1, name: 'Damon White', position: 'Sales Representative', scope: 'Legal Entity 1 (default)' },
  { id: 2, name: 'Charlie Thorpe', position: 'Software Engineer', scope: 'Legal Entity 1 (default)' },
  { id: 3, name: 'Brenna Stevens', position: 'Quality Assurance Engineer', scope: 'Legal Entity 1 (default)' },
  { id: 4, name: 'Anneke van der Meer', position: 'Marketing Specialist', scope: 'Legal Entity 1 (default)' },
  { id: 5, name: 'Bente de Jong', position: 'Software Engineer', scope: 'Legal Entity 2 (default)' },
];

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ backgroundColor: '#fff59d', borderRadius: 2 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

function App() {
  const [step, setStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [permissions, setPermissions] = useState<SelectedPermission[]>([]);
  const [name, setName] = useState('');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [categoryPopoverAnchor, setCategoryPopoverAnchor] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tempSelectedPermissions, setTempSelectedPermissions] = useState<SelectedPermission[]>([]);
  const [dialogCategory, setDialogCategory] = useState<string>('');
  const [dialogSelectedPermissions, setDialogSelectedPermissions] = useState<SelectedPermission[]>([]);
  const [expandedDialogSubdomains, setExpandedDialogSubdomains] = useState<Record<string, boolean>>({});
  const [categorySearch, setCategorySearch] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDomain, setEditDomain] = useState<string | null>(null);
  const [editDomainPermissions, setEditDomainPermissions] = useState<SelectedPermission[]>([]);
  const [editDialogExpandedSubdomains, setEditDialogExpandedSubdomains] = useState<Record<string, boolean>>({});
  const [addDialogSearch, setAddDialogSearch] = useState('');
  const [editDialogSearch, setEditDialogSearch] = useState('');
  const [manuallyCollapsedDialogSubdomains, setManuallyCollapsedDialogSubdomains] = useState<Record<string, boolean>>({});
  const [lastAddDialogSearch, setLastAddDialogSearch] = useState('');
  const [manuallyCollapsedEditDialogSubdomains, setManuallyCollapsedEditDialogSubdomains] = useState<Record<string, boolean>>({});
  const [lastEditDialogSearch, setLastEditDialogSearch] = useState('');
  const [initialDialogSelectedPermissions, setInitialDialogSelectedPermissions] = useState<SelectedPermission[]>([]);
  const [initialEditDomainPermissions, setInitialEditDomainPermissions] = useState<SelectedPermission[]>([]);

  // Ref for popover and button
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  const handleAccessLevelChange = (index: number, level: AccessLevel) => {
    setPermissions(prev =>
      prev.map((p, i) =>
        i === index ? { ...p, accessLevel: level } : p
      )
    );
  };
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.domain]) {
      acc[permission.domain] = [];
    }
    acc[permission.domain].push(permission);
    return acc;
  }, {} as Record<string, SelectedPermission[]>);

  const handleEmployeeToggle = (id: number) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };
  const filteredEmployees = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.position.toLowerCase().includes(search.toLowerCase()) ||
    emp.scope.toLowerCase().includes(search.toLowerCase())
  );

  // Permissions step logic for inline dropdown
  const handleOpenCategoryPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCategoryPopoverAnchor(event.currentTarget);
  };
  const handleCloseCategoryPopover = () => {
    setCategoryPopoverAnchor(null);
    setCategorySearch('');
  };
  const handleSelectCategory = (category: string) => {
    if (permissions.some(p => p.domain === category)) {
      handleOpenEditDomain(category);
      setCategoryPopoverAnchor(null);
      return;
    }
    setDialogCategory(category);
    const domain = permissionsData.find(d => d.name === category);
    if (domain) {
      const perms = domain.permissions.map(permission => ({
        domain: category,
        subdomain: permission.subdomain || '-',
        permission: permission.name,
        isEnabled: false,
        accessLevel: permission.supportedActions.includes('View') ? ('View' as AccessLevel) : undefined,
        isSensitive: permission.isSensitive,
        noScopeLimit: permission.noScopeLimit,
        supportedActions: permission.supportedActions
      }));
      setDialogSelectedPermissions(perms);
      setInitialDialogSelectedPermissions(perms);
      // Initialize all groups as collapsed
      const groupedBySubdomain = domain.permissions.reduce((acc: Record<string, any[]>, permission: any) => {
        const subdomain = permission.subdomain || '-';
        if (!acc[subdomain]) acc[subdomain] = [];
        acc[subdomain].push(permission);
        return acc;
      }, {});
      const collapsedState: Record<string, boolean> = {};
      Object.keys(groupedBySubdomain).forEach(subdomain => {
        collapsedState[subdomain] = false; // All groups start collapsed
      });
      setExpandedDialogSubdomains(collapsedState);
      setAddDialogSearch(categorySearch); // <-- Set dialog search to popover search
    } else {
      setDialogSelectedPermissions([]);
      setInitialDialogSelectedPermissions([]);
      setExpandedDialogSubdomains({});
      setAddDialogSearch(categorySearch); // <-- Set dialog search to popover search
    }
    setCategoryPopoverAnchor(null);
    setIsDialogOpen(true);
    setCategorySearch(''); // <-- Clear popover search after opening dialog
  };
  const handleTempPermissionToggle = (permission: any) => {
    setTempSelectedPermissions(prev => {
      const existing = prev.find(p => p.permission === permission.name);
      if (existing) {
        return prev.filter(p => p.permission !== permission.name);
      } else {
        const newPermission: SelectedPermission = {
          domain: selectedCategory!,
          subdomain: permission.subdomain || '-',
          permission: permission.name,
          isEnabled: true,
          accessLevel: permission.supportedActions.includes('View') ? 'View' : undefined,
          isSensitive: permission.isSensitive,
        };
        return [...prev, newPermission];
      }
    });
  };
  const handleTempAccessLevelChange = (permission: any, level: AccessLevel) => {
    setTempSelectedPermissions(prev =>
      prev.map(p =>
        p.permission === permission.name
          ? { ...p, accessLevel: level }
          : p
      )
    );
  };
  const handleAddTempPermissions = () => {
    setPermissions(prev => [...prev, ...tempSelectedPermissions]);
    setSelectedCategory(null);
    setTempSelectedPermissions([]);
  };
  const handleCancelAddPermissions = () => {
    setSelectedCategory(null);
    setTempSelectedPermissions([]);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDialogCategory('');
    setDialogSelectedPermissions([]);
  };
  const handleDialogPermissionToggle = (permission: any, subdomain: string) => {
    setDialogSelectedPermissions(prev => {
      const existing = prev.find(p => p.permission === permission.name && p.subdomain === subdomain);
      if (existing) {
        return prev.map(p =>
          p.permission === permission.name && p.subdomain === subdomain
            ? { ...p, isEnabled: !p.isEnabled }
            : p
        );
      } else {
        return [...prev, {
          domain: dialogCategory,
          subdomain: subdomain,
          permission: permission.name,
          isEnabled: true,
          accessLevel: permission.supportedActions.includes('View') ? 'View' : undefined,
          isSensitive: permission.isSensitive,
        }];
      }
    });
  };
  const handleDialogSave = () => {
    setPermissions(prev => [...prev, ...dialogSelectedPermissions]);
    handleCloseDialog();
  };

  const handleOpenEditDomain = (domain: string) => {
    setEditDomain(domain);
    // Always get the latest permissions for this domain
    const domainData = permissionsData.find(d => d.name === domain);
    if (domainData) {
      // Get existing permissions for this domain from the latest permissions state
      const existingPermissions = permissions.filter(p => p.domain === domain);
      // Create new permissions array with correct initial states
      const domainPermissions = domainData.permissions.map(permission => {
        const subdomain = permission.subdomain || '-';
        const existingPermission = existingPermissions.find(p => p.permission === permission.name && p.subdomain === subdomain);
        return {
          domain: domain,
          subdomain: subdomain,
          permission: permission.name,
          isEnabled: existingPermission ? existingPermission.isEnabled : false,
          accessLevel: existingPermission ? existingPermission.accessLevel : (permission.supportedActions.includes('View') ? 'View' : undefined),
          isSensitive: permission.isSensitive,
          noScopeLimit: permission.noScopeLimit,
          supportedActions: permission.supportedActions
        };
      });
      setEditDomainPermissions(domainPermissions.map(p => ({ ...p }))); // ensure new objects
      setInitialEditDomainPermissions(domainPermissions.map(p => ({ ...p })));
      // Set up expanded states for subdomains
      const groupedBySubdomain = domainPermissions.reduce((acc: Record<string, any[]>, permission: any) => {
        const subdomain = permission.subdomain || '-';
        if (!acc[subdomain]) acc[subdomain] = [];
        acc[subdomain].push(permission);
        return acc;
      }, {});
      const collapsedState: Record<string, boolean> = {};
      Object.keys(groupedBySubdomain).forEach(subdomain => {
        if (subdomain !== '-') {
          collapsedState[subdomain] = groupedBySubdomain[subdomain].some(p => p.isEnabled);
        }
      });
      setEditDialogExpandedSubdomains(collapsedState);
      setEditDialogSearch('');
    }
    setIsEditDialogOpen(true);
  };

  // Handler for toggling a permission in edit dialog
  const handleEditPermissionToggle = (permissionName: string, subdomain: string) => {
    setEditDomainPermissions(prev =>
      prev.map(p =>
        p.permission === permissionName && p.subdomain === subdomain
          ? { ...p, isEnabled: !p.isEnabled }
          : p
      )
    );
  };

  // Handler to save changes from edit dialog
  const handleSaveEditDialog = () => {
    if (!editDomain) return;
    
    // Only keep enabled permissions for the domain, remove domain if all are disabled
    const enabledPermissions = editDomainPermissions.filter(p => p.isEnabled);
    
    setPermissions(prev => {
      // Remove all permissions for this domain
      const filtered = prev.filter(p => p.domain !== editDomain);
      // If any permissions are enabled, add them back
      if (enabledPermissions.length > 0) {
        return [...filtered, ...enabledPermissions];
      }
      // If none enabled, just return filtered (domain removed)
      return filtered;
    });
    
    setIsEditDialogOpen(false);
  };

  // Edit dialog: handle group chevron click and update auto-expanded ref
  const handleEditDialogSubdomainChevron = (subdomain: string) => {
    setEditDialogExpandedSubdomains(prev => ({
      ...prev,
      [subdomain]: !prev[subdomain]
    }));
    setManuallyCollapsedEditDialogSubdomains(prev => ({
      ...prev,
      [subdomain]: editDialogExpandedSubdomains[subdomain] ? true : false
    }));
  };

  const handleDialogSubdomainChevron = (subdomain: string) => {
    setExpandedDialogSubdomains(prev => ({
      ...prev,
      [subdomain]: !prev[subdomain]
    }));
    setManuallyCollapsedDialogSubdomains(prev => ({
      ...prev,
      [subdomain]: expandedDialogSubdomains[subdomain] // true if currently expanded, so now will be collapsed
        ? true
        : false
    }));
  };

  // Add dialog: expand groups with matches on search, respect manual collapse
  useEffect(() => {
    if (addDialogSearch === '' || dialogSelectedPermissions.length === 0) {
      setLastAddDialogSearch('');
      return;
    }
    const q = addDialogSearch.trim().toLowerCase();
    setLastAddDialogSearch(q);
    const groupedBySubdomain = dialogSelectedPermissions.reduce((acc: Record<string, any[]>, permission: any) => {
      const subdomain = permission.subdomain || '-';
      if (!acc[subdomain]) acc[subdomain] = [];
      acc[subdomain].push(permission);
      return acc;
    }, {});
    const filterPermission = (permission: any) =>
      permission.permission.toLowerCase().includes(q) ||
      (permission.subdomain && permission.subdomain.toLowerCase().includes(q));
    const filteredGrouped = Object.entries(groupedBySubdomain).reduce((acc: any, [subdomain, perms]) => {
      const filteredPerms = (perms as any[]).filter(filterPermission);
      if (filteredPerms.length > 0) acc[subdomain] = filteredPerms;
      return acc;
    }, {});
    // Expand groups with matches unless manually collapsed
    setExpandedDialogSubdomains(prev => {
      const newState = { ...prev };
      Object.keys(groupedBySubdomain).forEach(subdomain => {
        if (filteredGrouped[subdomain]) {
          if (!manuallyCollapsedDialogSubdomains[subdomain]) {
            newState[subdomain] = true;
          }
        } else {
          newState[subdomain] = false;
        }
      });
      return newState;
    });
  }, [addDialogSearch, dialogSelectedPermissions, manuallyCollapsedDialogSubdomains]);

  useEffect(() => {
    if (addDialogSearch !== lastAddDialogSearch) {
      setManuallyCollapsedDialogSubdomains({});
    }
  }, [addDialogSearch, lastAddDialogSearch]);

  useEffect(() => {
    if (editDialogSearch === '' || editDomainPermissions.length === 0) {
      setLastEditDialogSearch('');
      return;
    }
    const q = editDialogSearch.trim().toLowerCase();
    setLastEditDialogSearch(q);
    const groupedBySubdomain = editDomainPermissions.reduce((acc: Record<string, typeof editDomainPermissions>, permission) => {
      const subdomain = permission.subdomain || '-';
      if (!acc[subdomain]) acc[subdomain] = [];
      acc[subdomain].push(permission);
      return acc;
    }, {});
    const filterPermission = (permission: any) =>
      permission.permission.toLowerCase().includes(q) ||
      (permission.subdomain && permission.subdomain.toLowerCase().includes(q));
    const filteredGrouped = Object.entries(groupedBySubdomain).reduce((acc: any, [subdomain, perms]) => {
      const filteredPerms = (perms as any[]).filter(filterPermission);
      if (filteredPerms.length > 0) acc[subdomain] = filteredPerms;
      return acc;
    }, {});
    setEditDialogExpandedSubdomains(prev => {
      const newState = { ...prev };
      Object.keys(groupedBySubdomain).forEach(subdomain => {
        if (filteredGrouped[subdomain]) {
          if (!manuallyCollapsedEditDialogSubdomains[subdomain]) {
            newState[subdomain] = true;
          }
        } else {
          newState[subdomain] = false;
        }
      });
      return newState;
    });
  }, [editDialogSearch, editDomainPermissions, manuallyCollapsedEditDialogSubdomains]);

  useEffect(() => {
    if (editDialogSearch !== lastEditDialogSearch) {
      setManuallyCollapsedEditDialogSubdomains({});
    }
  }, [editDialogSearch, lastEditDialogSearch]);

  // Helper to compare permission arrays
  function permissionsChanged(current: SelectedPermission[], initial: SelectedPermission[]) {
    if (current.length !== initial.length) return true;
    const sortFn = (a: SelectedPermission, b: SelectedPermission) =>
      a.permission.localeCompare(b.permission) || (a.subdomain || '').localeCompare(b.subdomain || '');
    const sortedCurrent = [...current].sort(sortFn);
    const sortedInitial = [...initial].sort(sortFn);
    for (let i = 0; i < sortedCurrent.length; i++) {
      const a = sortedCurrent[i];
      const b = sortedInitial[i];
      if (
        a.permission !== b.permission ||
        (a.subdomain || '') !== (b.subdomain || '') ||
        a.isEnabled !== b.isEnabled ||
        a.accessLevel !== b.accessLevel
      ) {
        return true;
      }
    }
    return false;
  }

  // Grouping/filtering logic and permissionsContent must be inside the renderStepContent or App function so all variables are in scope.
  const groupedBySubdomain = editDomainPermissions.reduce((acc: Record<string, typeof editDomainPermissions>, permission) => {
      const subdomain = permission.subdomain || '-';
      if (!acc[subdomain]) acc[subdomain] = [];
      acc[subdomain].push(permission);
      return acc;
    }, {});
    const q = editDialogSearch.trim().toLowerCase();
    const filterPermission = (permission: any) =>
      permission.permission.toLowerCase().includes(q) ||
      (permission.subdomain && permission.subdomain.toLowerCase().includes(q));
  const filteredGrouped = Object.entries(groupedBySubdomain).reduce((acc: any, [subdomain, perms]) => {
    const filteredPerms = (perms as any[]).filter(filterPermission);
    if (filteredPerms.length > 0) acc[subdomain] = filteredPerms;
    return acc;
  }, {});
  const groupedEntries = Object.entries(filteredGrouped).filter(([subdomain]) => subdomain !== '-') as [string, any[]][];
  const ungroupedEntries = Object.entries(filteredGrouped).filter(([subdomain]) => subdomain === '-') as [string, any[]][];

  const permissionsContent = groupedEntries.length === 0 && ungroupedEntries.length === 0 ? (
    <div className="p-4 text-gray-500">No permissions found.</div>
  ) : (
    <div>
      {/* Grouped permissions */}
      {groupedEntries.map(([subdomain, subPermissions], groupIndex) => {
        const expanded = editDialogExpandedSubdomains[subdomain] || false;
        const safeSubPermissions = Array.isArray(subPermissions) ? subPermissions : [];
        return (
          <div
            key={subdomain}
            className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all"
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
              <div
                className="flex flex-1 cursor-pointer items-center gap-4"
                onClick={() => handleEditDialogSubdomainChevron(subdomain)}
              >
                <ChevronDownIcon
                  className={`h-5 w-5 transform text-gray-500 transition-transform ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
                <span className="text-sm font-medium text-gray-900">
                  {highlightMatch(subdomain, editDialogSearch)}
                </span>
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                  {safeSubPermissions.length} permissions
                </span>
              </div>
              {expanded && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    const allEnabled = safeSubPermissions.every((permission: any) => permission.isEnabled);
                    setEditDomainPermissions(prev =>
                      prev.map(p =>
                        p.subdomain === subdomain
                          ? { ...p, isEnabled: !allEnabled }
                          : p
                      )
                    );
                  }}
                  className="ml-4 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-primary hover:bg-purple-50"
                >
                  {safeSubPermissions.every((permission: any) => permission.isEnabled)
                    ? 'Disable all'
                    : 'Enable all'}
                </button>
              )}
            </div>
            {expanded && (
              <div className="p-4">
                {safeSubPermissions.map((permission: any) => {
                  const found = editDomainPermissions.find(
                    p => p.permission === permission.permission && p.subdomain === permission.subdomain
                  );
                  return permission && permission.supportedActions ? (
                    <div
                      key={permission.permission}
                      className="mb-2 flex items-center justify-between rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={!!found?.isEnabled}
                            onChange={() => {
                              setEditDomainPermissions(prev =>
                                prev.map(p =>
                                  p.permission === permission.permission && p.subdomain === permission.subdomain
                                    ? { ...p, isEnabled: !p.isEnabled }
                                    : p
                                )
                              );
                            }}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
                        </label>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {highlightMatch(permission.permission, editDialogSearch)}
                        </span>
                        {permission.isSensitive && (
                          <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            Sensitive
                          </span>
                        )}
                        {permission.noScopeLimit && (
                          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            No scope limit
                          </span>
                        )}
                      </div>
                      {(() => {
                        const normalizedActions = Array.isArray(permission.supportedActions)
                          ? permission.supportedActions
                          : typeof permission.supportedActions === 'string'
                            ? permission.supportedActions.split(' - ').map((s: string) => s.trim())
                            : [];
                        return found?.isEnabled &&
                          normalizedActions.length > 0 &&
                          ['View', 'Propose', 'Edit'].some(action => normalizedActions.includes(action)) &&
                          !normalizedActions.includes('Yes - No') && (
                            <div className="ml-4 inline-flex rounded-lg border border-gray-200 bg-white p-1">
                              {['View', 'Propose', 'Edit'].map(action => (
                                <button
                                  key={action}
                                  disabled={!normalizedActions.includes(action)}
                                  onClick={() => {
                                    setEditDomainPermissions(prev =>
                                      prev.map(p =>
                                        p.permission === permission.permission && p.subdomain === permission.subdomain
                                          ? { ...p, accessLevel: action as AccessLevel }
                                          : p
                                      )
                                    );
                                  }}
                                  className={`rounded-md px-3 py-1 text-sm font-medium ${
                                    found.accessLevel === action
                                      ? 'bg-primary text-white'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          );
                      })()}
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        );
      })}
      {/* Ungrouped permissions */}
      {ungroupedEntries.map(([subdomain, subPermissions]) => {
        const safeSubPermissions = Array.isArray(subPermissions) ? subPermissions : [];
        return safeSubPermissions.map((permission: any) => {
          const found = editDomainPermissions.find(
            p => p.permission === permission.permission && p.subdomain === permission.subdomain
          );
          return permission && permission.supportedActions ? (
            <div
              key={permission.permission}
              className={`mb-2 flex items-center justify-between rounded-lg border p-4 ${
                found?.isEnabled ? 'border-primary' : 'border-gray-200'
              } hover:border-primary hover:bg-gray-50`}
            >
              <div className="flex items-center">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={!!found?.isEnabled}
                    onChange={() => {
                      setEditDomainPermissions(prev =>
                        prev.map(p =>
                          p.permission === permission.permission && p.subdomain === permission.subdomain
                            ? { ...p, isEnabled: !p.isEnabled }
                            : p
                        )
                      );
                    }}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
                </label>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {highlightMatch(permission.permission, editDialogSearch)}
                </span>
                {permission.isSensitive && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                    Sensitive
                  </span>
                )}
                {permission.noScopeLimit && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    No scope limit
                  </span>
                )}
              </div>
              {(() => {
                const normalizedActions = Array.isArray(permission.supportedActions)
                  ? permission.supportedActions
                  : typeof permission.supportedActions === 'string'
                    ? permission.supportedActions.split(' - ').map((s: string) => s.trim())
                    : [];
                return found?.isEnabled &&
                  normalizedActions.length > 0 &&
                  ['View', 'Propose', 'Edit'].some(action => normalizedActions.includes(action)) &&
                  !normalizedActions.includes('Yes - No') && (
                    <div className="ml-4 inline-flex rounded-lg border border-gray-200 bg-white p-1">
                      {['View', 'Propose', 'Edit'].map(action => (
                        <button
                          key={action}
                          disabled={!normalizedActions.includes(action)}
                          onClick={() => {
                            setEditDomainPermissions(prev =>
                              prev.map(p =>
                                p.permission === permission.permission && p.subdomain === permission.subdomain
                                  ? { ...p, accessLevel: action as AccessLevel }
                                  : p
                              )
                            );
                          }}
                          className={`rounded-md px-3 py-1 text-sm font-medium ${
                            found.accessLevel === action
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-50'
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  );
              })()}
            </div>
          ) : null;
        });
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="mt-8">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Create a new permission set
              </h1>
              <p className="mb-6 text-sm text-gray-500">
                A permission set is a collection of permissions that can be assigned to employees. You can create multiple permission sets for different roles or departments.
              </p>
              <form className="flex flex-col gap-6" noValidate autoComplete="off">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter a name for this permission set"
                  />
                </div>
                <div className="hidden">
                  <label htmlFor="scope" className="mb-1 block text-sm font-medium text-gray-700">
                    Scope
                  </label>
                  <select
                    id="scope"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {scopeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter a description for this permission set"
                    rows={4}
                  />
                </div>
              </form>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="min-h-[calc(100vh-80px)] bg-white">
            <div className="flex items-center justify-between px-8 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Permissions</h2>
              <button
                ref={buttonRef}
                type="button"
                className="flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={handleOpenCategoryPopover}
              >
                Add permissions
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Category Popover */}
            {Boolean(categoryPopoverAnchor) && (
              <div
                ref={popoverRef}
                className="w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
                style={popoverStyle}
              >
                <div className="p-4">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={e => setCategorySearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                      onClick={e => e.stopPropagation()}
                      onMouseDown={e => e.stopPropagation()}
                    />
                    {categorySearch && (
                      <button
                        onClick={() => setCategorySearch('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  {permissionsData
                    .filter(domain => {
                      const q = categorySearch.trim().toLowerCase();
                      if (!q) return true;
                      if (domain.name.toLowerCase().includes(q)) return true;
                      if (domain.permissions.some(p =>
                        (p.subdomain && p.subdomain.toLowerCase().includes(q)) ||
                        p.name.toLowerCase().includes(q)
                      )) return true;
                      return false;
                    })
                    .map((domain: any) => (
                      <button
                        key={domain.name}
                        onClick={() => { handleSelectCategory(domain.name); handleCloseCategoryPopover(); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {domain.name}
                      </button>
                    ))}
                  {permissionsData.filter(domain => {
                    const q = categorySearch.trim().toLowerCase();
                    if (!q) return true;
                    if (domain.name.toLowerCase().includes(q)) return true;
                    if (domain.permissions.some(p =>
                      (p.subdomain && p.subdomain.toLowerCase().includes(q)) ||
                      p.name.toLowerCase().includes(q)
                    )) return true;
                    return false;
                  }).length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
                  )}
                </div>
              </div>
            )}

            {/* Permissions List */}
            <div className="px-8 py-4">
              {/* Empty state */}
              {permissions.length === 0 && (
                <div className="flex min-h-[50vh] flex-col items-center justify-center">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">Add permission</h3>
                  <p className="text-sm text-gray-500">Permissions will be listed here.</p>
                </div>
              )}

              {/* Permissions by domain */}
              {Array.from(new Set(permissions.map(p => p.domain))).map(domain => (
                <div
                  key={domain}
                  onClick={() => handleOpenEditDomain(domain)}
                  className="mb-4 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 hover:border-primary hover:shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{domain}</h3>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-60 right-0 z-50 flex items-center justify-end gap-4 border-t border-gray-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Next
              </button>
            </div>

            {/* Edit Permission dialog */}
            {isEditDialogOpen && editDomain && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  {/* Backdrop */}
                  <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseEditDialog} />
                  
                  {/* Dialog */}
                  <div className="relative w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-0">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Edit Permissions - {editDomain}
                      </h2>
                      <button
                        onClick={handleCloseEditDialog}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Search */}
                      <div className="relative mb-6">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={editDialogSearch}
                          onChange={e => setEditDialogSearch(e.target.value)}
                          placeholder="Search permissions or subdomains..."
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      {/* Permissions Content */}
                      {permissionsContent}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-4 border-t border-gray-200 bg-gray-50 p-6">
                      <button
                        type="button"
                        onClick={handleCloseEditDialog}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEditDialog}
                        disabled={!permissionsChanged(editDomainPermissions, initialEditDomainPermissions)}
                        className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="mt-4 rounded-lg bg-white p-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Assign Users</h2>
            <p className="mb-6 text-sm text-gray-500">Assign this permission set to employees, groups, or roles.</p>
            <input
              type="text"
              placeholder="Search people, departments, teams, offices, etc."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200">
              {filteredEmployees.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No employees found.</p>
              ) : (
                filteredEmployees.map(emp => (
                  <div key={emp.id} className="flex items-center border-b border-gray-100 px-4 py-2 last:border-b-0">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleEmployeeToggle(emp.id)}
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.position}</p>
                    </div>
                    <p className="text-xs text-gray-500">{emp.scope}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="mt-4 rounded-lg bg-white p-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Set effective date and confirm</h2>
            <p className="mb-6 text-sm text-gray-500">Review your changes and set when they should take effect.</p>
            
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Permission Set</h3>
              <div className="mb-4 flex flex-wrap gap-8">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-base text-gray-900">{name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scope</p>
                  <p className="text-base text-gray-900">{scopeOptions.find(o => o.value === scope)?.label || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-base text-gray-900">{description || '-'}</p>
                </div>
              </div>

              <div className="my-4 border-t border-gray-200" />
              
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Permissions</h3>
              {Object.entries(groupedPermissions).map(([domain, domainPermissions]) => (
                <div key={domain} className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{domain}</h4>
                  {domainPermissions.map((permission: SelectedPermission) => (
                    <div key={permission.permission} className="ml-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {permission.permission}
                      </span>
                      {permission.accessLevel && (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                          {permission.accessLevel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <div className="my-4 border-t border-gray-200" />
              
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Assignees</h3>
              <div className="ml-4">
                {selectedEmployees.length === 0 ? (
                  <p className="text-sm text-gray-500">No assignees selected.</p>
                ) : (
                  mockEmployees
                    .filter(emp => selectedEmployees.includes(emp.id))
                    .map(emp => (
                      <p key={emp.id} className="text-sm text-gray-900">
                        {emp.name} — <span className="text-gray-500">{emp.position}</span>
                      </p>
                    ))
                )}
              </div>

              <div className="my-4 border-t border-gray-200" />
              
              <div className="mt-4 flex items-center gap-4">
                <p className="text-sm font-medium text-gray-900">Effective date:</p>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={e => setEffectiveDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        );
    }
    return null;
  };

  const renderBreadcrumbs = () => {
    return (
      <div className="flex w-full items-center justify-center gap-1 text-sm">
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <div
              className={`flex items-center gap-1 ${
                index === step
                  ? 'text-gray-900 opacity-90 font-medium'
                  : 'text-gray-900 opacity-60 font-normal'
              } ${index <= step ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => {
                if (index <= step) setStep(index);
              }}
              role="button"
              tabIndex={index <= step ? 0 : -1}
              aria-disabled={index > step}
            >
              <p className="select-none">{label}</p>
            </div>
            {index < steps.length - 1 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Handler to close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  // Position popover when opening
  useEffect(() => {
    if (categoryPopoverAnchor && buttonRef.current && popoverRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popover = popoverRef.current;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setPopoverStyle({
        position: 'absolute',
        left: `${buttonRect.right - popover.offsetWidth}px`,
        top: `${buttonRect.bottom + 2 + scrollTop}px`, // 2px gap
        zIndex: 50,
      });
    }
    if (!categoryPopoverAnchor) return;
    function handleClick(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleCloseCategoryPopover();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [categoryPopoverAnchor]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200">
        <div className="flex h-full flex-col">
          {/* Main Navigation (with logo and name) */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            {/* Company Logo and Name */}
            <div className="flex items-center gap-3 px-3 py-2">
              <span className="h-5 w-5 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
                  <path d="M10 5L13 13H7L10 5Z" fill="currentColor" />
                </svg>
              </span>
              <span className="text-sm font-bold text-gray-900">Acme Inc</span>
            </div>
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="h-5 w-5">{item.icon}</span>
                <span className="text-left font-normal text-sm">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Navigation and User Profile */}
          <div className="border-t border-gray-200 p-2">
            {bottomSidebarItems.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="h-5 w-5">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* User Profile */}
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <img
                src={sidebarUser.avatar}
                alt={sidebarUser.name}
                className="h-5 w-5 rounded-full"
              />
              <span className="text-sm font-medium text-gray-900">{sidebarUser.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-60 flex-1 bg-white">
        <div className="h-full overflow-y-auto flex flex-col">
          {/* Header with Close Button and Breadcrumbs */}
          <div className="relative border-b border-gray-200 bg-white px-8 py-4 flex items-center sticky top-0 z-30" style={{ minHeight: '56px' }}>
            {/* Close Button */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-[0_0_0_0.5px_rgba(32,32,32,0.06),0_0.5px_2.5px_0_rgba(32,32,32,0.2)] focus:outline-none hover:bg-gray-100"
              aria-label="Close"
              onClick={() => window.location.href = '/'}
              style={{ boxShadow: '0 0 0 0.5px rgba(32,32,32,0.06), 0 0.5px 2.5px 0 rgba(32,32,32,0.2)' }}
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex-1 flex justify-center">
              {renderBreadcrumbs()}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 p-8">
            {renderStepContent()}
          </div>

          {/* Consistent Footer */}
          <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-end gap-4" style={{ minHeight: '56px' }}>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Back
              </button>
            )}
            {step < steps.length - 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Next
              </button>
            )}
            {step === steps.length - 1 && (
              <button
                type="button"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
