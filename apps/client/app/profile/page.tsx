import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-secondary">
            My Profile
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Profile
          </h1>

          <p className="mt-4 text-secondary">
            Manage your personal information and account details.
          </p>
        </div>

        <ProfileCard />
      </div>
    </section>
  );
}