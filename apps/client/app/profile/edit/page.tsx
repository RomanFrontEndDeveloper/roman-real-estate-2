import Link from "next/link";
import EditProfileForm from "@/components/profile/EditProfileForm";
import AccountSettings from "@/components/profile/AccountSettings";

export default function EditProfilePage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-secondary">
            Profile Settings
          </p>

          <h1 className="mt-4 font-serif text-4xl">Edit Profile</h1>

          <p className="mt-4 text-secondary">
            Update your personal information.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <EditProfileForm />

          <div className="mt-8">
            <AccountSettings />
          </div>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <Link
              href="/profile"
              className="text-sm font-medium underline underline-offset-4"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
