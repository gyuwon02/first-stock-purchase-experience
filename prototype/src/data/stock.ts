export type OrderMethod = 'market' | 'limit'

export const demoStock = {
  name: '삼성전자',
  code: '005930',
  price: 70000,
  change: 800,
  changeRate: 1.16,
  marketStatus: '정규장 마감',
  asOf: '프로토타입용 예시 데이터',
  priceChanges: [
    { label: '1주일', value: '+2.19%', direction: 'up' },
    { label: '1개월', value: '-1.41%', direction: 'down' },
    { label: '3개월', value: '+4.48%', direction: 'up' },
  ],
  recentItems: ['프로토타입용 최근 소식 예시', '공시 및 주요 이슈 예시'],
  companyItems: ['기업 개요와 사업 내용', '실적과 배당 관련 정보'],
} as const

export const orderMethods = {
  market: {
    title: '현재 거래 가능한 가격을 기준으로 구매',
    label: '시장가',
    description: '가격을 직접 정하지 않고 현재 거래 가능한 가격을 기준으로 주문해요.',
    notice: '시장 상황에 따라 실제 체결 가격이 달라질 수 있어요.',
  },
  limit: {
    title: '원하는 가격을 직접 정해서 구매',
    label: '지정가',
    description: '구매하고 싶은 가격을 직접 정해요.',
    notice: '조건이 맞지 않으면 주문이 바로 체결되지 않을 수 있어요.',
  },
} as const satisfies Record<OrderMethod, { title: string; label: string; description: string; notice: string }>

export const formatWon = (value: number) => `${new Intl.NumberFormat('ko-KR').format(value)}원`
