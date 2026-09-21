import { useMemo, useState, type ReactNode } from 'react'
import { demoStock, formatWon, orderMethods, type OrderMethod } from './data/stock'

type Screen = 'detail' | 'method' | 'quantity' | 'review'

function BackButton({ onClick, label = '종목 상세로 돌아가기' }: { onClick: () => void; label?: string }) {
  return (
    <button className="icon-button" type="button" aria-label={label} onClick={onClick}>
      ←
    </button>
  )
}

function ScreenHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="screen-header">
      {onBack ? <BackButton onClick={onBack} /> : <span className="header-spacer" />}
      <strong>{title}</strong>
      <span className="header-spacer" />
    </header>
  )
}

function PriceChart() {
  return (
    <div className="chart" aria-label="삼성전자 가격 흐름 예시 차트">
      <svg viewBox="0 0 350 156" role="img" aria-hidden="true" preserveAspectRatio="none">
        <line x1="0" y1="124" x2="350" y2="124" className="chart-grid" />
        <line x1="0" y1="78" x2="350" y2="78" className="chart-grid" />
        <path d="M0 112 C24 108 42 92 70 96 S110 116 138 98 S183 72 212 80 S250 52 278 62 S322 43 350 30" className="chart-line" />
        <circle cx="350" cy="30" r="3.5" className="chart-point" />
      </svg>
      <div className="chart-label">{formatWon(demoStock.price)}</div>
      <div className="chart-periods" aria-label="차트 기간">
        <button type="button" className="period-active">1일</button>
        <button type="button">1주</button>
        <button type="button">3개월</button>
        <button type="button">1년</button>
      </div>
    </div>
  )
}

function GuideEntry({ onStart, onDismiss }: { onStart: () => void; onDismiss: () => void }) {
  return (
    <section className="guide-entry" aria-labelledby="guide-entry-title">
      <div>
        <h2 id="guide-entry-title">첫 구매 안내</h2>
        <p>구매 전에 각 정보 영역에서 무엇을 확인할 수 있는지 살펴볼 수 있어요.</p>
      </div>
      <div className="guide-actions">
        <button type="button" className="text-button" onClick={onDismiss}>괜찮아요</button>
        <button type="button" className="outline-button" onClick={onStart}>살펴보기</button>
      </div>
    </section>
  )
}

function InformationSection({ title, guide, children }: { title: string; guide?: string; children: ReactNode }) {
  return (
    <section className="information-section">
      <h2>{title}</h2>
      {guide && <p className="inline-guide">{guide}</p>}
      {children}
    </section>
  )
}

function StockDetail({ onPurchase }: { onPurchase: () => void }) {
  const [guideOn, setGuideOn] = useState(false)
  const [guideDismissed, setGuideDismissed] = useState(false)

  const turnOffGuide = () => {
    setGuideOn(false)
    setGuideDismissed(true)
  }

  return (
    <>
      <ScreenHeader title="삼성전자" />
      <main className="screen-content detail-content">
        <section className="stock-summary">
          <div className="stock-meta">{demoStock.code} · 국내주식</div>
          <div className="price-row">
            <strong>{formatWon(demoStock.price)}</strong>
            <span className="market-up">▲ {formatWon(demoStock.change)} ({demoStock.changeRate}%)</span>
          </div>
          <p className="market-status">전일 대비 · {demoStock.marketStatus}</p>
          <p className="demo-note">{demoStock.asOf}</p>
        </section>

        <section className="chart-section">
          <div className="section-heading"><h2>가격 흐름</h2><span>예시 차트</span></div>
          <PriceChart />
        </section>

        {guideOn ? (
          <section className="guide-active" aria-live="polite">
            <div><strong>정보 안내를 보고 있어요</strong><p>필요한 정보만 선택해서 살펴보세요.</p></div>
            <button type="button" className="text-button" onClick={turnOffGuide}>안내 종료</button>
          </section>
        ) : !guideDismissed ? (
          <GuideEntry onStart={() => setGuideOn(true)} onDismiss={() => setGuideDismissed(true)} />
        ) : (
          <button type="button" className="guide-reopen" onClick={() => { setGuideDismissed(false); setGuideOn(false) }}>
            첫 구매 안내 보기
          </button>
        )}

        <InformationSection title="최근 가격 변화" guide={guideOn ? '최근 가격이 어떻게 움직였는지 확인할 수 있어요.' : undefined}>
          <div className="data-list">
            {demoStock.priceChanges.map((item) => <div key={item.label}><span>{item.label}</span><strong className={item.direction === 'up' ? 'market-up' : 'market-down'}>{item.value}</strong></div>)}
          </div>
        </InformationSection>

        <InformationSection title="최근 정보" guide={guideOn ? '기업과 관련된 최근 소식과 주요 정보를 확인할 수 있어요.' : undefined}>
          <ul className="link-list">
            {demoStock.recentItems.map((item) => <li key={item}><button type="button">{item}<span>›</span></button></li>)}
          </ul>
        </InformationSection>

        <InformationSection title="기업 정보" guide={guideOn ? '기업의 기본 정보와 실적 등을 확인할 수 있어요.' : undefined}>
          <ul className="link-list">
            {demoStock.companyItems.map((item) => <li key={item}><button type="button">{item}<span>›</span></button></li>)}
          </ul>
        </InformationSection>
      </main>
      <footer className="fixed-action"><button type="button" className="primary-button" onClick={onPurchase}>구매하기</button></footer>
    </>
  )
}

