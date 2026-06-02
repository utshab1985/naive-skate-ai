import Footer from "components/layout/footer";

export default function BuyingGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-20">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {children}
        </article>
      </div>
      <Footer />
    </>
  );
}
