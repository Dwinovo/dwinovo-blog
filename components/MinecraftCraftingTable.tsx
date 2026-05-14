import Image from './Image'

type Locale = 'zh' | 'en'
type MaterialKey = 'flint' | 'stick' | 'yellowWool' | 'blueWool' | 'pinkWool'
type OutputKey = 'usagiWeapon' | 'hachiwareWeapon' | 'chiikawaWeapon'
type ItemKey = MaterialKey | OutputKey
type GridSlot = MaterialKey | null
type GridSlots = [
  GridSlot,
  GridSlot,
  GridSlot,
  GridSlot,
  GridSlot,
  GridSlot,
  GridSlot,
  GridSlot,
  GridSlot,
]

type Recipe = {
  id: string
  name: Record<Locale, string>
  grid: GridSlots
  output: OutputKey
}

type ItemDef = {
  src: string
  name: Record<Locale, string>
  // Pixel-art textures (vanilla items + music_box) need nearest-neighbor scaling;
  // the mod's high-res weapon artwork looks better with the browser's default smoothing.
  pixelArt: boolean
}

const STRINGS = {
  zh: { output: '产物' },
  en: { output: 'Output' },
} as const

const ITEMS: Record<ItemKey, ItemDef> = {
  flint: {
    src: '/static/images/minecraft/flint.png',
    name: { zh: '燧石', en: 'Flint' },
    pixelArt: true,
  },
  stick: {
    src: '/static/images/minecraft/stick.png',
    name: { zh: '木棍', en: 'Stick' },
    pixelArt: true,
  },
  yellowWool: {
    src: '/static/images/minecraft/yellow_wool.png',
    name: { zh: '黄色羊毛', en: 'Yellow Wool' },
    pixelArt: true,
  },
  blueWool: {
    src: '/static/images/minecraft/blue_wool.png',
    name: { zh: '蓝色羊毛', en: 'Blue Wool' },
    pixelArt: true,
  },
  pinkWool: {
    src: '/static/images/minecraft/pink_wool.png',
    name: { zh: '粉红色羊毛', en: 'Pink Wool' },
    pixelArt: true,
  },
  usagiWeapon: {
    src: '/static/images/minecraft/usagi_weapon.png',
    name: { zh: '乌萨奇的讨伐棒', en: "Usagi's Stick" },
    pixelArt: false,
  },
  hachiwareWeapon: {
    src: '/static/images/minecraft/hachiware_weapon.png',
    name: { zh: '小八的讨伐棒', en: "Hachiware's Stick" },
    pixelArt: false,
  },
  chiikawaWeapon: {
    src: '/static/images/minecraft/chiikawa_weapon.png',
    name: { zh: '吉伊的讨伐棒', en: "Chiikawa's Stick" },
    pixelArt: false,
  },
}

const RECIPES: Recipe[] = [
  {
    id: 'usagi-recipe',
    name: { zh: '乌萨奇的讨伐棒', en: "Usagi's Stick" },
    grid: [null, null, 'yellowWool', 'flint', 'stick', 'flint', 'yellowWool', null, null],
    output: 'usagiWeapon',
  },
  {
    id: 'hachiware-recipe',
    name: { zh: '小八的讨伐棒', en: "Hachiware's Stick" },
    grid: [null, 'blueWool', null, null, 'stick', 'blueWool', 'stick', null, null],
    output: 'hachiwareWeapon',
  },
  {
    id: 'chiikawa-recipe',
    name: { zh: '吉伊的讨伐棒', en: "Chiikawa's Stick" },
    grid: [null, 'pinkWool', null, null, 'stick', 'pinkWool', 'stick', null, null],
    output: 'chiikawaWeapon',
  },
]

// Pixel-art textures (vanilla items, music_box) ship as 128x128 PNGs, so we
// render at exactly 0.5x — clean integer downscale, no fractional pixels.
const INPUT_SLOT = 80
const INPUT_IMG = 64
const OUTPUT_SLOT = 96
const OUTPUT_IMG = 80

type SlotProps = {
  itemKey?: ItemKey
  locale: Locale
  variant?: 'input' | 'output'
}

const Slot = ({ itemKey, locale, variant = 'input' }: SlotProps) => {
  const item = itemKey ? ITEMS[itemKey] : null
  const itemName = item ? item.name[locale] : ''
  const slotPx = variant === 'output' ? OUTPUT_SLOT : INPUT_SLOT
  const imgPx = variant === 'output' ? OUTPUT_IMG : INPUT_IMG
  const renderingClass = item?.pixelArt ? '[image-rendering:pixelated]' : ''

  return (
    <div
      className="group relative shrink-0 border border-zinc-500/70 bg-[#8B8B8B] shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.35),inset_-2px_-2px_0_0_rgba(255,255,255,0.45)] dark:border-zinc-700 dark:bg-[#3F3F3F] dark:shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.55),inset_-2px_-2px_0_0_rgba(255,255,255,0.12)]"
      style={{ width: `${slotPx}px`, height: `${slotPx}px` }}
    >
      {item && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={item.src}
            alt={itemName}
            title={itemName}
            width={imgPx}
            height={imgPx}
            className={renderingClass}
            style={{ width: `${imgPx}px`, height: `${imgPx}px` }}
          />
        </div>
      )}
      {item && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded bg-zinc-900/90 px-1.5 py-0.5 text-[10px] leading-none font-medium whitespace-nowrap text-white opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100 dark:bg-zinc-100/90 dark:text-zinc-900">
          {itemName}
        </span>
      )}
    </div>
  )
}

const Arrow = () => (
  <svg
    viewBox="0 0 48 24"
    className="h-6 w-12 shrink-0 text-zinc-500 dark:text-zinc-400"
    aria-hidden="true"
  >
    <path
      d="M2 12 H36 M28 4 L38 12 L28 20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

type MinecraftCraftingTableProps = {
  lang?: Locale
}

const MinecraftCraftingTable = ({ lang = 'zh' }: MinecraftCraftingTableProps) => {
  const labels = STRINGS[lang]
  return (
    <div className="not-prose my-6 space-y-5">
      {RECIPES.map((recipe) => (
        <div
          key={recipe.id}
          className="overflow-hidden rounded-xl border border-zinc-300 bg-zinc-50 p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60"
        >
          <p className="mb-4 text-center text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-200">
            {recipe.name[lang]}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="grid grid-cols-3 gap-1 rounded-md border border-zinc-400/60 bg-zinc-200/70 p-2 dark:border-zinc-700 dark:bg-zinc-800/70">
              {recipe.grid.map((material, index) => (
                <Slot
                  key={`${recipe.id}-slot-${index}`}
                  itemKey={material ?? undefined}
                  locale={lang}
                />
              ))}
            </div>
            <Arrow />
            <div className="flex flex-col items-center gap-1">
              <Slot itemKey={recipe.output} locale={lang} variant="output" />
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                {labels.output}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MinecraftCraftingTable
