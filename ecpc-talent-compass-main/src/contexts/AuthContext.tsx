import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Manager' | 'HR';

export interface UserPermissions {
  canAssessEmployees: boolean;
  canViewAllAssessments: boolean;
  canEditAllAssessments: boolean;
  canAddEmployees: boolean;
  canEditEmployeeData: boolean;
  canDeleteEmployees: boolean;
  canViewAllEmployees: boolean;
  canManageUsers: boolean;
  canAssignRoles: boolean;
  canExportReportsToPDF: boolean;
  canAccessAnalytics: boolean;
  restrictedToSections: string[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  department: string;
  createdDate: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users data
export const sampleUsers: User[] = [
  {
    id: 'user-1',
    username: 'manager1',
    password: 'pass123',
    fullName: 'Ahmed Hassan',
    email: 'ahmed.hassan@ecpc.com',
    role: 'Manager',
    permissions: {
      canAssessEmployees: true,
      canViewAllAssessments: false,
      canEditAllAssessments: false,
      canAddEmployees: false,
      canEditEmployeeData: false,
      canDeleteEmployees: false,
      canViewAllEmployees: false,
      canManageUsers: false,
      canAssignRoles: false,
      canExportReportsToPDF: false,
      canAccessAnalytics: true,
      restrictedToSections: ['Operations'],
    },
    department: 'Operations',
    createdDate: '2024-01-15T10:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user-2',
    username: 'manager2',
    password: 'pass123',
    fullName: 'Sara Mohamed',
    email: 'sara.mohamed@ecpc.com',
    role: 'Manager',
    permissions: {
      canAssessEmployees: true,
      canViewAllAssessments: false,
      canEditAllAssessments: false,
      canAddEmployees: false,
      canEditEmployeeData: false,
      canDeleteEmployees: false,
      canViewAllEmployees: false,
      canManageUsers: false,
      canAssignRoles: false,
      canExportReportsToPDF: false,
      canAccessAnalytics: true,
      restrictedToSections: ['Finance'],
    },
    department: 'Finance',
    createdDate: '2024-01-20T10:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user-3',
    username: 'manager3',
    password: 'pass123',
    fullName: 'Khaled Ali',
    email: 'khaled.ali@ecpc.com',
    role: 'Manager',
    permissions: {
      canAssessEmployees: true,
      canViewAllAssessments: false,
      canEditAllAssessments: false,
      canAddEmployees: false,
      canEditEmployeeData: false,
      canDeleteEmployees: false,
      canViewAllEmployees: false,
      canManageUsers: false,
      canAssignRoles: false,
      canExportReportsToPDF: false,
      canAccessAnalytics: true,
      restrictedToSections: ['Sales & Marketing'],
    },
    department: 'Sales & Marketing',
    createdDate: '2024-02-01T10:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user-4',
    username: 'hr1',
    password: 'pass123',
    fullName: 'Fatima Abdullah',
    email: 'fatima.abdullah@ecpc.com',
    role: 'HR',
    permissions: {
      canAssessEmployees: true,
      canViewAllAssessments: true,
      canEditAllAssessments: true,
      canAddEmployees: true,
      canEditEmployeeData: true,
      canDeleteEmployees: true,
      canViewAllEmployees: true,
      canManageUsers: true,
      canAssignRoles: true,
      canExportReportsToPDF: true,
      canAccessAnalytics: true,
      restrictedToSections: [],
    },
    department: 'HR',
    createdDate: '2024-01-10T10:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user-5',
    username: 'hr2',
    password: 'pass123',
    fullName: 'Omar Ibrahim',
    email: 'omar.ibrahim@ecpc.com',
    role: 'HR',
    permissions: {
      canAssessEmployees: true,
      canViewAllAssessments: true,
      canEditAllAssessments: true,
      canAddEmployees: true,
      canEditEmployeeData: true,
      canDeleteEmployees: true,
      canViewAllEmployees: true,
      canManageUsers: true,
      canAssignRoles: true,
      canExportReportsToPDF: true,
      canAccessAnalytics: true,
      restrictedToSections: [],
    },
    department: 'HR',
    createdDate: '2024-01-12T10:00:00Z',
    lastLogin: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('ecpc_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Find user in sample data
    const foundUser = sampleUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('ecpc_user', JSON.stringify(updatedUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecpc_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
