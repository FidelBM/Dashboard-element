import { LoyaltyTier } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { getTierLabel, getTierTone } from "@/lib/presentation";

export function TierBadge({ tier }: { tier: LoyaltyTier | string }) {
  return <Badge variant={getTierTone(tier)}>{getTierLabel(tier)}</Badge>;
}
