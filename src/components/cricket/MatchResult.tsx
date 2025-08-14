    


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match } from "@/types/cricket";

interface MatchResultProps {
  match: Match;
  resultText: string;
  formatOvers: (balls: number) => string;
}

export function MatchResult({ match, resultText, formatOvers }: MatchResultProps) {
  if (!match.ended) return null;

  return (
    <Card className="bg-gradient-score shadow-score border-cricket-field">
      <CardHeader>
        <CardTitle className="text-xl text-cricket-score">🏆 Match Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-lg font-semibold text-foreground">{resultText}</div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>
            <strong>First Innings:</strong> {match.innings[0]?.battingTeam} {match.innings[0]?.runs}/{match.innings[0]?.wickets} 
            in {formatOvers(match.innings[0]?.balls || 0)} overs
          </div>
          {match.innings[1] && (
            <div>
              <strong>Second Innings:</strong> {match.innings[1]?.battingTeam} {match.innings[1]?.runs}/{match.innings[1]?.wickets} 
              in {formatOvers(match.innings[1]?.balls || 0)} overs
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}