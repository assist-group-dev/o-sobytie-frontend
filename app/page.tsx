import { Header } from "./(landing)/components/Header";
import { Hero } from "./(landing)/components/Hero";
import { Cards } from "./(landing)/components/Cards";
import { CTA } from "./(landing)/components/CTA";
import { Footer } from "./(landing)/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Cards />
      <section id="how-it-works" className="py-20 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 uppercase tracking-wider text-center">
            Как это работает
          </h2>
        </div>
      </section>
      <section id="reviews" className="py-20 bg-[var(--color-cream-light)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 uppercase tracking-wider text-center">
            Отзывы
          </h2>
        </div>
      </section>
      <CTA />
      <section id="faq" className="py-20 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 uppercase tracking-wider text-center">
            FAQ
          </h2>
        </div>
      </section>
      <Footer />
    </div>
  );
}
