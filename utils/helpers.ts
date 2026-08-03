export function validateProjectDate(
  date: string,
  variant?: "cv-projects" | "preview",
): string | "Till now" {
  const dateObject = new Date(date);
  console.log(date, dateObject)
  if (new Date(dateObject).getTime() > Date.now()) return "Till now";
  switch (variant) {
    case "cv-projects":
      return formatDdMmYyyy(dateObject);
    case "preview":
      return formatMmYyyy(dateObject);
    default:
      return dateObject.toLocaleString();
  }
}

function formatDdMmYyyy(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatMmYyyy(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}.${year}`;
}

export function validateDateString(date: string) {
  return new Date(date).toISOString();
}
