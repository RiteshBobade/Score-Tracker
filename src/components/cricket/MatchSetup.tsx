import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchSetup as MatchSetupType } from "@/types/cricket";

interface MatchSetupProps {
  setup: MatchSetupType;
  onSetupChange: (setup: MatchSetupType) => void;
  onStartMatch: (teamA: string, teamB: string, overs: number) => void;
}

export function MatchSetup({ setup, onSetupChange, onStartMatch }: MatchSetupProps) {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">🏟️ Match Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamA">Team A (Batting first)</Label>
            <Input
              id="teamA"
              value={setup.teamA}
              onChange={(e) => onSetupChange({ ...setup, teamA: e.target.value })}
              placeholder="Team A"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamB">Team B</Label>
            <Input
              id="teamB"
              value={setup.teamB}
              onChange={(e) => onSetupChange({ ...setup, teamB: e.target.value })}
              placeholder="Team B"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="overs">Overs</Label>
            <Input
              id="overs"
              type="number"
              min={1}
              value={setup.overs}
              onChange={(e) => onSetupChange({ ...setup, overs: Number(e.target.value) })}
              placeholder="5"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => onStartMatch(setup.teamA, setup.teamB, setup.overs)}
            className="bg-primary hover:bg-primary/90"
          >
            Start Match
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}