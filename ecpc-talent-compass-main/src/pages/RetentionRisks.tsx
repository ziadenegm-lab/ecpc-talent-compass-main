import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sampleEmployees } from '@/data/employees';
import { AlertTriangle } from 'lucide-react';

export default function RetentionRisks() {
  const highRiskEmployees = sampleEmployees
    .filter((emp) => emp.riskOfLoss === 'High' || emp.riskOfLoss === 'Medium')
    .sort((a, b) => {
      const riskOrder = { High: 3, Medium: 2, Low: 1 };
      return riskOrder[b.riskOfLoss] - riskOrder[a.riskOfLoss];
    });

  const getRiskBadgeVariant = (risk: string) => {
    if (risk === 'High') return 'destructive';
    if (risk === 'Medium') return 'default';
    return 'secondary';
  };

  const getRecommendations = (risk: string, impact: string) => {
    if (risk === 'High' && impact === 'High') {
      return [
        'Immediate retention bonus consideration',
        'Career development plan within 30 days',
        'Regular one-on-one meetings with senior leadership',
        'Explore internal growth opportunities',
      ];
    }
    if (risk === 'High') {
      return [
        'Schedule retention conversation',
        'Review compensation and benefits',
        'Identify development opportunities',
      ];
    }
    return [
      'Regular check-ins',
      'Monitor engagement levels',
      'Provide growth opportunities',
    ];
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1>Retention Risks</h1>
          <p className="text-muted-foreground">
            Monitor and manage employees at risk of leaving the organization
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {sampleEmployees.filter((e) => e.riskOfLoss === 'High').length}
              </div>
              <p className="text-xs text-muted-foreground">Employees requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {sampleEmployees.filter((e) => e.riskOfLoss === 'Medium').length}
              </div>
              <p className="text-xs text-muted-foreground">Employees needing monitoring</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {sampleEmployees.filter((e) => e.riskOfLoss === 'Low').length}
              </div>
              <p className="text-xs text-muted-foreground">Stable employees</p>
            </CardContent>
          </Card>
        </div>

        {/* High Risk Employees Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Employees at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-sm font-medium">Employee</th>
                    <th className="pb-3 text-left text-sm font-medium">Job Title</th>
                    <th className="pb-3 text-left text-sm font-medium">Direction</th>
                    <th className="pb-3 text-left text-sm font-medium">Risk Level</th>
                    <th className="pb-3 text-left text-sm font-medium">Impact</th>
                    <th className="pb-3 text-left text-sm font-medium">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {highRiskEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-sm text-muted-foreground">{emp.department}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{emp.jobTitle}</td>
                      <td className="py-4 text-sm">{emp.direction}</td>
                      <td className="py-4">
                        <Badge variant={getRiskBadgeVariant(emp.riskOfLoss)}>
                          {emp.riskOfLoss}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant={getRiskBadgeVariant(emp.impactOfLoss)}>
                          {emp.impactOfLoss}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm">{emp.performance}/3</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Retention Strategies */}
        <div className="grid gap-6 md:grid-cols-2">
          {highRiskEmployees.slice(0, 4).map((emp) => (
            <Card key={emp.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{emp.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{emp.jobTitle}</p>
                  </div>
                  <Badge variant={getRiskBadgeVariant(emp.riskOfLoss)}>
                    {emp.riskOfLoss} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Recommended Actions:</p>
                    <ul className="space-y-2">
                      {getRecommendations(emp.riskOfLoss, emp.impactOfLoss).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-accent p-3">
                    <p className="text-sm">
                      <span className="font-medium">Next Role:</span> {emp.nextRole}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Readiness:</span> {emp.readiness}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
