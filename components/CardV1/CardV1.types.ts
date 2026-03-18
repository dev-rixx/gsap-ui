export interface CardV1Slide {
  image: string
  icon?: string
  title: string
  tag: string
  description: string
}

export interface CardV1Props {
  slides: CardV1Slide[]
}
