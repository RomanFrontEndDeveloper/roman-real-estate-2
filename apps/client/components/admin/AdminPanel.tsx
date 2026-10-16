"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AdminPanel() {
  return (
    <section className="mx-auto text-center mt-10 w-full max-w-3xl px-4 sm:px-6">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.25em] text-secondary">
          Administration
        </p>

        <h2 className="mt-2 font-serif text-3xl">Admin Panel</h2>

        <p className="mt-2 text-secondary">
          Manage users, agencies and properties.
        </p>
      </div>

      <Card className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="font-semibold">User Management</h3>

          <p className="mt-2 text-sm text-secondary">Block or unblock users.</p>

          <Link href="/admin/users" className="mt-4 block">
            <Button className="w-full">Manage Users</Button>
          </Link>
        </div>

        <div>
          <h3 className="font-semibold">Property Management</h3>

          <p className="mt-2 text-sm text-secondary">
            View and manage property listings.
          </p>

          <Link href="/admin/properties" className="mt-4 block">
            <Button className="w-full">All Properties</Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
