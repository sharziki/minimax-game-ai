import { memo } from 'react';
import { Brain, Timer, TreePine, Target } from 'lucide-react';
import type { AIResult } from '../lib/connect4';

interface StatsPanelProps {
  lastAiResult: AIResult | null;
  playerWins: number;
  aiWins: number;
  draws: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-[hsl(var(--secondary))] ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{label}</p>
          <p className={`text-xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

export const StatsPanel = memo(function StatsPanel({
  lastAiResult,
  playerWins,
  aiWins,
  draws,
}: StatsPanelProps) {
  return (
    <div className="space-y-4">
      {/* AI Analysis */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Nodes Evaluated"
          value={lastAiResult?.nodesEvaluated?.toLocaleString() ?? '—'}
          icon={<Brain className="w-5 h-5" />}
          color="text-[hsl(var(--primary))]"
        />
        <StatCard
          label="Search Depth"
          value={lastAiResult?.depth ?? '—'}
          icon={<TreePine className="w-5 h-5" />}
          color="text-[hsl(142,76%,46%)]"
        />
        <StatCard
          label="Time (ms)"
          value={lastAiResult?.timeMs ? lastAiResult.timeMs.toFixed(1) : '—'}
          icon={<Timer className="w-5 h-5" />}
          color="text-[hsl(var(--muted-foreground))]"
        />
        <StatCard
          label="Position Score"
          value={lastAiResult?.score !== undefined ? (lastAiResult.score > 1000 ? '∞' : lastAiResult.score < -1000 ? '-∞' : lastAiResult.score) : '—'}
          icon={<Target className="w-5 h-5" />}
          color={lastAiResult && lastAiResult.score > 0 ? 'text-[hsl(142,76%,46%)]' : lastAiResult && lastAiResult.score < 0 ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--muted-foreground))]'}
        />
      </div>

      {/* Score */}
      <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-4">
        <h3 className="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Score</h3>
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-[hsl(var(--player-1))]">{playerWins}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">You</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[hsl(var(--muted-foreground))]">{draws}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Draws</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[hsl(var(--player-2))]">{aiWins}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">AI</p>
          </div>
        </div>
      </div>
    </div>
  );
});
