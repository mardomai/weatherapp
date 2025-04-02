'use client';

import { useSession } from "next-auth/react";
import WeatherSearch from './WeatherSearch';
import Link from "next/link";

export default function WeatherSearchWrapper() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <WeatherSearch />
  );
}
