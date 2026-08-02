import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { cn } from "@/lib/utils";

interface Tier {
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  features: string[];
  cta: { label: string; href?: string };
  highlighted?: boolean;
  badge?: string;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "Everything you need to try VideoLoom on real projects.",
    features: [
      "Unlimited transcription jobs",
      "YouTube links or file uploads up to 25 MB",
      "AI dubbing in 6 languages",
      "Up to 5 AI clips per video",
      "Unlimited AI video chat",
      "Unlimited playlists",
    ],
    cta: { label: "Get started free", href: "/signup" },
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/month",
    tagline: "For creators publishing every week.",
    badge: "Coming soon",
    features: [
      "Everything in Free",
      "Larger file uploads",
      "Priority processing queue",
      "Faster AI response times",
      "Priority email support",
    ],
    cta: { label: "Coming soon" },
  },
  {
    name: "Business",
    price: "Custom",
    tagline: "For teams and agencies at scale.",
    badge: "Coming soon",
    features: [
      "Everything in Pro",
      "Multiple team members",
      "Shared workspaces",
      "Dedicated support",
      "Custom limits",
    ],
    cta: { label: "Coming soon" },
  },
];

export function PricingTiers() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <Card
          key={tier.name}
          className={cn(
            "relative gap-6 p-2",
            tier.highlighted && "ring-2 ring-brand",
          )}
        >
          <CardHeader className="gap-3 px-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold">{tier.name}</h3>
              {tier.badge && <Badge variant="secondary">{tier.badge}</Badge>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
              {tier.cadence && (
                <span className="text-sm text-muted-foreground">{tier.cadence}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{tier.tagline}</p>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 px-4 pb-4">
            <ul className="flex flex-col gap-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {tier.cta.href ? (
              <LinkButton href={tier.cta.href} size="lg" className="w-full">
                {tier.cta.label}
              </LinkButton>
            ) : (
              <Button size="lg" className="w-full" disabled>
                {tier.cta.label}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
