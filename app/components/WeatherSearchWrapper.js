'use client';

import { useSession } from "next-auth/react";
import WeatherSearch from './WeatherSearch';
import Link from "next/link";

export default function WeatherSearchWrapper() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return session ? (
    <WeatherSearch />
  ) : (
    <div className="text-center">
      <p className="mb-4">Please sign in to use the weather search feature.</p>
      <Link href="/signin" className="bg-foreground text-background px-4 py-2 rounded">Sign In</Link>
    </div>
  );
}
