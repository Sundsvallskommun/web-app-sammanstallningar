export default function Main({ children }) {
  return (
    <div>
      <main id="content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
