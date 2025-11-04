import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { sampleEmployees, Employee, JobGrade, Direction } from '@/data/employees';
import { UserPlus, Download, Upload, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Employees() {
  const { user: currentUser } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDirection =
      directionFilter === 'All' || emp.direction === directionFilter;

    return matchesSearch && matchesDirection;
  });

  const getRiskBadgeVariant = (risk: string) => {
    if (risk === 'High') return 'destructive';
    if (risk === 'Medium') return 'default';
    return 'secondary';
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Job Title', 'Grade', 'Direction', 'Department', 'Performance', 'Potential', 'Risk', 'Readiness', 'Next Role'];
    const rows = employees.map(emp => [
      emp.id,
      emp.name,
      emp.jobTitle,
      emp.jobGrade,
      emp.direction,
      emp.department,
      emp.performance,
      emp.evolutionPotential,
      emp.riskOfLoss,
      emp.readiness,
      emp.nextRole
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported successfully!');
  };

  const handleExportExcel = () => {
    toast.info('Excel export requires additional library. CSV export is available.');
    handleExportCSV();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`File "${file.name}" selected. Import processing would happen here.`);
      }
    };
    input.click();
  };

  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newEmployee: Employee = {
      id: `E${(employees.length + 1).toString().padStart(3, '0')}`,
      name: formData.get('name') as string,
      jobTitle: formData.get('jobTitle') as string,
      jobGrade: formData.get('jobGrade') as JobGrade,
      direction: formData.get('direction') as Direction,
      department: formData.get('department') as string,
      jobCategory: 'Management',
      performance: parseInt(formData.get('performance') as string) as 1 | 2 | 3,
      evolutionPotential: parseInt(formData.get('potential') as string) as 1 | 2 | 3,
      riskOfLoss: formData.get('risk') as 'Low' | 'Medium' | 'High',
      impactOfLoss: formData.get('impact') as 'Low' | 'Medium' | 'High',
      readiness: formData.get('readiness') as 'Ready Now' | '1-3 Years' | 'More than 3 Years',
      nextRole: formData.get('nextRole') as string,
      last3YearsPerformance: 3,
      assessmentHistory: [],
    };

    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
    toast.success(`Employee ${newEmployee.name} added successfully!`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1>Employees Database</h1>
            <p className="text-muted-foreground">Manage employee records and talent data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleImport}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" name="name" placeholder="Full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input id="jobTitle" name="jobTitle" placeholder="Job title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobGrade">Job Grade *</Label>
                      <Select name="jobGrade" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="G1">G1</SelectItem>
                          <SelectItem value="G2">G2</SelectItem>
                          <SelectItem value="G3">G3</SelectItem>
                          <SelectItem value="G4">G4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direction">Direction *</Label>
                      <Select name="direction" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input id="department" name="department" placeholder="Department" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="performance">Performance (1-3) *</Label>
                      <Select name="performance" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Below</SelectItem>
                          <SelectItem value="2">2 - Meets</SelectItem>
                          <SelectItem value="3">3 - Exceeds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="potential">Potential (1-3) *</Label>
                      <Select name="potential" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Limited</SelectItem>
                          <SelectItem value="2">2 - Moderate</SelectItem>
                          <SelectItem value="3">3 - High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="risk">Risk of Loss *</Label>
                      <Select name="risk" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="impact">Impact of Loss *</Label>
                      <Select name="impact" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="readiness">Readiness *</Label>
                      <Select name="readiness" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ready Now">Ready Now</SelectItem>
                          <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                          <SelectItem value="More than 3 Years">More than 3 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nextRole">Next Planned Role *</Label>
                      <Input id="nextRole" name="nextRole" placeholder="Next role" required />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Add Employee</Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-5">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{employees.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter((e) => e.direction === 'Operations').length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Finance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter((e) => e.direction === 'Finance').length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sales & Marketing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter((e) => e.direction === 'Sales & Marketing').length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">IT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter((e) => e.direction === 'IT').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Employee Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-4">
              <Input
                placeholder="Search by name, title, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Directions</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <p className="self-center text-sm text-muted-foreground">
                Showing {filteredEmployees.length} of {employees.length} employees
              </p>
            </div>

            {/* Employees Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-sm font-medium">ID</th>
                    <th className="pb-3 text-left text-sm font-medium">Name</th>
                    <th className="pb-3 text-left text-sm font-medium">Job Title</th>
                    <th className="pb-3 text-left text-sm font-medium">Grade</th>
                    <th className="pb-3 text-left text-sm font-medium">Direction</th>
                    <th className="pb-3 text-left text-sm font-medium">Department</th>
                    <th className="pb-3 text-center text-sm font-medium">Performance</th>
                    <th className="pb-3 text-center text-sm font-medium">Potential</th>
                    <th className="pb-3 text-left text-sm font-medium">Risk</th>
                    <th className="pb-3 text-left text-sm font-medium">Readiness</th>
                    <th className="pb-3 text-left text-sm font-medium">Next Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="py-3 text-sm">{emp.id}</td>
                      <td className="py-3">
                        <p className="font-medium">{emp.name}</p>
                      </td>
                      <td className="py-3 text-sm">{emp.jobTitle}</td>
                      <td className="py-3 text-sm">{emp.jobGrade}</td>
                      <td className="py-3 text-sm">{emp.direction}</td>
                      <td className="py-3 text-sm">{emp.department}</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline">{emp.performance}/3</Badge>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="outline">{emp.evolutionPotential}/3</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={getRiskBadgeVariant(emp.riskOfLoss)}>
                          {emp.riskOfLoss}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">{emp.readiness}</td>
                      <td className="py-3 text-sm">{emp.nextRole}</td>
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
