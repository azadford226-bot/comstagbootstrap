import type { OrganizationProfile } from "@/lib/api/profile";

/**
 * Single definition of "profile completeness" for onboarding UX (navbar, analytics).
 */
export function organizationProfileCompletionPercent(
  profile: OrganizationProfile | null
): number {
  if (!profile) return 0;
  const fields = [
    !!(profile.profileImageId || profile.profileImage),
    !!(profile.profileCoverId || profile.coverImage),
    !!profile.whoWeAre,
    !!profile.whatWeDo,
    !!profile.website,
    !!profile.country,
    !!profile.industry,
    !!profile.companyType,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
