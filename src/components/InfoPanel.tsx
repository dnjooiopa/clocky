import { formatDate, formatTime, greetingForDate } from "../utils/time";
import "./InfoPanel.css";

interface Props {
  now: Date;
}

export default function InfoPanel({ now }: Props) {
  return (
    <div className="info-panel">
      <p className="info-greeting">{greetingForDate(now)}</p>
      <p className="info-time">{formatTime(now, true)}</p>
      <p className="info-date">{formatDate(now)}</p>
    </div>
  );
}
