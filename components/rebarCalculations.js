// Parameters to track
// limiting depth of neutral axis.
// actual depth of neutral axis.
// required percentage of steel
// Moment of resistance

// constants

const f_y = 250
const E_s = 210000

export default function limitingDepthNA(b, D) {
  const d = D - 50

  // limiting depth of neutral axis calculations
  const xu_max = (0.0035 / (0.0055 + 0.87 * (f_y / E_s))) * d

  //
  console.log(xu_max.toFixed(2))
  return xu_max
}
