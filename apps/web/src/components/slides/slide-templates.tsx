'use client';

interface SlideProps {
  data: Record<string, unknown>;
  colors?: {
    primary?: string;
    background?: string;
    text?: string;
  };
}

export function TitleSlide({ data, colors }: SlideProps) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center text-center p-12"
      style={{
        background: `linear-gradient(135deg, ${colors?.primary || '#6366f1'} 0%, ${colors?.primary || '#6366f1'}cc 100%)`,
        color: '#fff',
      }}
    >
      <h1 className="text-5xl font-bold mb-4">{String(data.title || 'Title')}</h1>
      {data.subtitle && <p className="text-2xl opacity-90">{String(data.subtitle)}</p>}
    </div>
  );
}

export function ContentSlide({ data, colors }: SlideProps) {
  const bullets = (data.bullets as string[]) || [];
  return (
    <div
      className="h-full flex flex-col p-12"
      style={{ backgroundColor: colors?.background || '#fff', color: colors?.text || '#1a1a1a' }}
    >
      <h2 className="text-4xl font-bold mb-8" style={{ color: colors?.primary || '#6366f1' }}>
        {String(data.title || 'Content')}
      </h2>
      <ul className="space-y-4 text-xl flex-1">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors?.primary || '#6366f1' }}
            />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatsSlide({ data, colors }: SlideProps) {
  const stats = (data.stats as Array<{ value: string; label: string }>) || [];
  return (
    <div
      className="h-full flex flex-col p-12"
      style={{ backgroundColor: colors?.background || '#fff', color: colors?.text || '#1a1a1a' }}
    >
      <h2
        className="text-4xl font-bold mb-12 text-center"
        style={{ color: colors?.primary || '#6366f1' }}
      >
        {String(data.title || 'Stats')}
      </h2>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: colors?.primary || '#6366f1' }}
              >
                {stat.value}
              </div>
              <div className="text-lg opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamSlide({ data, colors }: SlideProps) {
  const members = (data.members as Array<{ name: string; role: string; image?: string }>) || [];
  return (
    <div
      className="h-full flex flex-col p-12"
      style={{ backgroundColor: colors?.background || '#fff', color: colors?.text || '#1a1a1a' }}
    >
      <h2
        className="text-4xl font-bold mb-12 text-center"
        style={{ color: colors?.primary || '#6366f1' }}
      >
        {String(data.title || 'Team')}
      </h2>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-8">
          {members.map((member, i) => (
            <div key={i} className="text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: colors?.primary || '#6366f1' }}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  member.name.charAt(0)
                )}
              </div>
              <div className="font-semibold">{member.name}</div>
              <div className="text-sm opacity-70">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuoteSlide({ data, colors }: SlideProps) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center p-12 text-center"
      style={{ backgroundColor: colors?.background || '#fff', color: colors?.text || '#1a1a1a' }}
    >
      <blockquote className="text-3xl italic mb-8 max-w-3xl">
        &ldquo;{String(data.quote || 'Quote goes here')}&rdquo;
      </blockquote>
      <div style={{ color: colors?.primary || '#6366f1' }}>
        <div className="font-semibold">{String(data.author || 'Author')}</div>
        {data.role && <div className="text-sm opacity-70">{String(data.role)}</div>}
      </div>
    </div>
  );
}

export function CTASlide({ data, colors }: SlideProps) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center p-12 text-center"
      style={{
        background: `linear-gradient(135deg, ${colors?.primary || '#6366f1'} 0%, ${colors?.primary || '#6366f1'}cc 100%)`,
        color: '#fff',
      }}
    >
      <h2 className="text-5xl font-bold mb-6">{String(data.title || 'Get Started')}</h2>
      {data.description && (
        <p className="text-xl opacity-90 mb-8 max-w-2xl">{String(data.description)}</p>
      )}
      <button
        className="px-8 py-4 bg-white text-lg font-semibold rounded-lg"
        style={{ color: colors?.primary || '#6366f1' }}
      >
        {String(data.buttonText || 'Contact Us')}
      </button>
      {data.contactEmail && <p className="mt-4 opacity-75">{String(data.contactEmail)}</p>}
    </div>
  );
}

export function ImageSlide({ data, colors }: SlideProps) {
  return (
    <div
      className="h-full flex flex-col p-12"
      style={{ backgroundColor: colors?.background || '#fff', color: colors?.text || '#1a1a1a' }}
    >
      {data.title && (
        <h2 className="text-4xl font-bold mb-8" style={{ color: colors?.primary || '#6366f1' }}>
          {String(data.title)}
        </h2>
      )}
      <div className="flex-1 flex items-center justify-center">
        {data.imageUrl ? (
          <img
            src={String(data.imageUrl)}
            alt={String(data.caption || '')}
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        ) : (
          <div className="w-full h-64 bg-[var(--muted)] rounded-lg flex items-center justify-center">
            <span className="text-[var(--muted-foreground)]">No image</span>
          </div>
        )}
      </div>
      {data.caption && (
        <p className="text-center mt-4 text-sm opacity-70">{String(data.caption)}</p>
      )}
    </div>
  );
}

export const slideComponents: Record<string, React.ComponentType<SlideProps>> = {
  title: TitleSlide,
  content: ContentSlide,
  stats: StatsSlide,
  team: TeamSlide,
  quote: QuoteSlide,
  cta: CTASlide,
  image: ImageSlide,
};
