import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Bookmark, Heart, Instagram, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProducts, type Product } from "@/lib/products";
import { categorySlug } from "@/lib/categories";
import bootsPhoto from "@/assets/all-about-the-boots.webp";
import officePhoto from "@/assets/office-picks.webp";
import afterDarkPhoto from "@/assets/after-dark.webp";
import insta1 from "@/assets/insta-1.webp";
import insta2 from "@/assets/insta-2.webp";
import insta3 from "@/assets/insta-3.webp";
import garyLogo from "@/assets/gary-logo.webp";
import heels from "@/assets/category-heels.webp";
import lowHeels from "@/assets/low-block.webp";
import sandals from "@/assets/category-sandals.webp";
import boots from "@/assets/category-boots.webp";
import loafers from "@/assets/category-loafers.webp";
import ballerinas from "@/assets/category-ballerinas.webp";
import mules from "@/assets/category-mules.webp";

type CollectionTile = { image: string; label: string; href: string; product?: Product; position?: string };
type Edit = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  category: string;
  categories: string[];
  fallback: CollectionTile[];
};

const edits: Edit[] = [
  {
    id: "after-dark",
    title: "After Dark Selection",
    subtitle: "The details come out at night.",
    image: afterDarkPhoto,
    alt: "Black ankle-strap heels styled for an evening out",
    category: "After Dark Selection",
    categories: ["after dark selection"],
    fallback: [
      { image: heels, label: "Heels", href: "/shop?category=after-dark-selection" },
      { image: lowHeels, label: "Low Block Heels", href: "/shop?category=after-dark-selection" },
      { image: sandals, label: "Heel Sandals", href: "/shop?category=after-dark-selection" },
    ],
  },
  {
    id: "boots-edit",
    title: "All About the Boots",
    subtitle: "A different kind of winter.",
    image: bootsPhoto,
    alt: "The Gary Shoes winter edit with olive knee-high boots",
    category: "All About the Boots",
    categories: ["all about the boots", "boots", "ankle boots", "knee-high boots", "western boots"],
    fallback: [
      { image: boots, label: "Explore boots", href: "/shop?category=all-about-the-boots" },
      { image: bootsPhoto, label: "The winter edit", href: "/shop?category=all-about-the-boots", position: "12% 72%" },
      { image: bootsPhoto, label: "Discover the collection", href: "/shop?category=all-about-the-boots", position: "88% 52%" },
    ],
  },
  {
    id: "office-edit",
    title: "Our Office Picks",
    subtitle: "A little more than business as usual.",
    image: officePhoto,
    alt: "Elegant everyday styling from Gary Shoes",
    category: "Office Picks",
    categories: ["office picks"],
    fallback: [
      { image: loafers, label: "Loafers", href: "/shop?category=office-picks" },
      { image: ballerinas, label: "Ballerinas", href: "/shop?category=office-picks" },
      { image: mules, label: "Mules", href: "/shop?category=office-picks" },
    ],
  },
];

function CollectionPreview({ tile }: { tile: CollectionTile }) {
  return (
    <div className="editorial-preview min-w-0">
      <Link
        to={tile.href}
        aria-label={tile.product ? `View ${tile.product.name}` : tile.label}
        className={`editorial-plain-tile${tile.product ? "" : " editorial-plain-tile--fallback"}`}
      >
        <img
          src={tile.image}
          alt={tile.product?.name ?? tile.label}
          loading="lazy"
          width={1090}
          height={1090}
          style={tile.position ? { objectPosition: tile.position } : undefined}
        />
      </Link>
    </div>
  );
}

