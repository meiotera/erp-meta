import styles from './Section.module.css';

function Section({ children, className, headingH2 }) {
  return (
    <section className={`${styles.section} p-1 p-md-4 mb-4 rounded`}>
      {headingH2 && (
        <div className="border-bottom border-warning border-3 pb-2 mb-3">
          <h2 className="text-primary">{headingH2}</h2>
        </div>
      )}
      <div className={`${className}`}>{children}</div>
    </section>
  );
}

export default Section;
