import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BallEvent } from "@/types/cricket";

interface ScoringControlsProps {
  onRecordBall: (event: BallEvent) => void;
  onSwitchInnings: () => void;
  onEndMatch: () => void;
  currentInnings: number;
  matchEnded: boolean;
}

export function ScoringControls({ 
  onRecordBall, 
  onSwitchInnings, 
  onEndMatch, 
  currentInnings, 
  matchEnded 
}: ScoringControlsProps) {
  if (matchEnded) return null;

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">⚡ Add Ball</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 6].map((r) => (
            <Button
              key={r}
              variant="outline"
              size="lg"
              className={`font-bold transition-bounce ${
                r === 6 ? 'border-cricket-boundary text-cricket-boundary hover:bg-cricket-boundary hover:text-white' :
                r === 4 ? 'border-cricket-field text-cricket-field hover:bg-cricket-field hover:text-white' :
                'hover:bg-secondary'
              }`}
              onClick={() => onRecordBall({ type: "RUN", value: r })}
            >
              {r}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="border-cricket-wicket text-cricket-wicket hover:bg-cricket-wicket hover:text-white transition-bounce"
            onClick={() => onRecordBall({ type: "W" })}
          >
            Wicket
          </Button>
          <Button 
            variant="outline"
            className="hover:bg-secondary transition-bounce"
            onClick={() => onRecordBall({ type: "WD" })}
          >
            Wide
          </Button>
          <Button 
            variant="outline"
            className="hover:bg-secondary transition-bounce"
            onClick={() => onRecordBall({ type: "NB" })}
          >
            No-Ball
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {currentInnings === 0 && (
            <Button
              variant="secondary"
              onClick={onSwitchInnings}
            >
              Switch to 2nd Innings
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={onEndMatch}
          >
            End Match
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}