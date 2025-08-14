import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Match, BallEvent, MatchSetup as MatchSetupType, Innings } from "@/types/cricket";
import { MatchSetup } from "./MatchSetup";
import { Scoreboard } from "./Scoreboard";
import { ScoringControls } from "./ScoringControls";
import { OverSummary } from "./OverSummary";
import { MatchResult } from "./MatchResult";

const STORAGE_KEY = "gully-score-state-v1";

const defaultMatch = (): Match => ({
  started: false,
  ended: false,
  oversLimit: 5,
  teamA: "Team A",
  teamB: "Team B",
  currentInnings: 0,
  innings: [],
});

export function CricketScoreTracker() {
  const [match, setMatch] = useLocalStorage<Match>(STORAGE_KEY, defaultMatch());

  // Derived helpers
  const innings = match.innings[match.currentInnings];

  const currentOverIndex = useMemo(() => {
    if (!innings) return 0;
    return Math.floor(innings.balls / 6);
  }, [innings]);

  const target = useMemo(() => {
    if (match.currentInnings === 1) {
      const firstInnings = match.innings[0];
      return firstInnings ? firstInnings.runs + 1 : null;
    }
    return null;
  }, [match]);

  // Actions
  const startMatch = (teamA: string, teamB: string, oversLimit: number) => {
    const inn1: Innings = {
      battingTeam: teamA,
      bowlingTeam: teamB,
      runs: 0,
      wickets: 0,
      balls: 0,
      overs: [[]],
      timeline: [],
    };
    setMatch({
      started: true,
      ended: false,
      oversLimit: Math.max(1, Number(oversLimit || 5)),
      teamA: teamA || "Team A",
      teamB: teamB || "Team B",
      currentInnings: 0,
      innings: [inn1],
    });
  };

  const recordBall = (event: BallEvent) => {
    if (!match.started || match.ended) return;
    const maxOvers = match.oversLimit;
    const m = structuredClone(match);
    const inn = m.innings[m.currentInnings];

    // Ensure overs array has current over slot
    if (!inn.overs[currentOverIndex]) inn.overs[currentOverIndex] = [];

    let runsAdded = 0;
    let legalBall = false;
    let label = "";

    switch (event.type) {
      case "RUN": {
        const r = event.value ?? 0;
        runsAdded = r;
        legalBall = true;
        label = String(r);
        break;
      }
      case "W": {
        legalBall = true;
        inn.wickets = Math.min(10, inn.wickets + 1);
        label = "W";
        break;
      }
      case "WD": {
        runsAdded = 1 + (event.value ?? 0);
        legalBall = false;
        label = "Wd";
        break;
      }
      case "NB": {
        runsAdded = 1 + (event.value ?? 0);
        legalBall = false;
        label = "Nb";
        break;
      }
      default:
        break;
    }

    inn.runs += runsAdded;
    if (legalBall) {
      inn.balls += 1;
    }
    inn.overs[currentOverIndex].push(label);

    // Track timeline for undo
    inn.timeline.push({
      overIndex: currentOverIndex,
      label,
      runsAdded,
      legalBall,
      wicketAdded: event.type === "W" ? 1 : 0,
    });

    // Auto-end innings if completed
    const oversCompleted = inn.balls >= maxOvers * 6;
    const allOut = inn.wickets >= 10;

    // If second innings chasing and target reached
    let chaseComplete = false;
    if (m.currentInnings === 1) {
      const first = m.innings[0];
      if (first && inn.runs >= first.runs + 1) {
        chaseComplete = true;
      }
    }

    if (oversCompleted || allOut || chaseComplete) {
      // End this innings automatically
      if (m.currentInnings === 0) {
        // Start second innings
        const inn2: Innings = {
          battingTeam: m.teamB,
          bowlingTeam: m.teamA,
          runs: 0,
          wickets: 0,
          balls: 0,
          overs: [[]],
          timeline: [],
        };
        m.innings[0] = inn;
        m.innings[1] = inn2;
        m.currentInnings = 1;
      } else {
        // End match
        m.ended = true;
      }
    } else {
      m.innings[m.currentInnings] = inn;
    }

    setMatch(m);
  };

  const undoLast = () => {
    if (!match.started || match.ended) return;
    const m = structuredClone(match);
    const inn = m.innings[m.currentInnings];
    if (!inn || inn.timeline.length === 0) return;

    const last = inn.timeline.pop()!;
    inn.runs -= last.runsAdded;
    if (last.wicketAdded) inn.wickets = Math.max(0, inn.wickets - 1);
    if (last.legalBall) inn.balls = Math.max(0, inn.balls - 1);

    // Remove label from over
    const arr = inn.overs[last.overIndex] || [];
    arr.pop();
    if (arr.length === 0 && last.overIndex === inn.overs.length - 1 && inn.overs.length > 1) {
      inn.overs.pop();
    }

    setMatch(m);
  };

  const switchInnings = () => {
    if (!match.started || match.ended) return;
    if (match.currentInnings === 0) {
      const m = structuredClone(match);
      if (!m.innings[1]) {
        m.innings[1] = {
          battingTeam: m.teamB,
          bowlingTeam: m.teamA,
          runs: 0,
          wickets: 0,
          balls: 0,
          overs: [[]],
          timeline: [],
        };
      }
      m.currentInnings = 1;
      setMatch(m);
    }
  };

  const endMatch = () => {
    if (!match.started) return;
    setMatch({ ...match, ended: true });
  };

  const resetAll = () => {
    setMatch(defaultMatch());
  };

  // Setup form state
  const [setup, setSetup] = useState<MatchSetupType>({ 
    teamA: match.teamA, 
    teamB: match.teamB, 
    overs: match.oversLimit 
  });

  useEffect(() => {
    setSetup({ teamA: match.teamA, teamB: match.teamB, overs: match.oversLimit });
  }, [match.started, match.teamA, match.teamB, match.oversLimit]);

  // Scoreboard helpers
  const formatOvers = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

  const resultText = useMemo(() => {
    if (!match.ended) return "";
    const i1 = match.innings[0];
    const i2 = match.innings[1];
    if (!i1) return "";
    if (!i2) return `${i1.battingTeam} scored ${i1.runs}/${i1.wickets} in ${formatOvers(i1.balls)} overs.`;

    if (i2.runs > i1.runs) {
      const wktsInHand = 10 - i2.wickets;
      return `${i2.battingTeam} won by ${wktsInHand} wicket${wktsInHand !== 1 ? "s" : ""}.`;
    } else if (i2.runs < i1.runs) {
      const margin = i1.runs - i2.runs;
      return `${i1.battingTeam} won by ${margin} run${margin !== 1 ? "s" : ""}.`;
    } else {
      return "Match tied.";
    }
  }, [match]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">🏏 Gully Cricket</h1>
            <p className="text-sm text-muted-foreground">Score Tracker</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undoLast}
              disabled={!match.started || match.ended}
            >
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAll}
            >
              Reset
            </Button>
          </div>
        </header>

        {!match.started ? (
          <MatchSetup
            setup={setup}
            onSetupChange={setSetup}
            onStartMatch={startMatch}
          />
        ) : (
          <>
            <Scoreboard
              innings={innings}
              oversLimit={match.oversLimit}
              currentInnings={match.currentInnings}
              target={target}
              formatOvers={formatOvers}
            />

            <ScoringControls
              onRecordBall={recordBall}
              onSwitchInnings={switchInnings}
              onEndMatch={endMatch}
              currentInnings={match.currentInnings}
              matchEnded={match.ended}
            />

            <OverSummary
              innings={innings}
              currentOverIndex={currentOverIndex}
            />

            <MatchResult
              match={match}
              resultText={resultText}
              formatOvers={formatOvers}
            />
          </>
        )}

        <footer className="text-center text-xs text-muted-foreground">
          🌟 Perfect for gully cricket matches • Built with ❤️ for cricket lovers
        </footer>
      </div>
    </div>
  );
}