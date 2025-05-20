import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Button,
  IconButton,
  Chip,
  CssBaseline,
  Switch,
  Collapse,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import AssistantIcon from '@mui/icons-material/SmartToyOutlined';
import PeopleIcon from '@mui/icons-material/GroupsOutlined';
import FlashOnIcon from '@mui/icons-material/FlashOnOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnOutlined';
import ReportProblemIcon from '@mui/icons-material/ReportProblemOutlined';
import PollIcon from '@mui/icons-material/PollOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ImportExportIcon from '@mui/icons-material/ImportExportOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { theme } from './theme';
import { AccessLevel } from './types/permissions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Popover from '@mui/material/Popover';
import { permissionsData } from './data/permissionsData';
import { SelectedPermission } from './components/PermissionsManager';
import Divider from '@mui/material/Divider';

const steps = ['Get started', 'Permissions', 'Assignees', 'Confirm'];
const drawerWidth = 240;

const sidebarItems = [
  { label: 'Home', icon: <HomeIcon fontSize="small" /> },
  { label: 'Inbox', icon: <InboxIcon fontSize="small" />, badge: 6 },
  { label: 'Assistant', icon: <AssistantIcon fontSize="small" /> },
  { label: 'Employees', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Automations', icon: <FlashOnIcon fontSize="small" /> },
  { label: 'Calendars', icon: <CalendarMonthIcon fontSize="small" /> },
  { label: 'Analytics', icon: <BarChartIcon fontSize="small" /> },
  { label: 'Time Tracking', icon: <AccessTimeIcon fontSize="small" /> },
  { label: 'Payroll', icon: <PaymentsIcon fontSize="small" /> },
  { label: 'Recruiting', icon: <WorkOutlineIcon fontSize="small" /> },
  { label: 'Performance & Development', icon: <BarChartIcon fontSize="small" /> },
  { label: 'Training', icon: <SchoolIcon fontSize="small" /> },
  { label: 'Compensation', icon: <MonetizationOnIcon fontSize="small" /> },
  { label: 'Whistleblowing', icon: <ReportProblemIcon fontSize="small" /> },
  { label: 'Surveys', icon: <PollIcon fontSize="small" /> },
  { label: 'Marketplace', icon: <StorefrontIcon fontSize="small" /> },
  { label: 'Imports', icon: <ImportExportIcon fontSize="small" /> },
];
const bottomSidebarItems = [
  { label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
  { label: 'Help', icon: <HelpOutlineIcon fontSize="small" /> },
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
      setAddDialogSearch('');
    } else {
      setDialogSelectedPermissions([]);
      setInitialDialogSelectedPermissions([]);
      setExpandedDialogSubdomains({});
      setAddDialogSearch('');
    }
    setCategoryPopoverAnchor(null);
    setIsDialogOpen(true);
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
    <Typography sx={{ p: 2 }}>No permissions found.</Typography>
  ) : (
    <Box>
      {/* Grouped permissions */}
      {groupedEntries.map(([subdomain, subPermissions], groupIndex) => {
        const expanded = editDialogExpandedSubdomains[subdomain] || false;
        const safeSubPermissions = Array.isArray(subPermissions) ? subPermissions : [];
        return (
          <Box
            key={subdomain}
            sx={{
              mb: 2,
              borderRadius: 1,
              overflow: 'hidden',
              border: expanded ? '1px solid' : 'none',
              borderColor: expanded ? 'primary.main' : 'transparent',
              boxShadow: expanded ? 2 : 0,
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'background.default',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, cursor: 'pointer' }}
                onClick={() => handleEditDialogSubdomainChevron(subdomain)}
              >
                <ExpandMoreIcon
                  sx={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
                <Typography variant="subtitle1">
                  {highlightMatch(subdomain, editDialogSearch)}
                </Typography>
                <Chip
                  label={`${safeSubPermissions.length} permissions`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              {expanded && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 10,
                    fontWeight: 500,
                    fontSize: 14,
                    textTransform: 'none',
                    ml: 2,
                    minWidth: 110,
                    border: '1px solid #B0B0B0',
                    color: '#7c3aed',
                    background: '#fff',
                    '&:hover': {
                      background: '#f3e8ff',
                      border: '1px solid #B0B0B0',
                    },
                  }}
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
                >
                  {safeSubPermissions.every((permission: any) => permission.isEnabled)
                    ? 'Disable all'
                    : 'Enable all'}
                </Button>
              )}
            </Box>
            <Collapse in={expanded}>
              <Box sx={{ p: 2 }}>
                {safeSubPermissions.map((permission: any, index: number) => {
                  const found = editDomainPermissions.find(p => p.permission === permission.permission && p.subdomain === permission.subdomain);
                  return permission && permission.supportedActions ? (
                    <Box
                      key={permission.permission}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Switch
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
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="body1">{highlightMatch(permission.permission, editDialogSearch)}</Typography>
                          {permission.isSensitive && (
                            <Chip label="Sensitive" size="small" color="error" sx={{ ml: 1 }} />
                          )}
                          {permission.noScopeLimit && (
                            <Chip label="No scope limit" size="small" sx={{ bgcolor: '#FFD580', color: '#111', ml: 1 }} />
                          )}
                        </Box>
                      </Box>
                      {(() => {
                        const normalizedActions = Array.isArray(permission.supportedActions)
                          ? permission.supportedActions
                          : typeof permission.supportedActions === 'string'
                            ? permission.supportedActions.split(' - ').map((s: string) => s.trim())
                            : [];
                        const debug = { permission, found, supportedActions: permission.supportedActions, normalizedActions };
                        console.log('DBG-Grouped', debug);
                        return found?.isEnabled &&
                          normalizedActions.length > 0 &&
                          ['View', 'Propose', 'Edit'].some(action => normalizedActions.includes(action)) &&
                          !normalizedActions.includes('Yes - No') && (
                            <ToggleButtonGroup
                              value={found.accessLevel || ''}
                              exclusive
                              onChange={(_, value) => {
                                if (!value) return;
                                setEditDomainPermissions(prev =>
                                  prev.map(p =>
                                    p.permission === permission.permission && p.subdomain === permission.subdomain
                                      ? { ...p, accessLevel: value }
                                      : p
                                  )
                                );
                              }}
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              <ToggleButton value="View" disabled={!normalizedActions.includes('View')}>View</ToggleButton>
                              <ToggleButton value="Propose" disabled={!normalizedActions.includes('Propose')}>Propose</ToggleButton>
                              <ToggleButton value="Edit" disabled={!normalizedActions.includes('Edit')}>Edit</ToggleButton>
                            </ToggleButtonGroup>
                          );
                      })()}
                    </Box>
                  ) : null;
                })}
              </Box>
            </Collapse>
          </Box>
        );
      })}
      {/* Ungrouped permissions */}
      {ungroupedEntries.map(([subdomain, subPermissions]: [string, any[]]) => {
        const safeSubPermissions = Array.isArray(subPermissions) ? subPermissions : [];
        return safeSubPermissions.map((permission: any) => {
          const found = editDomainPermissions.find(p => p.permission === permission.permission && p.subdomain === permission.subdomain);
          return permission && permission.supportedActions ? (
            <Box
              key={permission.permission}
              sx={{
                p: 2,
                mb: 1,
                border: '1px solid',
                borderColor: found?.isEnabled ? 'primary.main' : 'divider',
                borderRadius: 1,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Switch
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
                  sx={{ mr: 2 }}
                />
                <Typography variant="body1">{highlightMatch(permission.permission, editDialogSearch)}</Typography>
                {permission.isSensitive && (
                  <Chip label="Sensitive" size="small" color="error" sx={{ ml: 1 }} />
                )}
                {permission.noScopeLimit && (
                  <Chip label="No scope limit" size="small" sx={{ bgcolor: '#FFD580', color: '#111', ml: 1 }} />
                )}
              </Box>
              {(() => {
                const normalizedActions = Array.isArray(permission.supportedActions)
                  ? permission.supportedActions
                  : typeof permission.supportedActions === 'string'
                    ? permission.supportedActions.split(' - ').map((s: string) => s.trim())
                    : [];
                const debug = { permission, found, supportedActions: permission.supportedActions, normalizedActions };
                console.log('DBG-Ungrouped', debug);
                return found?.isEnabled &&
                  normalizedActions.length > 0 &&
                  ['View', 'Propose', 'Edit'].some(action => normalizedActions.includes(action)) &&
                  !normalizedActions.includes('Yes - No') && (
                    <ToggleButtonGroup
                      value={found.accessLevel || ''}
                      exclusive
                      onChange={(_, value) => {
                        if (!value) return;
                        setEditDomainPermissions(prev =>
                          prev.map(p =>
                            p.permission === permission.permission && p.subdomain === permission.subdomain
                              ? { ...p, accessLevel: value }
                              : p
                          )
                        );
                      }}
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      <ToggleButton value="View" disabled={!normalizedActions.includes('View')}>View</ToggleButton>
                      <ToggleButton value="Propose" disabled={!normalizedActions.includes('Propose')}>Propose</ToggleButton>
                      <ToggleButton value="Edit" disabled={!normalizedActions.includes('Edit')}>Edit</ToggleButton>
                    </ToggleButtonGroup>
                  );
              })()}
            </Box>
          ) : null;
        });
      })}
    </Box>
  );

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <Box sx={{ p: 0, maxWidth: '100vw', minHeight: 'calc(100vh - 80px)', bgcolor: '#fff' }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Get started
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Give a name, a default data scope and general description
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Name"
                placeholder="Enter a unique name"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                variant="outlined"
                size="medium"
              />
              <TextField
                select
                label="Scope access"
                value={scope}
                onChange={e => setScope(e.target.value)}
                fullWidth
                variant="outlined"
                size="medium"
              >
                {scopeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Description"
                placeholder="A summary of the type of people that should be assigned to this permissions set, their tasks and access rights."
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
                size="medium"
                inputProps={{ maxLength: 500 }}
                helperText={`${description.length}/500 characters`}
              />
            </Box>
          </Box>
          <Box
            sx={{
              position: 'fixed',
              left: `${drawerWidth}px`,
              bottom: 0,
              width: `calc(100vw - ${drawerWidth}px)`,
              bgcolor: '#fff',
              borderTop: '1px solid',
              borderColor: 'divider',
              py: 2,
              px: 6,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              zIndex: 1200,
            }}
          >
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <Button
                variant="outlined"
                sx={{
                  display: 'flex',
                  minWidth: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  height: 32,
                  padding: '7px 12px',
                  fontWeight: 500,
                  fontSize: 16,
                  textTransform: 'none',
                  background: '#fff',
                  color: '#111',
                  border: '1px solid #B0B0B0',
                  boxShadow: 'none',
                  gap: 2,
                  '&:hover': {
                    background: '#f3e8ff',
                    border: '1px solid #B0B0B0',
                  },
                }}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{
                  display: 'flex',
                  height: 32,
                  minWidth: 60,
                  padding: '7px 12px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: 10,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.00) 100%), #A533CC',
                  boxShadow: '0px 1px 2px 0px rgba(176,0,255,0.05)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 16,
                  textTransform: 'none',
                  boxShadowColor: 'rgba(176,0,255,0.05)',
                  '&:hover': {
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 100%), #9333ea',
                  },
                }}
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    if (step === 1) {
      return (
        <Box sx={{ p: 0, maxWidth: '100vw', minHeight: 'calc(100vh - 80px)', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'left' }}>Permissions</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                display: 'flex',
                height: 32,
                minWidth: 60,
                padding: '7px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                borderRadius: 10,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.00) 100%), #A533CC',
                boxShadow: '0px 1px 2px 0px rgba(176,0,255,0.05)',
                color: '#fff',
                fontWeight: 500,
                fontSize: 16,
                textTransform: 'none',
                boxShadowColor: 'rgba(176,0,255,0.05)',
                '&:hover': {
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 100%), #9333ea',
                },
              }}
              endIcon={<ExpandMoreIcon />}
              onClick={handleOpenCategoryPopover}
              disabled={isDialogOpen}
            >
              Add permissions
            </Button>
          </Box>
          <Popover
            open={Boolean(categoryPopoverAnchor)}
            anchorEl={categoryPopoverAnchor}
            onClose={handleCloseCategoryPopover}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { minWidth: 320, maxHeight: 400, overflowY: 'auto', borderRadius: 2 } }}
          >
            {/* Popover content: search and category list */}
            <Box sx={{ p: 2, pt: 2, pb: 1 }}>
              <TextField
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                placeholder="Search domains, subdomains, permissions..."
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                autoFocus
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                sx={{ mb: 1 }}
              />
            </Box>
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
                <MenuItem key={domain.name} onClick={() => { handleSelectCategory(domain.name); handleCloseCategoryPopover(); }}>
                  {domain.name}
                </MenuItem>
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
              <MenuItem disabled>No results found</MenuItem>
            )}
          </Popover>
          <Box sx={{ px: 4, pt: 2 }}>
            {/* Empty state */}
            {permissions.length === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', mt: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Add permission</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Permissions will be listed here.</Typography>
              </Box>
            )}
            {Array.from(new Set(permissions.map(p => p.domain))).map(domain => (
              <Box
                key={domain}
                onClick={() => handleOpenEditDomain(domain)}
                sx={{ cursor: 'pointer', p: 2, mb: 2, border: '1px solid', borderRadius: 2, bgcolor: '#fafafd', '&:hover': { borderColor: 'primary.main', boxShadow: 1 } }}
              >
                <Typography variant="h6">{domain}</Typography>
              </Box>
            ))}
          </Box>
          {/* Footer */}
          <Box
            sx={{
              position: 'fixed',
              left: `${drawerWidth}px`,
              bottom: 0,
              width: `calc(100vw - ${drawerWidth}px)`,
              bgcolor: '#fff',
              borderTop: '1px solid',
              borderColor: 'divider',
              py: 2,
              px: 6,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              zIndex: 1200,
            }}
          >
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <Button
                variant="outlined"
                sx={{
                  display: 'flex',
                  minWidth: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  height: 32,
                  padding: '7px 12px',
                  fontWeight: 500,
                  fontSize: 16,
                  textTransform: 'none',
                  background: '#fff',
                  color: '#111',
                  border: '1px solid #B0B0B0',
                  boxShadow: 'none',
                  gap: 2,
                  '&:hover': {
                    background: '#f3e8ff',
                    border: '1px solid #B0B0B0',
                  },
                }}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{
                  display: 'flex',
                  height: 32,
                  minWidth: 60,
                  padding: '7px 12px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: 10,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.00) 100%), #A533CC',
                  boxShadow: '0px 1px 2px 0px rgba(176,0,255,0.05)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 16,
                  textTransform: 'none',
                  boxShadowColor: 'rgba(176,0,255,0.05)',
                  '&:hover': {
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 100%), #9333ea',
                  },
                }}
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              >
                Next
              </Button>
            </Box>
          </Box>
          {/* Edit Permission dialog */}
          {isEditDialogOpen && editDomain && (
            <Dialog
              open={isEditDialogOpen}
              onClose={handleCloseEditDialog}
              fullWidth
              maxWidth="xl"
              PaperProps={{ sx: { minHeight: '90vh', borderRadius: 3, bgcolor: '#fff', boxShadow: 3, p: 0 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 4, pb: 0 }}>
                <DialogTitle sx={{ p: 0, fontWeight: 700, fontSize: 28, color: '#1a1a1a' }}>
                  Edit Permissions - {editDomain}
                </DialogTitle>
                <IconButton onClick={handleCloseEditDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <DialogContent sx={{ p: 4 }}>
                <TextField
                  value={editDialogSearch}
                  onChange={e => setEditDialogSearch(e.target.value)}
                  placeholder="Search permissions or subdomains..."
                  size="small"
                  fullWidth
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                {permissionsContent}
              </DialogContent>
              <DialogActions sx={{ p: 4, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fafafd' }}>
                <Button onClick={handleCloseEditDialog} color="inherit" sx={{
                  borderRadius: 10,
                  height: 32,
                  padding: '7px 12px',
                  fontWeight: 500,
                  fontSize: 16,
                  textTransform: 'none',
                  background: '#fff',
                  color: '#111',
                  border: '1px solid #B0B0B0',
                  boxShadow: 'none',
                  gap: 2,
                  '&:hover': {
                    background: '#f3e8ff',
                    border: '1px solid #B0B0B0',
                  },
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEditDialog}
                  variant="contained"
                  disabled={!permissionsChanged(editDomainPermissions, initialEditDomainPermissions)}
                  sx={{
                    borderRadius: 10,
                    height: 32,
                    padding: '7px 12px',
                    fontWeight: 500,
                    fontSize: 16,
                    textTransform: 'none',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.00) 100%), #A533CC',
                    boxShadow: '0px 1px 2px 0px rgba(176,0,255,0.05)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 100%), #9333ea',
                    },
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      );
    }

    if (step === 2) {
      return (
        <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4, maxWidth: 700, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Assign Users
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Assign this permission set to employees, groups, or roles.
          </Typography>
          <TextField
            placeholder="Search people, departments, teams, offices, etc."
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ maxHeight: 350, overflowY: 'auto', border: '1px solid #ececec', borderRadius: 2 }}>
            {filteredEmployees.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No employees found.
              </Typography>
            ) : (
              filteredEmployees.map(emp => (
                <Box key={emp.id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #f0f0f0' }}>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => handleEmployeeToggle(emp.id)}
                    style={{ marginRight: 12 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{emp.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{emp.position}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{emp.scope}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      );
    }

    if (step === 3) {
      return (
        <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4, maxWidth: 700, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Set effective date and confirm
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Review your changes and set when they should take effect.
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Permission Set</Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Scope</Typography>
                <Typography variant="body1">{scopeOptions.find(o => o.value === scope)?.label || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Description</Typography>
                <Typography variant="body1">{description || '-'}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Permissions</Typography>
            {Object.entries(groupedPermissions).map(([domain, domainPermissions]) => (
              <Box key={domain} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{domain}</Typography>
                {domainPermissions.map((permission: SelectedPermission, index: number) => (
                  <Box key={permission.permission} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', ml: 2 }}>
                    <Chip label={permission.permission} size="small" sx={{ bgcolor: '#ede9fe', color: '#7c3aed', fontWeight: 600 }} />
                    {permission.accessLevel && (
                      <Chip label={permission.accessLevel} size="small" sx={{ bgcolor: '#ede9fe', color: '#7c3aed', fontWeight: 600 }} />
                    )}
                  </Box>
                ))}
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Assignees</Typography>
            <Box sx={{ ml: 2 }}>
              {selectedEmployees.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No assignees selected.</Typography>
              ) : (
                mockEmployees.filter(emp => selectedEmployees.includes(emp.id)).map(emp => (
                  <Typography key={emp.id} variant="body2">{emp.name} — <span style={{ color: '#6b7280' }}>{emp.position}</span></Typography>
                ))
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Effective date:</Typography>
              <TextField
                type="date"
                value={effectiveDate}
                onChange={e => setEffectiveDate(e.target.value)}
                size="small"
                sx={{ width: 180 }}
                inputProps={{ min: new Date().toISOString().slice(0, 10) }}
              />
            </Box>
          </Box>
        </Box>
      );
    }
    return null;
  };

  const renderBreadcrumbs = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: index === step ? 'primary.main' : index < step ? 'text.secondary' : 'text.disabled',
                fontWeight: index === step ? 600 : 400,
                cursor: index <= step ? 'pointer' : 'default',
                textDecoration: 'none',
                opacity: index > step ? 0.5 : 1,
                transition: 'color 0.2s',
              }}
              onClick={() => {
                if (index <= step) setStep(index);
              }}
              component="span"
              role="button"
              tabIndex={index <= step ? 0 : -1}
              aria-disabled={index > step}
            >
              <Typography variant="body2" sx={{ userSelect: 'none' }}>{label}</Typography>
            </Box>
            {index < steps.length - 1 && (
              <Typography variant="body2" color="text.secondary">
                {'>'}
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  // Handler to close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f8fb' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#faf9fc',
              borderRight: 'none',
              px: 2,
              pt: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 1 }}>
              <Avatar sx={{ bgcolor: '#ede9fe', color: '#7c3aed', width: 32, height: 32, fontWeight: 700, fontSize: 20, mr: 1 }}>
                K
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: 20 }}>
                Kolhorn
              </Typography>
            </Box>
            {/* Scrollable menu */}
            <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pr: 0.5 }}>
              <List sx={{ p: 0 }}>
                {sidebarItems.map((item, idx) => (
                  <ListItemButton
                    key={item.label}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      pl: 2,
                      pr: 1.5,
                      py: 0.5,
                      fontWeight: 400,
                      fontSize: 16,
                      minHeight: 40,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {item.badge && (
                      <Chip label={item.badge} size="small" color="primary" />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Box>
            {/* Docked bottom section */}
            <Box sx={{ mb: 2, pl: 1 }}>
              <List sx={{ p: 0 }}>
                {bottomSidebarItems.map((item, idx) => (
                  <ListItemButton
                    key={item.label}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      pl: 2,
                      pr: 1.5,
                      py: 0.5,
                      fontWeight: 400,
                      fontSize: 16,
                      minHeight: 40,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
                {/* Always render the user avatar/name explicitly */}
                <ListItemButton sx={{ borderRadius: 2, py: 0.5, pl: 0, pr: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Avatar src={sidebarUser.avatar} sx={{ width: 28, height: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={sidebarUser.name}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: 15, color: '#1a1a1a' }}
                  />
                </ListItemButton>
              </List>
            </Box>
          </Box>
        </Drawer>
        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, p: 0, bgcolor: '#fff' }}>
          {/* Top bar with close and breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 3, pb: 1, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton size="small" sx={{ mr: 1 }}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Add permissions set
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'absolute', left: 0, right: 0, pointerEvents: 'none' }}>
              <Box sx={{ pointerEvents: 'auto' }}>{renderBreadcrumbs()}</Box>
            </Box>
            <Box />
          </Box>
          {/* Step content */}
          <Box sx={{ px: 4, pt: 2 }}>
            <Dialog
              open={isDialogOpen}
              onClose={handleCloseDialog}
              fullWidth
              maxWidth="xl"
              PaperProps={{ sx: { minHeight: '90vh', borderRadius: 3, bgcolor: '#fff', boxShadow: 3, p: 0 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 4, pb: 0 }}>
                <DialogTitle sx={{ p: 0, fontWeight: 700, fontSize: 28, color: '#1a1a1a' }}>
                  Add permission - {dialogCategory}
                </DialogTitle>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <DialogContent sx={{ p: 4 }}>
                <TextField
                  value={addDialogSearch}
                  onChange={e => setAddDialogSearch(e.target.value)}
                  placeholder="Search permissions or subdomains..."
                  size="small"
                  fullWidth
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                {dialogCategory && (() => {
                  const domain = permissionsData.find(d => d.name === dialogCategory);
                  if (!domain) return null;
                  // Group permissions by subdomain
                  const groupedBySubdomain = domain.permissions.reduce((acc: Record<string, any[]>, permission: any) => {
                    const subdomain = permission.subdomain || '-';
                    if (!acc[subdomain]) acc[subdomain] = [];
                    acc[subdomain].push(permission);
                    return acc;
                  }, {});
                  // Filter logic
                  const q = addDialogSearch.trim().toLowerCase();
                  const filterPermission = (permission: any) =>
                    permission.name.toLowerCase().includes(q) ||
                    (permission.subdomain && permission.subdomain.toLowerCase().includes(q));
                  // For each group, filter permissions
                  const filteredGrouped = Object.entries(groupedBySubdomain).reduce((acc: any, [subdomain, perms]) => {
                    const filteredPerms = (perms as any[]).filter(filterPermission);
                    if (filteredPerms.length > 0) acc[subdomain] = filteredPerms;
                    return acc;
                  }, {});
                  const groupedEntries = Object.entries(filteredGrouped).filter(([subdomain]) => subdomain !== '-');
                  const ungroupedEntries = Object.entries(filteredGrouped).filter(([subdomain]) => subdomain === '-');
                  if (groupedEntries.length === 0 && ungroupedEntries.length === 0) {
                    return <Typography sx={{ p: 2 }}>No permissions found.</Typography>;
                  }
                  return (
                    <Box>
                      {/* Grouped permissions first */}
                      {groupedEntries.map(([subdomain, subPermissions], groupIndex) => {
                        const expanded = expandedDialogSubdomains[subdomain] || false;
                        const safeSubPermissions = Array.isArray(subPermissions) ? subPermissions : [];
                        return (
                          <Box
                            key={subdomain}
                            sx={{
                              mb: 2,
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: '1px solid',
                              borderColor: 'divider',
                              boxShadow: 0,
                              transition: 'border 0.2s, box-shadow 0.2s',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                bgcolor: 'background.default',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Box
                                sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, cursor: 'pointer' }}
                                onClick={() => handleDialogSubdomainChevron(subdomain)}
                              >
                                <ExpandMoreIcon
                                  sx={{
                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                  }}
                                />
                                <Typography variant="subtitle1">
                                  {highlightMatch(subdomain, addDialogSearch)}
                                </Typography>
                                <Chip
                                  label={`${safeSubPermissions.length} permissions`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                              {expanded && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    borderRadius: 10,
                                    fontWeight: 500,
                                    fontSize: 14,
                                    textTransform: 'none',
                                    ml: 2,
                                    minWidth: 110,
                                    border: '1px solid #B0B0B0',
                                    color: '#7c3aed',
                                    background: '#fff',
                                    '&:hover': {
                                      background: '#f3e8ff',
                                      border: '1px solid #B0B0B0',
                                    },
                                  }}
                                  onClick={e => {
                                    e.stopPropagation();
                                    const allEnabled = safeSubPermissions.every((permission: any) =>
                                      dialogSelectedPermissions.find(p => p.permission === permission.name && p.subdomain === permission.subdomain && p.isEnabled)
                                    );
                                    setDialogSelectedPermissions(prev =>
                                      prev.map(p =>
                                        p.subdomain === subdomain
                                          ? { ...p, isEnabled: !allEnabled }
                                          : p
                                      )
                                    );
                                  }}
                                >
                                  {safeSubPermissions.every((permission: any) =>
                                    dialogSelectedPermissions.find(p => p.permission === permission.name && p.subdomain === permission.subdomain && p.isEnabled)
                                  ) ? 'Disable all' : 'Enable all'}
                                </Button>
                              )}
                            </Box>
                            <Collapse in={expanded}>
                              <Box sx={{ p: 2 }}>
                                {safeSubPermissions.map((permission: any) => {
                                  const found = dialogSelectedPermissions.find(p => p.permission === permission.name && p.subdomain === permission.subdomain);
                                  return permission && permission.supportedActions ? (
                                    <Box
                                      key={permission.name}
                                      sx={{
                                        p: 2,
                                        mb: 1,
                                        borderRadius: 1,
                                        '&:hover': {
                                          bgcolor: 'action.hover',
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Switch
                                          checked={!!found?.isEnabled}
                                          onChange={() => {
                                            setDialogSelectedPermissions(prev =>
                                              prev.map(p =>
                                                p.permission === permission.name && p.subdomain === permission.subdomain
                                                  ? { ...p, isEnabled: !p.isEnabled }
                                                  : p
                                              )
                                            );
                                          }}
                                          sx={{ mr: 2 }}
                                        />
                                        <Typography variant="body1">{highlightMatch(permission.name, addDialogSearch)}</Typography>
                                        {permission.isSensitive && (
                                          <Chip label="Sensitive" size="small" color="error" sx={{ ml: 1 }} />
                                        )}
                                        {permission.noScopeLimit && (
                                          <Chip label="No scope limit" size="small" sx={{ bgcolor: '#FFD580', color: '#111', ml: 1 }} />
                                        )}
                                      </Box>
                                      {(() => {
                                        const normalizedActions = Array.isArray(permission.supportedActions)
                                          ? permission.supportedActions
                                          : typeof permission.supportedActions === 'string'
                                            ? permission.supportedActions.split(' - ').map((s: string) => s.trim())
                                            : [];
                                        const debug = { permission, found, supportedActions: permission.supportedActions, normalizedActions };
                                        console.log('DBG-Grouped', debug);
                                        return found?.isEnabled &&
                                          normalizedActions.length > 0 &&
                                          ['View', 'Propose', 'Edit'].some(action => normalizedActions.includes(action)) &&
                                          !normalizedActions.includes('Yes - No') && (
                                            <ToggleButtonGroup
                                              value={found.accessLevel || ''}
                                              exclusive
                                              onChange={(_, value) => {
                                                if (!value) return;
                                                setDialogSelectedPermissions(prev =>
                                                  prev.map(p =>
                                                    p.permission === permission.name && p.subdomain === permission.subdomain
                                                      ? { ...p, accessLevel: value }
                                                      : p
                                                  )
                                                );
                                              }}
                                              size="small"
                                              sx={{ ml: 2 }}
                                            >
                                              <ToggleButton value="View" disabled={!normalizedActions.includes('View')}>View</ToggleButton>
                                              <ToggleButton value="Propose" disabled={!normalizedActions.includes('Propose')}>Propose</ToggleButton>
                                              <ToggleButton value="Edit" disabled={!normalizedActions.includes('Edit')}>Edit</ToggleButton>
                                            </ToggleButtonGroup>
                                          );
                                      })()}
                                    </Box>
                                  ) : null;
                                })}
                              </Box>
                            </Collapse>
                          </Box>
                        );
                      })}
                      {/* Ungrouped permissions after grouped */}
                      {ungroupedEntries.map(([subdomain, subPermissions]) => {
                        const safeSubPermissions = Array.isArray(subPermissions) ? subPermissions : [];
                        return safeSubPermissions.map((permission: any) => {
                          const found = dialogSelectedPermissions.find(p => p.permission === permission.name && p.subdomain === permission.subdomain);
                          return permission && permission.supportedActions ? (
                            <Box
                              key={permission.name}
                              sx={{
                                p: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: found?.isEnabled ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: 'action.hover',
                                },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                  checked={!!found?.isEnabled}
                                  onChange={() => {
                                    setDialogSelectedPermissions(prev =>
                                      prev.map(p =>
                                        p.permission === permission.name && p.subdomain === permission.subdomain
                                          ? { ...p, isEnabled: !p.isEnabled }
                                          : p
                                      )
                                    );
                                  }}
                                  sx={{ mr: 2 }}
                                />
                                <Typography variant="body1">{highlightMatch(permission.name, addDialogSearch)}</Typography>
                                {permission.isSensitive && (
                                  <Chip label="Sensitive" size="small" color="error" sx={{ ml: 1 }} />
                                )}
                                {permission.noScopeLimit && (
                                  <Chip label="No scope limit" size="small" sx={{ bgcolor: '#FFD580', color: '#111', ml: 1 }} />
                                )}
                              </Box>
                              {(() => {
                                const normalizedActions = Array.isArray(permission.supportedActions)
                                  ? permission.supportedActions
                                  : typeof permission.supportedActions === 'string'
                                    ? permission.supportedActions.split(' - ').map((s: string) => s.trim())
                                    : [];
                                const debug = { permission, found, supportedActions: permission.supportedActions, normalizedActions };
                                console.log('DBG-Ungrouped', debug);
                                return found?.isEnabled &&
                                  normalizedActions.length > 0 &&
                                  ['View', 'Propose', 'Edit'].some(action => normalizedActions.includes(action)) &&
                                  !normalizedActions.includes('Yes - No') && (
                                    <ToggleButtonGroup
                                      value={found.accessLevel || ''}
                                      exclusive
                                      onChange={(_, value) => {
                                        if (!value) return;
                                        setDialogSelectedPermissions(prev =>
                                          prev.map(p =>
                                            p.permission === permission.name && p.subdomain === permission.subdomain
                                              ? { ...p, accessLevel: value }
                                              : p
                                          )
                                        );
                                      }}
                                      size="small"
                                      sx={{ ml: 2 }}
                                    >
                                      <ToggleButton value="View" disabled={!normalizedActions.includes('View')}>View</ToggleButton>
                                      <ToggleButton value="Propose" disabled={!normalizedActions.includes('Propose')}>Propose</ToggleButton>
                                      <ToggleButton value="Edit" disabled={!normalizedActions.includes('Edit')}>Edit</ToggleButton>
                                    </ToggleButtonGroup>
                                  );
                              })()}
                            </Box>
                          ) : null;
                        });
                      })}
                    </Box>
                  );
                })()}
              </DialogContent>
              <DialogActions sx={{ p: 4, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fafafd' }}>
                <Button onClick={handleCloseDialog} color="inherit" sx={{
                  borderRadius: 10,
                  height: 32,
                  padding: '7px 12px',
                  fontWeight: 500,
                  fontSize: 16,
                  textTransform: 'none',
                  background: '#fff',
                  color: '#111',
                  border: '1px solid #B0B0B0',
                  boxShadow: 'none',
                  gap: 2,
                  '&:hover': {
                    background: '#f3e8ff',
                    border: '1px solid #B0B0B0',
                  },
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDialogSave}
                  variant="contained"
                  disabled={dialogSelectedPermissions.filter(p => p.isEnabled).length === 0}
                  sx={{
                    borderRadius: 10,
                    height: 32,
                    padding: '7px 12px',
                    fontWeight: 500,
                    fontSize: 16,
                    textTransform: 'none',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.00) 100%), #A533CC',
                    boxShadow: '0px 1px 2px 0px rgba(176,0,255,0.05)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 100%), #9333ea',
                    },
                  }}
                >
                  Add {dialogSelectedPermissions.filter(p => p.isEnabled).length} Permission{dialogSelectedPermissions.filter(p => p.isEnabled).length !== 1 ? 's' : ''}
                </Button>
              </DialogActions>
            </Dialog>
            {renderStepContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
