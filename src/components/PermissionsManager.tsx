import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Card,
  CardContent,
  Collapse,
  Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { permissionsData } from '../data/permissionsData';
import { Domain, Permission, AccessLevel } from '../types/permissions';

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
          accessLevel: permission.supportedActions.includes('View') ? 'View' : undefined,
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" component="div">
          Add Permission
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {permissionsData.map((domain: Domain) => (
          <Card 
            key={domain.name}
            sx={{ 
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={domain.permissions.some(p => isPermissionSelected(p.name))}
                      onChange={() => handleDomainToggle(domain.name)}
                    />
                  }
                  label={
                    <Typography variant="h6" component="div">
                      {domain.name}
                    </Typography>
                  }
                />
                <IconButton
                  onClick={() => handleDomainToggle(domain.name)}
                  sx={{
                    transform: isDomainExpanded(domain.name) ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.3s',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>

              <Collapse in={isDomainExpanded(domain.name)}>
                {/* Group permissions by subdomain */}
                {(() => {
                  const groupedBySubdomain = domain.permissions.reduce((acc, permission) => {
                    // Use permission.subdomain if present, otherwise fallback to domain.subdomain or '-'
                    const subdomain = (permission as any).subdomain || domain.subdomain || '-';
                    if (!acc[subdomain]) acc[subdomain] = [];
                    acc[subdomain].push(permission);
                    return acc;
                  }, {} as Record<string, Permission[]>);
                  return (
                    <Box sx={{ mt: 2, ml: 2 }}>
                      {Object.entries(groupedBySubdomain).map(([subdomain, subPermissions]) => {
                        if (subdomain === '-') {
                          // Render non-grouped permissions directly
                          return subPermissions.map((permission) => (
                            <Box
                              key={permission.name}
                              sx={{
                                p: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: isPermissionSelected(permission.name) ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: 'action.hover',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isPermissionSelected(permission.name)}
                                      onChange={() => handlePermissionToggle(domain, permission)}
                                    />
                                  }
                                  label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="body1">{permission.name}</Typography>
                                      {permission.isSensitive && (
                                        <Chip
                                          label="Sensitive"
                                          size="small"
                                          color="error"
                                          sx={{ ml: 1 }}
                                        />
                                      )}
                                    </Box>
                                  }
                                />
                              </Box>
                              {isPermissionSelected(permission.name) && 
                                permission.supportedActions !== 'Yes - No' && (
                                <Box sx={{ mt: 1, ml: 4 }}>
                                  <ToggleButtonGroup
                                    value={getSelectedAccessLevel(permission.name)}
                                    exclusive
                                    onChange={(_, value) => value && handleAccessLevelChange(permission, value)}
                                    size="small"
                                  >
                                    {permission.supportedActions.includes('View') && (
                                      <ToggleButton value="View">View</ToggleButton>
                                    )}
                                    {permission.supportedActions.includes('Propose') && (
                                      <ToggleButton value="Propose">Propose</ToggleButton>
                                    )}
                                    {permission.supportedActions.includes('Edit') && (
                                      <ToggleButton value="Edit">Edit</ToggleButton>
                                    )}
                                  </ToggleButtonGroup>
                                </Box>
                              )}
                            </Box>
                          ));
                        }
                        // Grouped permissions by subdomain
                        return (
                          <Box
                            key={subdomain}
                            sx={{
                              mb: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              overflow: 'hidden',
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="subtitle1">{subdomain}</Typography>
                                <Chip
                                  label={`${subPermissions.length} permissions`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Switch
                                  size="small"
                                  checked={expandedSubdomains[subdomain] || false}
                                  onChange={() => handleSubdomainToggle(subdomain)}
                                />
                              </Box>
                            </Box>
                            <Collapse in={expandedSubdomains[subdomain] || false}>
                              <Box sx={{ p: 2 }}>
                                {subPermissions.map((permission) => (
                                  <Box
                                    key={permission.name}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      p: 2,
                                      mb: 1,
                                      border: '1px solid',
                                      borderColor: isPermissionSelected(permission.name) ? 'primary.main' : 'divider',
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={isPermissionSelected(permission.name)}
                                            onChange={() => handlePermissionToggle(domain, permission)}
                                          />
                                        }
                                        label={
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body1">{permission.name}</Typography>
                                            {permission.isSensitive && (
                                              <Chip
                                                label="Sensitive"
                                                size="small"
                                                color="error"
                                                sx={{ ml: 1 }}
                                              />
                                            )}
                                          </Box>
                                        }
                                      />
                                    </Box>
                                    {isPermissionSelected(permission.name) && 
                                      permission.supportedActions !== 'Yes - No' && (
                                      <Box sx={{ mt: 1, ml: 4 }}>
                                        <ToggleButtonGroup
                                          value={getSelectedAccessLevel(permission.name)}
                                          exclusive
                                          onChange={(_, value) => value && handleAccessLevelChange(permission, value)}
                                          size="small"
                                        >
                                          {permission.supportedActions.includes('View') && (
                                            <ToggleButton value="View">View</ToggleButton>
                                          )}
                                          {permission.supportedActions.includes('Propose') && (
                                            <ToggleButton value="Propose">Propose</ToggleButton>
                                          )}
                                          {permission.supportedActions.includes('Edit') && (
                                            <ToggleButton value="Edit">Edit</ToggleButton>
                                          )}
                                        </ToggleButtonGroup>
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            </Collapse>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })()}
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleAddPermission}
          variant="contained"
          disabled={selectedPermissions.length === 0}
        >
          Add {selectedPermissions.length} Permission{selectedPermissions.length !== 1 ? 's' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 