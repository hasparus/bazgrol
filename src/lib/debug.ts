export function makeGlobal(things: Record<string, unknown>) {
  console.log(`((makeGlobal)) Attaching to window:`, things);
  Object.assign(window, things);
}
