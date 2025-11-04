import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sampleEmployees } from '@/data/employees';
import { CheckCircle2, Clock, Target } from 'lucide-react';

export default function NextSteps() {
  const readyNowEmployees = sampleEmployees.filter((e) => e.readiness === 'Ready Now');
  const oneToThreeYears = sampleEmployees.filter((e) => e.readiness === '1-3 Years');
  const moreThanThreeYears = sampleEmployees.filter((e) => e.readiness === 'More than 3 Years');

  const getDevelopmentPlan = (readiness: string, performance: number) => {
    if (readiness === 'Ready Now' && performance === 3) {
      return [
        'Assign to leadership development program',
        'Provide mentoring opportunities',
        'Consider for immediate promotion',
        'Cross-functional project leadership',
      ];
    }
    if (readiness === '1-3 Years') {
      return [
        'Enroll in management training',
        'Assign stretch assignments',
        'Quarterly performance reviews',
        'Skill gap analysis and development',
      ];
    }
    return [
      'Focus on core competency building',
      'Regular coaching sessions',
      'Technical skills enhancement',
      'Performance improvement plan',
    ];
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1>Next Steps & Development Plans</h1>
          <p className="text-muted-foreground">
            Career progression paths and development recommendations for talent pool
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready Now</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{readyNowEmployees.length}</div>
              <p className="text-xs text-muted-foreground">Employees ready for promotion</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">1-3 Years</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{oneToThreeYears.length}</div>
              <p className="text-xs text-muted-foreground">In development pipeline</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">3+ Years</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{moreThanThreeYears.length}</div>
              <p className="text-xs text-muted-foreground">Long-term development</p>
            </CardContent>
          </Card>
        </div>

        {/* Ready Now - Priority */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Priority: Ready for Promotion</CardTitle>
              <Badge className="bg-success">Action Required</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {readyNowEmployees.map((emp) => (
                <div key={emp.id} className="rounded-lg border p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{emp.name}</h3>
                      <p className="text-sm text-muted-foreground">{emp.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {emp.direction} • {emp.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Performance: {emp.performance}/3</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-accent p-3">
                      <p className="text-sm font-medium">Next Role: {emp.nextRole}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">Development Plan:</p>
                      <ul className="space-y-2">
                        {getDevelopmentPlan(emp.readiness, emp.performance).map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 1-3 Years Pipeline */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Development Pipeline (1-3 Years)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {oneToThreeYears.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex-1">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {emp.jobTitle} → {emp.nextRole}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Performance: {emp.performance}/3</p>
                      <p className="text-sm text-muted-foreground">Potential: {emp.evolutionPotential}/3</p>
                    </div>
                    <Badge variant="outline">{emp.direction}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Long-term Development */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Long-term Development (3+ Years)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moreThanThreeYears.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex-1">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {emp.jobTitle} • {emp.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm">Target: {emp.nextRole}</p>
                      <p className="text-sm text-muted-foreground">Focus on skill development</p>
                    </div>
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
