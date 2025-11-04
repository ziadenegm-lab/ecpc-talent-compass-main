import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { sampleEmployees } from '@/data/employees';
import { toast } from 'sonner';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter 
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();

  // Calculate KPIs
  const totalTalentPool = sampleEmployees.length;
  const criticalRoles = sampleEmployees.filter(
    (emp) => emp.impactOfLoss === 'High' && emp.riskOfLoss === 'High'
  ).length;
  const avgPerformance = (
    sampleEmployees.reduce((sum, emp) => sum + emp.performance, 0) / sampleEmployees.length
  ).toFixed(1);
  const avgReadiness = (
    sampleEmployees.reduce((sum, emp) => {
      if (emp.readiness === 'Ready Now') return sum + 3;
      if (emp.readiness === '1-3 Years') return sum + 2;
      return sum + 1;
    }, 0) / sampleEmployees.length
  ).toFixed(1);

  // Retention Risk Distribution
  const retentionData = [
    { name: 'Low Risk', value: sampleEmployees.filter((e) => e.riskOfLoss === 'Low').length, color: '#28A745' },
    { name: 'Medium Risk', value: sampleEmployees.filter((e) => e.riskOfLoss === 'Medium').length, color: '#FF9800' },
    { name: 'High Risk', value: sampleEmployees.filter((e) => e.riskOfLoss === 'High').length, color: '#DC3545' },
  ];

  // Talent Readiness by Direction
  const directions = ['Operations', 'Finance', 'HR', 'Sales & Marketing', 'IT'];
  const readinessData = directions.map((dir) => ({
    direction: dir,
    'Ready Now': sampleEmployees.filter((e) => e.direction === dir && e.readiness === 'Ready Now').length,
    '1-3 Years': sampleEmployees.filter((e) => e.direction === dir && e.readiness === '1-3 Years').length,
    'More than 3 Years': sampleEmployees.filter((e) => e.direction === dir && e.readiness === 'More than 3 Years').length,
  }));

  // Risk vs Impact Assessment
  const riskImpactData = sampleEmployees.map((emp) => ({
    name: emp.name,
    risk: emp.riskOfLoss === 'Low' ? 1 : emp.riskOfLoss === 'Medium' ? 2 : 3,
    impact: emp.impactOfLoss === 'Low' ? 1 : emp.impactOfLoss === 'Medium' ? 2 : 3,
  }));

  // 9-Box Distribution
  const get9BoxCategory = (perf: number, pot: number) => {
    if (perf === 3 && pot === 3) return 'Future Leaders';
    if (perf === 2 && pot === 3) return 'Growth Employees';
    if (perf === 3 && pot === 2) return 'Core Employees';
    if (perf === 2 && pot === 2) return 'Effective Performers';
    if (perf === 3 && pot === 1) return 'High Impact Performers';
    if (perf === 1 && pot === 3) return 'Enigma';
    if (perf === 1 && pot === 2) return 'Dilemma';
    return 'Underperformers';
  };

  const nineBoxData = [
    { category: 'Future Leaders', count: sampleEmployees.filter((e) => e.performance === 3 && e.evolutionPotential === 3).length },
    { category: 'Growth Employees', count: sampleEmployees.filter((e) => e.performance === 2 && e.evolutionPotential === 3).length },
    { category: 'Core Employees', count: sampleEmployees.filter((e) => e.performance === 3 && e.evolutionPotential === 2).length },
    { category: 'Effective Performers', count: sampleEmployees.filter((e) => e.performance === 2 && e.evolutionPotential === 2).length },
    { category: 'Others', count: sampleEmployees.filter((e) => e.performance <= 1 || e.evolutionPotential <= 1).length },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1>Welcome, {user?.fullName.split(' ')[0]}</h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Talent Pool</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalTalentPool}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Roles</CardTitle>
              <Briefcase className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{criticalRoles}</div>
              <p className="text-xs text-muted-foreground">High risk & impact</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{avgPerformance}/3</div>
              <p className="text-xs text-muted-foreground">Performance rating</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Readiness</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{avgReadiness}/3</div>
              <p className="text-xs text-muted-foreground">Readiness score</p>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        {user?.permissions.canExportReportsToPDF && (
          <div className="flex justify-end">
            <Button 
              className="gap-2"
              onClick={() => {
                toast.success('Generating PDF report... This would export the dashboard data in a production app.');
              }}
            >
              <Download className="h-4 w-4" />
              Export Dashboard as PDF
            </Button>
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Retention Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={retentionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {retentionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Talent Readiness by Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={readinessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="direction" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ready Now" fill="#28A745" />
                  <Bar dataKey="1-3 Years" fill="#FF9800" />
                  <Bar dataKey="More than 3 Years" fill="#DC3545" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Risk vs Impact Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="risk" name="Risk" domain={[0, 4]} />
                  <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 4]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Employees" data={riskImpactData} fill="#0066CC" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>9-Box Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={nineBoxData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0066CC" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Readiness Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Readiness Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Ready Now</span>
                  <span className="font-medium">
                    {sampleEmployees.filter((e) => e.readiness === 'Ready Now').length} employees
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-success"
                    style={{
                      width: `${(sampleEmployees.filter((e) => e.readiness === 'Ready Now').length / totalTalentPool) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>1-3 Years</span>
                  <span className="font-medium">
                    {sampleEmployees.filter((e) => e.readiness === '1-3 Years').length} employees
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-warning"
                    style={{
                      width: `${(sampleEmployees.filter((e) => e.readiness === '1-3 Years').length / totalTalentPool) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>More than 3 Years</span>
                  <span className="font-medium">
                    {sampleEmployees.filter((e) => e.readiness === 'More than 3 Years').length} employees
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-destructive"
                    style={{
                      width: `${(sampleEmployees.filter((e) => e.readiness === 'More than 3 Years').length / totalTalentPool) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Trusted Performers (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleEmployees
                .sort((a, b) => b.performance - a.performance || b.evolutionPotential - a.evolutionPotential)
                .slice(0, 5)
                .map((emp, index) => (
                  <div key={emp.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-sm text-muted-foreground">{emp.jobTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Performance: {emp.performance}/3</p>
                      <p className="text-sm text-muted-foreground">Potential: {emp.evolutionPotential}/3</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
