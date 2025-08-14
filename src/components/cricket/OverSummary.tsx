import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Innings } from "@/types/cricket";

interface OverSummaryProps {
  innings?: Innings;
  currentOverIndex: number;
}

export function OverSummary({ innings, currentOverIndex }: OverSummaryProps) {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">📊 Over Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {innings?.overs?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {innings.overs.map((over: string[], idx: number) => (
              <div key={idx} className={`border rounded-lg p-3 transition-smooth ${
                idx === currentOverIndex ? "border-cricket-field bg-accent/50" : "border-border"
              }`}>
                <div className="text-sm text-muted-foreground mb-2">Over {idx + 1}</div>
                <div className="flex flex-wrap gap-1">
                  {over.length === 0 && <span className="text-muted-foreground text-sm">No balls yet</span>}
                  {over.map((ball, i) => (
                    <span key={i} className={`px-2 py-1 rounded-md text-xs font-medium ${
                      ball === "W" ? "bg-cricket-wicket text-white" :
                      ball === "6" ? "bg-cricket-boundary text-white" :
                      ball === "4" ? "bg-cricket-field text-white" :
                      "bg-muted text-foreground"
                    }`}>
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No overs yet.</div>
        )}
      </CardContent>
    </Card>
  );
}