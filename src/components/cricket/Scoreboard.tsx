import { Card, CardContent } from "@/components/ui/card";
import { Innings } from "@/types/cricket";

interface ScoreboardProps {
  innings?: Innings;
  oversLimit: number;
  currentInnings: number;
  target?: number | null;
  formatOvers: (balls: number) => string;
}

export function Scoreboard({ innings, oversLimit, currentInnings, target, formatOvers }: ScoreboardProps) {
  return (
    <Card className="bg-gradient-score shadow-score">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              {oversLimit} Over Match • Innings {currentInnings + 1}
            </div>
            <div className="text-lg font-semibold text-foreground">
              {innings?.battingTeam} vs {innings?.bowlingTeam}
            </div>
            {currentInnings === 1 && target && (
              <div className="text-sm text-cricket-score font-medium">
                Target: {target} runs
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl md:text-4xl font-bold text-cricket-score">
              {innings?.runs || 0}/{innings?.wickets || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Overs: {innings ? formatOvers(innings.balls) : "0.0"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}