export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getAssetUrl(value?: string) {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${API_URL}${value}`;
}