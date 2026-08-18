export interface AuthenticatedUser {
  id: string;
  email: string;
  roleId?: string | null;
  roleName?: string;
  isActive: boolean;
}

export interface Permission {
  resource: string;
  action: string;
}

export interface AuthorizationContext {
  user: AuthenticatedUser;
  resourceId?: string;
  resourceData?: any;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
}
