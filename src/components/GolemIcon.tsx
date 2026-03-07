import golemSvg from "../../public/golem.svg?raw"
import golemSimpleSvg from "../../public/golem-simple.svg?raw"

type GolemIconProps = {
  className?: string
  variant?: "default" | "simple"
}

export const GolemIcon = ({ className, variant = "default" }: GolemIconProps) => (
  <span
    className={`inline-block leading-none ${className ?? ""}`}
    // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local SVG asset
    dangerouslySetInnerHTML={{ __html: variant === "simple" ? golemSimpleSvg : golemSvg }}
  />
)
