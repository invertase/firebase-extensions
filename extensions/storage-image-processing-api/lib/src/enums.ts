export enum Interpolator {
  nearest = 'nearest',
  bilinear = 'bilinear',
  bicubic = 'bicubic',
  locallyBoundedBicubic = 'locallyBoundedBicubic',
  nohalo = 'nohalo',
  vertexSplitQuadraticBasisSpline = 'vertexSplitQuadraticBasisSpline',
}

export enum Blend {
  clear = 'clear',
  source = 'source',
  over = 'over',
  in = 'in',
  out = 'out',
  atop = 'atop',
  dest = 'dest',
  destOver = 'dest-over',
  destIn = 'dest-in',
  destOut = 'dest-out',
  destAtop = 'dest-atop',
  xor = 'xor',
  add = 'add',
  saturate = 'saturate',
  multiply = 'multiply',
  screen = 'screen',
  overlay = 'overlay',
  darken = 'darken',
  lighten = 'lighten',
  colourDodge = 'colour-dodge',
  colorDodge = 'color-dodge',
  colourBurn = 'colour-burn',
  colorBurn = 'color-burn',
  hardLight = 'hard-light',
  softLight = 'soft-light',
  difference = 'difference',
  exclusion = 'exclusion',
}

export enum Colorspace {
  cmyk = 'cmyk',
  labq = 'labq',
  rgb = 'rgb',
  cmc = 'cmc',
  labs = 'labs',
  srgb = 'srgb',
  fourier = 'fourier',
  rgb16 = 'rgb16',
  grey16 = 'grey16',
  matrix = 'matrix',
  scrgb = 'scrgb',
  hsv = 'hsv',
}

export enum Gravity {
  center = 'center',
  centre = 'centre',
  north = 'north',
  east = 'east',
  south = 'south',
  west = 'west',
  northeast = 'northeast',
  southeast = 'southeast',
  southwest = 'southwest',
  northwest = 'northwest',
}

export enum OperationResizeFit {
  cover = 'cover',
  contain = 'contain',
  fill = 'fill',
  inside = 'inside',
  outside = 'outside',
}

export enum OperationResizePosition {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
  rightTop = 'right-top',
  rightBottom = 'right-bottom',
  leftBottom = 'left-bottom',
  leftTop = 'left-top',
}

export enum OperationResizeKernel {
  nearest = 'nearest',
  cubic = 'cubic',
  mitchell = 'mitchell',
  lanczos2 = 'lanczos2',
  lanczos3 = 'lanczos3',
}

export enum OperationResizeStrategy {
  entropy = 'entropy',
  attention = 'attention',
}

export enum TextAlign {
  left = 'left',
  center = 'center',
  right = 'right',
}
