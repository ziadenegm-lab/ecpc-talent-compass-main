import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sampleEmployees } from '@/data/employees';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function Assessment() {
  const { user } = useAuth();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [performanceContribution, setPerformanceContribution] = useState('');
  const [evolutionPotential, setEvolutionPotential] = useState('');
  const [riskOfLoss, setRiskOfLoss] = useState('');
  const [impactOfLoss, setImpactOfLoss] = useState('');
  const [nextRole, setNextRole] = useState('');
  const [readiness, setReadiness] = useState('');
  const [comments, setComments] = useState('');

  const selectedEmployee = sampleEmployees.find((emp) => emp.id === selectedEmployeeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedEmployeeId || !performanceContribution || !evolutionPotential || 
        !riskOfLoss || !impactOfLoss || !nextRole || !readiness) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save assessment (in real app, this would go to backend)
    toast.success('Assessment saved successfully!');
    
    // Reset form
    setSelectedEmployeeId('');
    setPerformanceContribution('');
    setEvolutionPotential('');
    setRiskOfLoss('');
    setImpactOfLoss('');
    setNextRole('');
    setReadiness('');
    setComments('');
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1>9-Box Assessment</h1>
          <p className="text-muted-foreground">Evaluate employee performance and potential</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Employee Assessment Form</CardTitle>
            <CardDescription>
              Complete the assessment to evaluate employee performance and succession readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee Selection */}
              <div className="space-y-2">
                <Label htmlFor="employee">Select Employee *</Label>
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} - {emp.jobTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployee && (
                <div className="rounded-lg bg-accent p-4 space-y-2">
                  <p className="text-sm"><span className="font-medium">Department:</span> {selectedEmployee.department}</p>
                  <p className="text-sm"><span className="font-medium">Direction:</span> {selectedEmployee.direction}</p>
                  <p className="text-sm"><span className="font-medium">Grade:</span> {selectedEmployee.jobGrade}</p>
                  <p className="text-sm"><span className="font-medium">Current Role:</span> {selectedEmployee.jobTitle}</p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {/* Performance Contribution */}
                <div className="space-y-2">
                  <Label htmlFor="performance">Performance Contribution (1-3) *</Label>
                  <Select value={performanceContribution} onValueChange={setPerformanceContribution}>
                    <SelectTrigger id="performance">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Below Expectations</SelectItem>
                      <SelectItem value="2">2 - Meets Expectations</SelectItem>
                      <SelectItem value="3">3 - Exceeds Expectations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Evolution Potential */}
                <div className="space-y-2">
                  <Label htmlFor="potential">Evolution Potential (1-3) *</Label>
                  <Select value={evolutionPotential} onValueChange={setEvolutionPotential}>
                    <SelectTrigger id="potential">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Limited Growth</SelectItem>
                      <SelectItem value="2">2 - Moderate Growth</SelectItem>
                      <SelectItem value="3">3 - High Growth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Risk of Loss */}
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk of Loss *</Label>
                  <Select value={riskOfLoss} onValueChange={setRiskOfLoss}>
                    <SelectTrigger id="risk">
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Impact of Loss */}
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact of Loss *</Label>
                  <Select value={impactOfLoss} onValueChange={setImpactOfLoss}>
                    <SelectTrigger id="impact">
                      <SelectValue placeholder="Select impact level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Next Role */}
                <div className="space-y-2">
                  <Label htmlFor="nextRole">Next Planned Role *</Label>
                  <Input
                    id="nextRole"
                    placeholder="e.g., Senior Manager"
                    value={nextRole}
                    onChange={(e) => setNextRole(e.target.value)}
                  />
                </div>

                {/* Readiness Timeline */}
                <div className="space-y-2">
                  <Label htmlFor="readiness">Readiness Timeline *</Label>
                  <Select value={readiness} onValueChange={setReadiness}>
                    <SelectTrigger id="readiness">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ready Now">Ready Now</SelectItem>
                      <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                      <SelectItem value="More than 3 Years">More than 3 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Add any additional observations or notes..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Assessment
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedEmployeeId('');
                    setPerformanceContribution('');
                    setEvolutionPotential('');
                    setRiskOfLoss('');
                    setImpactOfLoss('');
                    setNextRole('');
                    setReadiness('');
                    setComments('');
                  }}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Assessment History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No assessments recorded yet.</p>
              <p className="text-sm">Start by completing an assessment above.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
