export function approximiateEqual(a, b, precision = 0.005) {
  console.log(a, b)
  return a - b < precision && a - b > -precision
}
