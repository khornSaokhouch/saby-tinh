import FAQContent from "@/components/FAQContent";


export const metadata = {
  title: "FAQ | E-Commerces",
  description: "Frequently Asked Questions about our e-commerce platform.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      <FAQContent />
    </main>
  );
}
