'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-foreground text-background p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">WeatherApp</Link>
        <div className="flex items-center">
          {session && (
            <Link href="/todos" className="mr-4 bg-background text-foreground px-4 py-2 rounded">
              Todos
            </Link>
          )}
          {session ? (
            <>
              <span className="mr-4">Welcome, {session.user.name || session.user.email}</span>
              <button onClick={() => signOut()} className="bg-background text-foreground px-4 py-2 rounded">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="mr-4">Sign In</Link>
              <Link href="/signup" className="bg-background text-foreground px-4 py-2 rounded">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
