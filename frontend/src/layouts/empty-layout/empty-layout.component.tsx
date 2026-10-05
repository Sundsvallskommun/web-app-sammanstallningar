export default function EmptyLayout({ children }) {
  return (
    <div className="EmptyLayout">
      <div className="min-h-screen">{children}</div>
    </div>
  );
}
