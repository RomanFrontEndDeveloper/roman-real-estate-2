import Link from "next/link";

import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ProfileCard() {
  return (
    <Card className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold">
          RT
        </div>

        {/* Basic Information */}
        <div className="mt-6">
          <h2 className="font-serif text-3xl">
            Romario Traveler
          </h2>

          <p className="mt-2 text-secondary">
            romariotraveler@gmail.com
          </p>

          <span className="mt-4 inline-block rounded-full bg-gray-100 px-4 py-1.5 text-sm">
            Admin
          </span>
        </div>
      </div>

      {/* Profile Information */}
      <div className="mt-10 border-t border-border pt-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-secondary">
              Full Name
            </p>

            <p className="mt-1 font-medium">
              Romario Traveler
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">
              Email
            </p>

            <p className="mt-1 font-medium">
              romariotraveler@gmail.com
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">
              Phone
            </p>

            <p className="mt-1 font-medium text-secondary">
              Not provided
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">
              Role
            </p>

            <p className="mt-1 font-medium">
              Admin
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <p className="text-sm text-secondary">
            Bio
          </p>

          <p className="mt-1 font-medium text-secondary">
            No bio yet.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end">
        <Link href="/profile/edit">
          <Button>
            Edit Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}