function OrderMethodScreen({ method, setMethod, limitPrice, setLimitPrice, onBack, onNext }: {
  method: OrderMethod; setMethod: (value: OrderMethod) => void; limitPrice: number; setLimitPrice: (value: number) => void; onBack: () => void; onNext: () => void
}) {
  return (
    <><ScreenHeader title="주문 방식" onBack={onBack} />
      <main className="screen-content order-content">
        <p className="eyebrow">삼성전자 구매</p><h1>어떤 방식으로 주문할까요?</h1><p className="screen-description">용어보다 선택에 따라 무엇이 달라지는지 먼저 확인해보세요.</p>
        {(Object.keys(orderMethods) as OrderMethod[]).map((key) => {
          const option = orderMethods[key]; const selected = method === key
          return <section className={`order-option ${selected ? 'selected' : ''}`} key={key}>
            <label><input type="radio" name="order-method" checked={selected} onChange={() => setMethod(key)} /><span><strong>{option.title}</strong><em>{option.label}</em></span></label>
            <p>{option.description}</p><p className="option-notice">{option.notice}</p>
            {key === 'limit' && selected && <label className="price-input"><span>주문 가격</span><input type="number" min="1" inputMode="numeric" value={limitPrice || ''} onChange={(event) => setLimitPrice(Number(event.target.value))} /><b>원</b></label>}
          </section>
        })}
      </main>
      <footer className="fixed-action"><button type="button" className="primary-button" onClick={onNext} disabled={method === 'limit' && limitPrice < 1}>다음</button></footer>
    </>
  )
}

function QuantityScreen({ method, quantity, setQuantity, unitPrice, onBack, onNext }: { method: OrderMethod; quantity: number; setQuantity: (value: number) => void; unitPrice: number; onBack: () => void; onNext: () => void }) {
  const total = quantity * unitPrice; const option = orderMethods[method]
  return <><ScreenHeader title="수량 입력" onBack={onBack} />
    <main className="screen-content order-content"><p className="eyebrow">삼성전자 · {option.label}</p><h1>몇 주를 구매할까요?</h1>
      <section className="order-summary"><div><span>주문 방식</span><strong>{option.title}</strong></div><div><span>{method === 'market' ? '가격 결정 방식' : '주문 가격'}</span><strong>{method === 'market' ? '현재 거래 가능한 가격 기준' : formatWon(unitPrice)}</strong></div></section>
      <section className="quantity-control"><span>구매 수량</span><div><button type="button" aria-label="수량 줄이기" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><strong>{quantity}주</strong><button type="button" aria-label="수량 늘리기" onClick={() => setQuantity(quantity + 1)}>+</button></div></section>
      <section className="estimated-total"><span>예상 주문 금액</span><strong>{formatWon(total)}</strong><p>{method === 'market' ? '데모 가격 기준이며 실제 체결 가격에 따라 달라질 수 있어요.' : '입력한 주문 가격과 수량을 기준으로 계산했어요.'}</p></section>
    </main><footer className="fixed-action"><button type="button" className="primary-button" onClick={onNext}>주문 내용 확인</button></footer>
  </>
}

function ReviewScreen({ method, quantity, unitPrice, onBack }: { method: OrderMethod; quantity: number; unitPrice: number; onBack: () => void }) {
  const [confirmed, setConfirmed] = useState(false); const option = orderMethods[method]
  return <><ScreenHeader title="주문 내용 확인" onBack={onBack} />
    <main className="screen-content order-content"><p className="eyebrow">마지막 확인</p><h1>주문 내용을 확인해주세요</h1>
      <section className="review-list"><div><span>종목</span><strong>{demoStock.name} ({demoStock.code})</strong></div><div><span>구매 수량</span><strong>{quantity}주</strong></div><div><span>주문 방식</span><strong>{option.title}<em>{option.label}</em></strong></div><div><span>{method === 'market' ? '가격 결정 방식' : '주문 가격'}</span><strong>{method === 'market' ? '현재 거래 가능한 가격 기준' : formatWon(unitPrice)}</strong></div><div className="review-total"><span>예상 주문 금액</span><strong>{formatWon(unitPrice * quantity)}</strong></div></section>
      {confirmed && <p className="prototype-confirmation">프로토타입에서 주문 내용을 확인했습니다. 실제 주문은 실행되지 않습니다.</p>}
    </main><footer className="fixed-action"><button type="button" className="primary-button" onClick={() => setConfirmed(true)}>{confirmed ? '확인 완료' : '주문 내용 확인하기'}</button></footer>
  </>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('detail'); const [method, setMethod] = useState<OrderMethod>('market'); const [limitPrice, setLimitPrice] = useState(demoStock.price); const [quantity, setQuantity] = useState(1)
  const unitPrice = useMemo(() => method === 'market' ? demoStock.price : limitPrice, [method, limitPrice])
  return <div className="prototype-frame"><div className="app-shell">
    {screen === 'detail' && <StockDetail onPurchase={() => setScreen('method')} />}
    {screen === 'method' && <OrderMethodScreen method={method} setMethod={setMethod} limitPrice={limitPrice} setLimitPrice={setLimitPrice} onBack={() => setScreen('detail')} onNext={() => setScreen('quantity')} />}
    {screen === 'quantity' && <QuantityScreen method={method} quantity={quantity} setQuantity={setQuantity} unitPrice={unitPrice} onBack={() => setScreen('method')} onNext={() => setScreen('review')} />}
    {screen === 'review' && <ReviewScreen method={method} quantity={quantity} unitPrice={unitPrice} onBack={() => setScreen('quantity')} />}
  </div></div>
}
