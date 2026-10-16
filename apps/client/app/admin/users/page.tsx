import UserManagement from "@/components/admin/UserManagement";


export default function AdminUsersPage() {
  return (
    <section className="w-full py-6 sm:py-10">
      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Administration
          </p>

          <h1 className="mt-2 font-serif text-4xl">
            User Management
          </h1>

          <p className="mt-3 text-secondary">
            Manage user accounts and access to the platform.
          </p>
        </div>

        <UserManagement />
      </div>
    </section>
  );
}