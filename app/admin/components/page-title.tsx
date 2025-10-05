import { Typography } from "@/components/ui/typography";

export function AdminPageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
        <Typography
          as="h1"
          className="mb-1 text-xl font-semibold text-foreground sm:mb-2 sm:text-2xl lg:text-3xl"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="muted" className="text-xs sm:text-sm">
            {subtitle}
          </Typography>
        )}
      </div>
    </div>
  );
}
