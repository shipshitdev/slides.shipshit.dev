'use client';

interface SlideProps {
  data: Record<string, unknown>;
  colors?: {
    primary?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
}

export function TitleSlide({ data, colors, fonts }: SlideProps) {
  const headingFont = fonts?.heading || 'Inter';
  const bodyFont = fonts?.body || 'Inter';

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center text-center"
      style={{
        background: `linear-gradient(135deg, ${colors?.primary || '#6366f1'} 0%, ${colors?.primary || '#6366f1'}cc 100%)`,
        color: '#fff',
        padding: '0',
        margin: '0',
        fontFamily: bodyFont,
      }}
    >
      <h1
        className="text-7xl font-bold mb-6"
        style={{ fontFamily: headingFont }}
      >
        {String(data.title || 'Title')}
      </h1>
      {data.subtitle && (
        <p className="text-3xl opacity-90" style={{ fontFamily: bodyFont }}>
          {String(data.subtitle)}
        </p>
      )}
    </div>
  );
}

export function ContentSlide({ data, colors, fonts }: SlideProps) {
  const bullets = (data.bullets as string[]) || [];
  const headingFont = fonts?.heading || 'Inter';
  const bodyFont = fonts?.body || 'Inter';

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        backgroundColor: colors?.background || '#fff',
        color: colors?.text || '#1a1a1a',
        padding: '80px',
        margin: '0',
        fontFamily: bodyFont,
      }}
    >
      <h2
        className="text-6xl font-bold mb-12"
        style={{ color: colors?.primary || '#6366f1', fontFamily: headingFont }}
      >
        {String(data.title || 'Content')}
      </h2>
      <ul className="space-y-6 text-3xl flex-1" style={{ fontFamily: bodyFont }}>
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className="mt-3 w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors?.primary || '#6366f1' }}
            />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatsSlide({ data, colors, fonts }: SlideProps) {
  const stats = (data.stats as Array<{ value: string; label: string }>) || [];
  const headingFont = fonts?.heading || 'Inter';
  const bodyFont = fonts?.body || 'Inter';

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        backgroundColor: colors?.background || '#fff',
        color: colors?.text || '#1a1a1a',
        padding: '80px',
        margin: '0',
        fontFamily: bodyFont,
      }}
    >
      <h2
        className="text-6xl font-bold mb-16 text-center"
        style={{ color: colors?.primary || '#6366f1', fontFamily: headingFont }}
      >
        {String(data.title || 'Stats')}
      </h2>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-8xl font-bold mb-4"
                style={{ color: colors?.primary || '#6366f1', fontFamily: headingFont }}
              >
                {stat.value}
              </div>
              <div className="text-2xl opacity-70" style={{ fontFamily: bodyFont }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamSlide({ data, colors, fonts }: SlideProps) {
  const members = (data.members as Array<{ name: string; role: string; image?: string }>) || [];
  const headingFont = fonts?.heading || 'Inter';
  const bodyFont = fonts?.body || 'Inter';

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        backgroundColor: colors?.background || '#fff',
        color: colors?.text || '#1a1a1a',
        padding: '80px',
        margin: '0',
        fontFamily: bodyFont,
      }}
    >
      <h2
        className="text-6xl font-bold mb-16 text-center"
        style={{ color: colors?.primary || '#6366f1', fontFamily: headingFont }}
      >
        {String(data.title || 'Team')}
      </h2>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-12">
          {members.map((member, i) => (
            <div key={i} className="text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold"
                style={{
                  backgroundColor: colors?.primary || '#6366f1',
                  fontFamily: headingFont,
                }}
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
              <div className="font-semibold text-xl" style={{ fontFamily: headingFont }}>
                {member.name}
              </div>
              <div className="text-lg opacity-70" style={{ fontFamily: bodyFont }}>
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuoteSlide({ data, colors, fonts }: SlideProps) {
  const headingFont = fonts?.heading || 'Inter';
  const bodyFont = fonts?.body || 'Inter';

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center text-center"
      style={{
        backgroundColor: colors?.background || '#fff',
        color: colors?.text || '#1a1a1a',
        padding: '80px',
        margin: '0',
        fontFamily: bodyFont,
      }}
    >
      <blockquote
        className="text-5xl italic mb-12 max-w-4xl"
        style={{ fontFamily: bodyFont }}
      >
        &ldquo;{String(data.quote || 'Quote goes here')}&rdquo;
      </blockquote>
      <div style={{ color: colors?.primary || '#6366f1' }}>
        <div className="font-semibold text-2xl" style={{ fontFamily: headingFont }}>
          {String(data.author || 'Author')}
        </div>
        {data.role && (
          <div className="text-xl opacity-70 mt-2" style={{ fontFamily: bodyFont }}>
            {String(data.role)}
          </div>
        )}
      </div>
    </div>
  );
}

export function CTASlide({ data, colors, fonts }: SlideProps) {
  const headingFont = fonts?.heading || 'Inter';
  const bodyFont = fonts?.body || 'Inter';

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center text-center"
      style={{
        background: `linear-gradient(135deg, ${colors?.primary || '#6366f1'} 0%, ${colors?.primary || '#6366f1'}cc 100%)`,
        color: '#fff',
        padding: '0',
        margin: '0',
        fontFamily: bodyFont,
      }}
    >
      <h2
        className="text-7xl font-bold mb-8"
        style={{ fontFamily: headingFont }}
      >
        {String(data.title || 'Get Started')}
      </h2>
      {data.description && (
        <p
          className="text-2xl opacity-90 mb-12 max-w-3xl"
          style={{ fontFamily: bodyFont }}
        >
          {String(data.description)}
        </p>
      )}
      {data.buttonUrl ? (
        <a
          href={String(data.buttonUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-12 py-6 bg-white text-xl font-semibold rounded-lg hover:opacity-90 transition-opacity inline-block"
          style={{ color: colors?.primary || '#6366f1', fontFamily: headingFont }}
        >
          {String(data.buttonText || 'Contact Us')}
        </a>
      ) : (
        <button
          className="px-12 py-6 bg-white text-xl font-semibold rounded-lg hover:opacity-90 transition-opacity"
          style={{ color: colors?.primary || '#6366f1', fontFamily: headingFont }}
        >
          {String(data.buttonText || 'Contact Us')}
        </button>
      )}
      {data.contactEmail && (
        <p className="mt-6 text-lg opacity-75" style={{ fontFamily: bodyFont }}>
          {String(data.contactEmail)}
        </p>
      )}
    </div>
  );
}

export function ImageSlide({ data, colors, fonts }: SlideProps) {
  const headingFont = fonts?.heading || 'Inter';
  const bodyFont = fonts?.body || 'Inter';

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        backgroundColor: colors?.background || '#fff',
        color: colors?.text || '#1a1a1a',
        padding: '80px',
        margin: '0',
        fontFamily: bodyFont,
      }}
    >
      {data.title && (
        <h2
          className="text-6xl font-bold mb-12"
          style={{ color: colors?.primary || '#6366f1', fontFamily: headingFont }}
        >
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
            <span className="text-[var(--muted-foreground)] text-xl">No image</span>
          </div>
        )}
      </div>
      {data.caption && (
        <p
          className="text-center mt-6 text-xl opacity-70"
          style={{ fontFamily: bodyFont }}
        >
          {String(data.caption)}
        </p>
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
