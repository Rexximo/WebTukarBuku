import Image from "next/image";
import Link from "next/link";

export function BrandIcon({ className = "app-mark" }: { className?: string }) {
  return (
    <Image
      className={className}
      src="/images/logoFTB.png"
      alt=""
      aria-hidden="true"
      width={38}
      height={38}
    />
  );
}

export function BrandName() {
  return (
    <>
      <span>Festival</span>
      <span className="brand-light">TukarBuku</span>
    </>
  );
}

export function AppBrand({ href = "/" }: { href?: string }) {
  return (
    <Link className="app-brand" href={href}>
      <BrandIcon />
      <span className="app-brand-name">
        <BrandName />
      </span>
    </Link>
  );
}
