const statusStyles = {
  confirmed: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20",
  cancelled: "bg-rose-500/20 text-rose-300 border border-rose-400/20",
  pending: "bg-amber-500/20 text-amber-300 border border-amber-400/20",
  success: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20",
  failed: "bg-rose-500/20 text-rose-300 border border-rose-400/20",
  default: "bg-white/10 text-white/80 border border-white/10",
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || "").toLowerCase();
  const classes = statusStyles[normalized] || statusStyles.default;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {normalized || "unknown"}
    </span>
  );
};

export default StatusBadge; 