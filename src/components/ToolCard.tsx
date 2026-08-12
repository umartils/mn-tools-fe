import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ToolCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ToolCard({ href, icon: Icon, title, description }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-cream border border-border rounded-2xl hover:border-ink transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="w-11 h-11 rounded-xl bg-ink/5 border border-border flex items-center justify-center mb-4 group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors">
        <Icon className="w-5 h-5 text-ink/70 group-hover:text-accent transition-colors" />
      </div>
      <h3 className="font-display font-700 text-lg text-ink mb-1 flex items-center gap-1.5">
        {title}
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-accent" />
      </h3>
      <p className="font-body text-sm text-muted leading-relaxed">{description}</p>
    </Link>
  );
}
