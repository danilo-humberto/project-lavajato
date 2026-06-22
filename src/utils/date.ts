type TimestampLike = {
  toDate: () => Date;
};

function isTimestampLike(value: unknown): value is TimestampLike {
  return typeof value === "object" && value !== null && "toDate" in value && typeof (value as TimestampLike).toDate === "function";
}

export function formatDateTime(value: unknown) {
  if (!value) {
    return null;
  }

  const date = isTimestampLike(value) ? value.toDate() : new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
