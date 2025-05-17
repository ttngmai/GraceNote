type TRGB = [number, number, number]

export default function isLight(color: string): boolean {
  const getRGB = (hex: string): TRGB => {
    if (hex.startsWith('#')) {
      hex = hex.substring(1)

      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((char) => char + char)
          .join('')
      }

      const bigint = parseInt(hex, 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return [r, g, b]
    }

    if (color.startsWith('rgb')) {
      const rgbArray = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',')
      return rgbArray.map((val) => parseInt(val.trim())) as TRGB
    }

    throw new Error('Invalid color format')
  }

  const calculateLuminance = (rgb: TRGB): number => {
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
  }

  const rgb = getRGB(color)
  const luminance = calculateLuminance(rgb)

  return luminance > 128
}
