export function removeSpecialcharacters(text: string): string {
  const regexp = new RegExp(/[:|/|*|?|<|>|\\|&|{|}|%|$|@|`|!|™|+|'|"|®]/, 'gi')
  return text.replaceAll(regexp, '')
}
