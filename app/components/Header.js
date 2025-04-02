import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-foreground text-background p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">WeatherApp</h1>
        <nav>
          <Link href="/" className="mr-4">Weather</Link>
          <Link href="/map" className="mr-4">Map Feature</Link>
        </nav>
      </div>
    </header>
  );
} 