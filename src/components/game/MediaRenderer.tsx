import type { Media } from "@/types/game"

type MediaRendererProps = {
  media: Media[]
  className?: string
}

const MediaItem = ({ item }: { item: Media }) => {
  switch (item.type) {
    case "image":
      return (
        <figure>
          <img src={item.url} alt={item.caption ?? ""} className="w-full rounded-md object-cover" loading="lazy" />
          {item.caption && <figcaption className="mt-1 text-xs text-muted-foreground">{item.caption}</figcaption>}
        </figure>
      )
    case "youtube": {
      // Extract video ID from various YouTube URL formats
      const videoId =
        item.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?/]+)/)?.[1] ?? item.url
      return (
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={item.caption ?? "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )
    }
    case "audio":
      return (
        <div>
          {/* biome-ignore lint/a11y/useMediaCaption: game audio content, captions not applicable */}
          <audio controls src={item.url} className="w-full" preload="metadata" />
          {item.caption && <p className="mt-1 text-xs text-muted-foreground">{item.caption}</p>}
        </div>
      )
    case "video":
      return (
        <div>
          {/* biome-ignore lint/a11y/useMediaCaption: game video content, captions not applicable */}
          <video controls src={item.url} className="w-full rounded-md" preload="metadata" />
          {item.caption && <p className="mt-1 text-xs text-muted-foreground">{item.caption}</p>}
        </div>
      )
    default:
      return null
  }
}

export const MediaRenderer = ({ media, className }: MediaRendererProps) => {
  const renderable = media.filter((m) => m.type !== "attachment")
  if (renderable.length === 0) return null

  return (
    <div className={className ?? "space-y-3"}>
      {renderable.map((item) => (
        <MediaItem key={item.url} item={item} />
      ))}
    </div>
  )
}
