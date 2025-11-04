import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleEmployees } from '@/data/employees';

export default function NineBoxGrid() {
  const get9BoxPosition = (performance: number, potential: number) => {
    return { performance, potential };
  };

  const get9BoxCategory = (perf: number, pot: number) => {
    if (perf === 3 && pot === 3) return { name: 'Future Leaders', color: 'bg-success' };
    if (perf === 2 && pot === 3) return { name: 'Growth Employees', color: 'bg-primary' };
    if (perf === 3 && pot === 2) return { name: 'Core Employees', color: 'bg-primary' };
    if (perf === 2 && pot === 2) return { name: 'Effective Performers', color: 'bg-warning' };
    if (perf === 3 && pot === 1) return { name: 'High Impact Performers', color: 'bg-warning' };
    if (perf === 1 && pot === 3) return { name: 'Enigma', color: 'bg-destructive' };
    if (perf === 1 && pot === 2) return { name: 'Dilemma', color: 'bg-destructive' };
    return { name: 'Underperformers', color: 'bg-destructive' };
  };

  const gridData = [
    { perf: 3, pot: 3, label: 'Future Leaders' },
    { perf: 3, pot: 2, label: 'Core Employees' },
    { perf: 3, pot: 1, label: 'High Impact' },
    { perf: 2, pot: 3, label: 'Growth Employees' },
    { perf: 2, pot: 2, label: 'Effective Performers' },
    { perf: 2, pot: 1, label: 'Specialists' },
    { perf: 1, pot: 3, label: 'Enigma' },
    { perf: 1, pot: 2, label: 'Dilemma' },
    { perf: 1, pot: 1, label: 'Underperformers' },
  ];

  const getEmployeesInBox = (perf: number, pot: number) => {
    return sampleEmployees.filter(
      (emp) => emp.performance === perf && emp.evolutionPotential === pot
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1>9-Box Grid Visualization</h1>
          <p className="text-muted-foreground">
            Visual representation of employee performance and potential distribution
          </p>
        </div>

        {/* 9-Box Grid */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>9-Box Talent Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Grid */}
              <div className="grid grid-cols-4 gap-2">
                {/* Y-axis label */}
                <div className="flex items-center justify-center">
                  <p className="rotate-180 text-sm font-medium" style={{ writingMode: 'vertical-rl' }}>
                    Evolution Potential →
                  </p>
                </div>
                
                {/* Grid boxes */}
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  {/* Row 3 (High Potential) */}
                  {[1, 2, 3].map((perf) => {
                    const employees = getEmployeesInBox(perf, 3);
                    const category = get9BoxCategory(perf, 3);
                    return (
                      <div
                        key={`3-${perf}`}
                        className={`min-h-[140px] rounded-lg border-2 p-3 ${
                          perf === 1 ? 'border-destructive bg-destructive/10' :
                          perf === 2 ? 'border-primary bg-primary/10' :
                          'border-success bg-success/10'
                        }`}
                      >
                        <p className="mb-2 text-xs font-bold">{category.name}</p>
                        <p className="mb-2 text-lg font-bold">{employees.length}</p>
                        <div className="space-y-1">
                          {employees.slice(0, 2).map((emp) => (
                            <p key={emp.id} className="text-xs truncate">{emp.name}</p>
                          ))}
                          {employees.length > 2 && (
                            <p className="text-xs font-medium">+{employees.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Row 2 (Medium Potential) */}
                  {[1, 2, 3].map((perf) => {
                    const employees = getEmployeesInBox(perf, 2);
                    const category = get9BoxCategory(perf, 2);
                    return (
                      <div
                        key={`2-${perf}`}
                        className={`min-h-[140px] rounded-lg border-2 p-3 ${
                          perf === 1 ? 'border-destructive bg-destructive/10' :
                          perf === 2 ? 'border-warning bg-warning/10' :
                          'border-primary bg-primary/10'
                        }`}
                      >
                        <p className="mb-2 text-xs font-bold">{category.name}</p>
                        <p className="mb-2 text-lg font-bold">{employees.length}</p>
                        <div className="space-y-1">
                          {employees.slice(0, 2).map((emp) => (
                            <p key={emp.id} className="text-xs truncate">{emp.name}</p>
                          ))}
                          {employees.length > 2 && (
                            <p className="text-xs font-medium">+{employees.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Row 1 (Low Potential) */}
                  {[1, 2, 3].map((perf) => {
                    const employees = getEmployeesInBox(perf, 1);
                    const category = get9BoxCategory(perf, 1);
                    return (
                      <div
                        key={`1-${perf}`}
                        className={`min-h-[140px] rounded-lg border-2 p-3 ${
                          perf === 3 ? 'border-warning bg-warning/10' :
                          'border-destructive bg-destructive/10'
                        }`}
                      >
                        <p className="mb-2 text-xs font-bold">{category.name}</p>
                        <p className="mb-2 text-lg font-bold">{employees.length}</p>
                        <div className="space-y-1">
                          {employees.slice(0, 2).map((emp) => (
                            <p key={emp.id} className="text-xs truncate">{emp.name}</p>
                          ))}
                          {employees.length > 2 && (
                            <p className="text-xs font-medium">+{employees.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels */}
                <div />
                <div className="col-span-3 grid grid-cols-3 gap-2 text-center">
                  <p className="text-sm font-medium">Below Expectations</p>
                  <p className="text-sm font-medium">Meets Expectations</p>
                  <p className="text-sm font-medium">Exceeds Expectations</p>
                </div>
                <div />
                <div className="col-span-3 text-center">
                  <p className="text-sm font-medium">← Performance Contribution</p>
                </div>
              </div>

              {/* Legend */}
              <div className="rounded-lg border p-4">
                <p className="mb-3 text-sm font-semibold">Category Descriptions:</p>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-success">Future Leaders</p>
                    <p className="text-xs text-muted-foreground">High performance, high potential - ready for advancement</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">Growth Employees</p>
                    <p className="text-xs text-muted-foreground">Medium performance, high potential - invest in development</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">Core Employees</p>
                    <p className="text-xs text-muted-foreground">High performance, medium potential - backbone of organization</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-warning">Effective Performers</p>
                    <p className="text-xs text-muted-foreground">Medium performance, medium potential - solid contributors</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">Enigma</p>
                    <p className="text-xs text-muted-foreground">Low performance, high potential - coaching needed</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">Underperformers</p>
                    <p className="text-xs text-muted-foreground">Low performance, low potential - performance improvement required</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Summary */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Top Talent (High-High)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">
                {sampleEmployees.filter((e) => e.performance === 3 && e.evolutionPotential === 3).length}
              </p>
              <p className="text-sm text-muted-foreground">
                {((sampleEmployees.filter((e) => e.performance === 3 && e.evolutionPotential === 3).length / sampleEmployees.length) * 100).toFixed(0)}% of workforce
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Development Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-warning">
                {sampleEmployees.filter((e) => e.performance <= 2 && e.evolutionPotential <= 2).length}
              </p>
              <p className="text-sm text-muted-foreground">
                {((sampleEmployees.filter((e) => e.performance <= 2 && e.evolutionPotential <= 2).length / sampleEmployees.length) * 100).toFixed(0)}% of workforce
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">
                {sampleEmployees.filter((e) => e.performance === 1).length}
              </p>
              <p className="text-sm text-muted-foreground">
                {((sampleEmployees.filter((e) => e.performance === 1).length / sampleEmployees.length) * 100).toFixed(0)}% of workforce
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
