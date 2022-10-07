// index 650:0,160:1,5:2,
export const GiftCards = [
  {
    id: 2,
    faceValue: 5,
  },
  {
    id: 1,
    faceValue: 160,
  },
  {
    id: 0,
    faceValue: 650,
  },
]
export const GiftCardFaceIds = Object.values(GiftCards).map((v) => v.id)
export const GiftCardFaceValues = Object.values(GiftCards).map(
  (v) => v.faceValue
)
