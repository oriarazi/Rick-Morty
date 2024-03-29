export function getParamViaFullUrl(
  paramKey: string,
  url: string
): undefined | string {
  const params = new URLSearchParams(url.split("?")[1]);
  return params.get(paramKey) ?? undefined;
}
