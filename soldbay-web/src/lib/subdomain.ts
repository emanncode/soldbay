export function getSubdomain(hostname: string): string | null {
  const host = hostname.split(":")[0].toLowerCase();
  
  if (!host || host === "localhost") return null;
  
  if (host.endsWith(".localhost")) {
    return host.replace(/\.localhost$/, "");
  }
  
  const parts = host.split(".");
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}
