// `us-atlas` ships no type declarations for its bundled TopoJSON atlases. The
// island (Story 4.2) dynamically `import()`s `states-10m.json` and casts it to
// the topojson `Topology`; declare the module loosely so `resolveJsonModule`
// does not try to infer the (huge) literal shape of the atlas.
declare module 'us-atlas/states-10m.json' {
  const topology: unknown
  export default topology
}
