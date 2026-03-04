interface BlogHeaderProps {
  title: string;
  accent?: string;
  subtitle?: string;
}

const BlogHeader = ({ title, accent, subtitle }: BlogHeaderProps) => (
  <div className="text-center mb-16 pt-32 pb-8">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-5 opacity-0 animate-fade-in-up">
      {title} {accent && <span className="text-primary italic">{accent}</span>}
    </h1>
    {subtitle && (
      <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
        {subtitle}
      </p>
    )}
  </div>
);

export default BlogHeader;
