import FormulaText from "./FormulaText.jsx";

function ReviewList({ items, ordered = false }) {
  const List = ordered ? "ol" : "ul";
  return <List>{items.map((item) => <li key={item}><FormulaText text={item} /></li>)}</List>;
}

export default function WorkedExample({ title, given, calculation, verification, answer }) {
  const headingId = `worked-example-${title.replace(/\s+/g, "-")}`;

  return (
    <section className="worked-example" aria-labelledby={headingId}>
      <header>
        <span>Worked Example</span>
        <h3 id={headingId}>{title}</h3>
      </header>
      <div className="worked-example-grid">
        <div>
          <h4>已知条件</h4>
          <ReviewList items={given} />
        </div>
        <div>
          <h4>计算过程</h4>
          <ReviewList items={calculation} ordered />
        </div>
        <div>
          <h4>器件校核</h4>
          <ReviewList items={verification} />
        </div>
        <div>
          <h4>面试回答</h4>
          <p><FormulaText text={answer} /></p>
        </div>
      </div>
    </section>
  );
}
