import { formatDate, formatTime, greetingForDate } from "../utils/time";
import type { PeriodInfo } from "../utils/time";
import "./InfoPanel.css";

interface Props {
  now: Date;
  period: PeriodInfo;
}

export default function InfoPanel({ now, period }: Props) {
  return (
    <div className="info-panel">
      <p className="info-greeting">{greetingForDate(now)}</p>
      <p className="info-time">{formatTime(now, true)}</p>
      <p className="info-date">{formatDate(now)}</p>
      <p className="info-period">It&rsquo;s {period.label.toLowerCase()}</p>
    </div>
  );
}
