// index 650:0,160:1,5:2,
const urlPrefix =
  'https://meta-image-space-id.s3.us-west-2.amazonaws.com/image/giftcard/GiftCard_Small_'
export const noGiftCardUlr = `${urlPrefix}-1.png`
export const GiftCards = [
  {
    id: 2,
    faceValue: 5,
    url: `${urlPrefix}2.png`,
  },
  {
    id: 1,
    faceValue: 160,
    url: `${urlPrefix}1.png`,
  },
  {
    id: 0,
    faceValue: 650,
    url: `${urlPrefix}0.png`,
  },
]
export const GiftCardFaceIds = Object.values(GiftCards).map((v) => v.id)
export const GiftCardFaceValues = Object.values(GiftCards).map(
  (v) => v.faceValue
)

export const BNB_TLD_LINK = 'https://space.id/tld/1'
