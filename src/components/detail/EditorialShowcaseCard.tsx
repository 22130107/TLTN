"use client"

// Format city name into 2 lines if contains "TP. Hồ Chí Minh"
/* 1. Top Header Row: City Name (Left) + Number Circle Stamp (Right) */ /* Round Category Stamp */ /* 2. Center: Rounded Photo Frame with Left Edge Vertical Archive Label */ /* Vertical Archive Label Running on Left Edge */ /* Showcase Photo with rounded-[28px] (Exact Figma Match) */ /* 3. Bottom Row: Title and Black Rounded Tag Pills */ /* Read more footer note */

export interface EditorialShowcaseProps {
  city: string

  indexNo: string

  archiveCode: string

  title: string

  image: string

  tags: string[]
}

export default function EditorialShowcaseCard({
  city,

  indexNo,

  archiveCode,

  title,

  image,

  tags,
}: EditorialShowcaseProps) {
  const formattedCity =
    city === "TP. Hồ Chí Minh" ? (
      <>
        <span>TP. Hồ Chí</span>
        <br />
        <span>Minh</span>
      </>
    ) : (
      <span>{city}</span>
    )

  return (
    <article className="relative w-full max-w-2xl mx-auto border-2 border-black bg-white p-6 sm:p-9 shadow-[6px_6px_0px_#000000]">
      {}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-base sm:text-lg font-black text-black leading-tight tracking-tight uppercase">
          {formattedCity}
        </h2>

        {}
        <div className="size-11 rounded-full border-2 border-black flex items-center justify-center shrink-0 select-none bg-white shadow-[2px_2px_0px_#000000]">
          <span className="font-mono text-sm font-bold text-black tracking-wider">
            {indexNo}
          </span>
        </div>
      </div>

      {}
      <div className="relative my-4 flex items-center justify-center">
        {}
        <div className="absolute -left-10 sm:-left-12 top-1/2 -translate-y-1/2 select-none pointer-events-none">
          <span className="-rotate-90 block font-mono text-[11px] sm:text-xs text-black tracking-[0.25em] whitespace-nowrap font-bold">
            {archiveCode.toLowerCase()}
          </span>
        </div>

        {}
        <div className="w-full aspect-[4/3] rounded-[24px] sm:rounded-[28px] overflow-hidden border-2 border-black bg-neutral-100 shadow-[3px_3px_0px_#000000]">
          <img
            src={image}
            alt={title}
            className="size-full object-cover object-center transition-transform duration-500 hover:scale-105"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {}
      <div className="mt-5 space-y-3.5">
        <h1 className="text-lg sm:text-2xl font-black text-black leading-snug tracking-tight">
          {title}
        </h1>

        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#222222] text-white text-xs font-semibold px-3.5 py-1.5 rounded-[6px] tracking-wide shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {}
        <div className="flex justify-end pt-2 text-xs font-bold text-black/70 italic">
          <span>Read more ▾</span>
        </div>
      </div>
    </article>
  )
}
