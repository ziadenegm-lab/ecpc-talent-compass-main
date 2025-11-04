import { useState } from 'react';
import { useAuth, sampleUsers, User } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Edit, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editPermissions, setEditPermissions] = useState<User['permissions']>({
    canAssessEmployees: false,
    canViewAllAssessments: false,
    canEditAllAssessments: false,
    canAddEmployees: false,
    canEditEmployeeData: false,
    canDeleteEmployees: false,
    canViewAllEmployees: false,
    canManageUsers: false,
    canAssignRoles: false,
    canExportReportsToPDF: false,
    canAccessAnalytics: false,
    restrictedToSections: [],
  });

  if (currentUser?.role !== 'HR') {
    return (
      <Layout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-bold">Access Restricted</h2>
              <p className="text-muted-foreground">
                This page is only accessible to HR personnel.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePermissionChange = (userId: string, permission: keyof User['permissions'], value: boolean) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, [permission]: value } }
          : user
      )
    );
    toast.success('Permission updated successfully');
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditPermissions(user.permissions);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...editingUser,
      fullName: formData.get('fullName') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'Manager' | 'HR',
      department: formData.get('department') as string,
      permissions: editPermissions,
    };

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === editingUser.id ? updatedUser : user
      )
    );

    toast.success('User updated successfully!');
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success(`User ${userName} deleted successfully`);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1>Users Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                toast.success('User added successfully!');
              }}>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select id="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="Manager">Manager</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Create User</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{users.length}</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {users.filter((u) => u.role === 'Manager').length}
              </div>
              <p className="text-xs text-muted-foreground">Manager accounts</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HR Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {users.filter((u) => u.role === 'HR').length}
              </div>
              <p className="text-xs text-muted-foreground">HR accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by name, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-sm font-medium">User</th>
                    <th className="pb-3 text-left text-sm font-medium">Username</th>
                    <th className="pb-3 text-left text-sm font-medium">Role</th>
                    <th className="pb-3 text-left text-sm font-medium">Department</th>
                    <th className="pb-3 text-left text-sm font-medium">Key Permissions</th>
                    <th className="pb-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{user.username}</td>
                      <td className="py-4">
                        <Badge variant={user.role === 'HR' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm">{user.department}</td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          {user.permissions.canManageUsers && (
                            <span className="text-xs text-muted-foreground">✓ Manage Users</span>
                          )}
                          {user.permissions.canExportReportsToPDF && (
                            <span className="text-xs text-muted-foreground">✓ Export Reports</span>
                          )}
                          {user.permissions.canEditAllAssessments && (
                            <span className="text-xs text-muted-foreground">✓ Edit Assessments</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.fullName)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdateUser}>
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input 
                  id="edit-fullName" 
                  name="fullName"
                  defaultValue={editingUser?.fullName}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input 
                  id="edit-username" 
                  name="username"
                  defaultValue={editingUser?.username}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  name="email"
                  type="email"
                  defaultValue={editingUser?.email}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <select 
                  id="edit-role" 
                  name="role"
                  defaultValue={editingUser?.role}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input 
                  id="edit-department" 
                  name="department"
                  defaultValue={editingUser?.department}
                  placeholder="Enter department"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label>Key Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-canAssessEmployees"
                      checked={editPermissions.canAssessEmployees}
                      onCheckedChange={(checked) => 
                        setEditPermissions(prev => ({ ...prev, canAssessEmployees: checked as boolean }))
                      }
                    />
                    <Label htmlFor="edit-canAssessEmployees" className="font-normal cursor-pointer">
                      Can Assess Employees
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-canViewAllAssessments"
                      checked={editPermissions.canViewAllAssessments}
                      onCheckedChange={(checked) => 
                        setEditPermissions(prev => ({ ...prev, canViewAllAssessments: checked as boolean }))
                      }
                    />
                    <Label htmlFor="edit-canViewAllAssessments" className="font-normal cursor-pointer">
                      Can View All Assessments
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-canEditAllAssessments"
                      checked={editPermissions.canEditAllAssessments}
                      onCheckedChange={(checked) => 
                        setEditPermissions(prev => ({ ...prev, canEditAllAssessments: checked as boolean }))
                      }
                    />
                    <Label htmlFor="edit-canEditAllAssessments" className="font-normal cursor-pointer">
                      Can Edit All Assessments
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-canManageUsers"
                      checked={editPermissions.canManageUsers}
                      onCheckedChange={(checked) => 
                        setEditPermissions(prev => ({ ...prev, canManageUsers: checked as boolean }))
                      }
                    />
                    <Label htmlFor="edit-canManageUsers" className="font-normal cursor-pointer">
                      Can Manage Users
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-canExportReportsToPDF"
                      checked={editPermissions.canExportReportsToPDF}
                      onCheckedChange={(checked) => 
                        setEditPermissions(prev => ({ ...prev, canExportReportsToPDF: checked as boolean }))
                      }
                    />
                    <Label htmlFor="edit-canExportReportsToPDF" className="font-normal cursor-pointer">
                      Can Export Reports to PDF
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Update User</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Permissions Matrix */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Permissions Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">User</th>
                    <th className="pb-3 text-center font-medium">Assess</th>
                    <th className="pb-3 text-center font-medium">View All</th>
                    <th className="pb-3 text-center font-medium">Edit</th>
                    <th className="pb-3 text-center font-medium">Manage Users</th>
                    <th className="pb-3 text-center font-medium">Export PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </td>
                      <td className="py-3 text-center">
                        <Checkbox 
                          checked={user.permissions.canAssessEmployees} 
                          onCheckedChange={(checked) => handlePermissionChange(user.id, 'canAssessEmployees', checked as boolean)}
                        />
                      </td>
                      <td className="py-3 text-center">
                        <Checkbox 
                          checked={user.permissions.canViewAllAssessments} 
                          onCheckedChange={(checked) => handlePermissionChange(user.id, 'canViewAllAssessments', checked as boolean)}
                        />
                      </td>
                      <td className="py-3 text-center">
                        <Checkbox 
                          checked={user.permissions.canEditAllAssessments} 
                          onCheckedChange={(checked) => handlePermissionChange(user.id, 'canEditAllAssessments', checked as boolean)}
                        />
                      </td>
                      <td className="py-3 text-center">
                        <Checkbox 
                          checked={user.permissions.canManageUsers} 
                          onCheckedChange={(checked) => handlePermissionChange(user.id, 'canManageUsers', checked as boolean)}
                        />
                      </td>
                      <td className="py-3 text-center">
                        <Checkbox 
                          checked={user.permissions.canExportReportsToPDF} 
                          onCheckedChange={(checked) => handlePermissionChange(user.id, 'canExportReportsToPDF', checked as boolean)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