const HomepageEditorial = () => {
  const { data: products = [] } = useQuery({
    queryKey: ["homepage-editorial-products"],
    queryFn: () => fetchProducts(),
  });
  const editorialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = editorialRef.current?.querySelectorAll<HTMLElement>(".gary-editorial");
    if (!sections || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    sections.forEach((section) => {
      section.classList.add("reveal-ready");
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={editorialRef} className="bg-background text-foreground">
      {edits.map((edit, index) => {
        const matches = products
          .filter((product) => product.image_url && [product.category, ...(((product as any).extra_categories as string[]) || [])].some((c) => edit.categories.includes(c.toLowerCase())))
          .slice(0, 3);
        const tiles: CollectionTile[] = matches.map((product) => ({
          image: product.image_url ?? "",
          label: product.name,
          href: `/product/${product.id}`,
          product,
        }));
        const previews = [...tiles, ...edit.fallback].slice(0, 3);
        return (
          <section
            key={edit.id}
            id={edit.id}
            aria-labelledby={`${edit.id}-title`}
            className={`gary-editorial${index % 2 === 1 ? " gary-editorial-linen" : ""}`}
          >
            <div
              className={`editorial-section-grid${(edit.id === "after-dark" ? true : index % 2 === 1) ? " editorial-section-grid-photo-left" : ""}`}
            >
              <Link
                to={`/shop?category=${categorySlug(edit.category)}`}
                aria-label={`Shop ${edit.title}`}
                className="editorial-section-photo block min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
              >
                <img src={edit.image} alt={edit.alt} loading="lazy" />
              </Link>
              <div className="editorial-section-content flex min-w-0 flex-col justify-center">
                <div className="editorial-heading-row">
                  <h2 id={`${edit.id}-title`} className="editorial-heading">
                    {edit.id === "after-dark" ? (
                      <>
                        After <em>Dark</em> Selection
                      </>
                    ) : edit.id === "boots-edit" ? (
                      <>
                        All About the <em>Boots</em>
                      </>
                    ) : (
                      <>
                        Our Office <em>Picks</em>
                      </>
                    )}
                  </h2>
                </div>
                <p className="editorial-subtitle">{edit.subtitle}</p>
                <div className="editorial-shop-row">
                  <span className="editorial-shop-label">Shop the edit</span>
                  <Button asChild variant="link" className="editorial-text-link">
                    <Link to={`/shop?category=${categorySlug(edit.category)}`}>
                      View all <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                <div className="editorial-previews">
                  {previews.map((tile, tileIndex) => (
                    <CollectionPreview key={`${tile.href}-${tileIndex}`} tile={tile} />
                  ))}
                  {/* Mobile only (hidden by CSS on desktop): the editorial photo becomes the first card of the swipe row. */}
                  <Link
                    to={`/shop?category=${categorySlug(edit.category)}`}
                    aria-label={`Shop ${edit.title}`}
                    className="editorial-mobile-photo"
                  >
                    <img src={edit.image} alt={edit.alt} loading="lazy" />
                  </Link>
                </div>
                {edit.id === "boots-edit" && (
                  <div className="editorial-category-links">
                    {["Ankle Boots", "Knee-high Boots", "Western Boots"].map((label) => {
                      const slug = label.toLowerCase().replace(/ /g, "-");
                      const hasCategory = products.some(
                        (product) => [product.category, ...(((product as any).extra_categories as string[]) || [])].some((c) => c.toLowerCase() === label.toLowerCase()),
                      );
                      return (
                        <Button key={label} asChild variant="link" className="editorial-text-link">
                          <Link to={`/shop?category=${hasCategory ? slug : "all-about-the-boots"}`}>
                            {label}
                            <ArrowUpRight aria-hidden="true" />
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section aria-labelledby="family-title" className="gary-philosophy-text">
        <div className="philosophy-inner">
          <p className="philosophy-eyebrow">Our Philosophy · Est. 1982</p>
          <h2 id="family-title" className="philosophy-heading">
            A Family <em>Since 1982</em>
          </h2>
          <span className="philosophy-rule" aria-hidden="true" />
          <p className="philosophy-body">
            A family business guided by an eye for what feels right. Carried from one generation to the next — choosing
            carefully, thoughtfully, and never offering what feels ordinary.
          </p>
          <blockquote className="philosophy-quote">
            “That balance between familiarity and individuality is where Gary Shoes lives.”
          </blockquote>
          <Button asChild variant="link" className="philosophy-link">
            <Link to="/about">
              Discover More <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="seen-on-title" className="seen-on">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 md:py-20 lg:px-12">
          <div className="seen-on-head">
            <p className="seen-on-eyebrow">The Community</p>
            <h2 id="seen-on-title" className="text-3xl font-normal sm:text-5xl">
              Seen on <em>@garyshoeslb</em>
            </h2>
            <p className="seen-on-sub">Real moments, real style. Tag us to be featured in our edit.</p>
            <Button
              asChild
              variant="link"
              className="seen-on-link h-auto rounded-none p-0 font-normal text-foreground no-underline hover:no-underline"
            >
              <a href="https://instagram.com/garyshoeslb" target="_blank" rel="noopener noreferrer">
                <Instagram aria-hidden="true" />
                Follow Along
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>
          <div className="insta-grid">
            {[
              {
                image: insta1,
                alt: "Chocolate ballet flats and a burgundy bag styled on autumn leaves",
                position: "center",
                caption: "Autumn leaves & chocolate flats",
              },
              {
                image: insta2,
                alt: "Black Mary Jane flats worn with a ruffled taupe dress",
                position: "center 25%",
                caption: "Mary Janes, always",
              },
              {
                image: insta3,
                alt: "Blush suede lace-up heels on sunlit stone steps",
                position: "center",
                caption: "Golden hour steps",
              },
            ].map((post, index) => (
              <a
                key={post.image}
                href="https://instagram.com/garyshoeslb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`See Gary Shoes on Instagram, post ${index + 1}`}
                className="insta-post"
              >
                <span className="insta-post-head">
                  <img src={garyLogo} alt="" className="insta-avatar" loading="lazy" />
                  <span className="insta-username">garyshoeslb</span>
                  <Instagram aria-hidden="true" className="insta-glyph" />
                </span>
                <span className="insta-post-photo">
                  <img
                    src={post.image}
                    alt={post.alt}
                    loading="lazy"
                    style={post.position === "center" ? undefined : { objectPosition: post.position }}
                  />
                </span>
                <span className="insta-post-actions">
                  <span className="insta-icons">
                    <Heart aria-hidden="true" />
                    <MessageCircle aria-hidden="true" />
                    <Send aria-hidden="true" />
                  </span>
                  <Bookmark aria-hidden="true" />
                </span>
                <span className="insta-caption">
                  <b>garyshoeslb</b>
                  {post.caption}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageEditorial;
