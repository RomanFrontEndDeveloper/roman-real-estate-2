"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button";

import {
  preferencesSchema,
  type PreferencesFormValues,
} from "./preferences.schema";

type PreferencesResponse = {
  message: string;
  preferences?: PreferencesFormValues;
};

export default function UserPreferences() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),

    defaultValues: {
      emailNotifications: true,
      propertyAlerts: true,
    },
  });

  const onSubmit = async (data: PreferencesFormValues) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token is missing.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/profile/preferences",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        },
      );

      const result: PreferencesResponse = await response.json();

      if (!response.ok) {
        console.error(result);
        return;
      }

      console.log(result);
    } catch (error) {
      console.error("Preferences update failed:", error);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl">Preferences</h2>

        <p className="mt-2 text-sm text-secondary">
          Customize how you use Roman Real Estate.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Notifications */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("emailNotifications")}
            className="h-4 w-4"
          />

          <span className="text-sm">Receive email notifications</span>
        </label>

        {/* Property Alerts */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("propertyAlerts")}
            className="h-4 w-4"
          />

          <span className="text-sm">Receive property alerts</span>
        </label>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
}
