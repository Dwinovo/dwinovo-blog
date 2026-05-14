import Image from './Image'

type Locale = 'zh' | 'en'
type MaterialKey = 'flint' | 'stick' | 'yellowWool' | 'lightBlueWool' | 'pinkWool'
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

const STRINGS = {
  zh: {
    output: '产物',
  },
  en: {
    output: 'Output',
  },
} as const

const ITEMS: Record<ItemKey, { src: string; name: Record<Locale, string> }> = {
  flint: {
    src: '/static/images/minecraft/flint.png',
    name: { zh: '燧石', en: 'Flint' },
  },
  stick: {
    src: '/static/images/minecraft/stick.png',
    name: { zh: '木棍', en: 'Stick' },
  },
  yellowWool: {
    src: '/static/images/minecraft/yellow_wool.png',
    name: { zh: '黄色羊毛', en: 'Yellow Wool' },
  },
  lightBlueWool: {
    src: '/static/images/minecraft/light_blue_wool.png',
    name: { zh: '淡蓝色羊毛', en: 'Light Blue Wool' },
  },
  pinkWool: {
    src: '/static/images/minecraft/pink_wool.png',
    name: { zh: '粉红色羊毛', en: 'Pink Wool' },
  },
  usagiWeapon: {
    src: '/static/images/minecraft/usagi_weapon.png',
    name: { zh: '乌萨奇的讨伐棒', en: "Usagi's Stick" },
  },
  hachiwareWeapon: {
    src: '/static/images/minecraft/hachiware_weapon.png',
    name: { zh: '小八的讨伐棒', en: "Hachiware's Stick" },
  },
  chiikawaWeapon: {
    src: '/static/images/minecraft/chiikawa_weapon.png',
    name: { zh: '吉伊的讨伐棒', en: "Chiikawa's Stick" },
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
    grid: [null, 'lightBlueWool', null, null, 'stick', 'lightBlueWool', 'stick', null, null],
    output: 'hachiwareWeapon',
  },
  {
    id: 'chiikawa-recipe',
    name: { zh: '吉伊的讨伐棒', en: "Chiikawa's Stick" },
    grid: [null, 'pinkWool', null, null, 'stick', 'pinkWool', 'stick', null, null],
    output: 'chiikawaWeapon',
  },
]

const pixelated = { imageRendering: 'pixelated' as const }

type SlotProps = {
  itemKey?: ItemKey
  locale: Locale
  variant?: 'input' | 'output'
}

const Slot = ({ itemKey, locale, variant = 'input' }: SlotProps) => {
  const item = itemKey ? ITEMS[itemKey] : null
  const itemName = item ? item.name[locale] : ''
  const sizeClass = variant === 'output' ? 'h-16 w-16' : 'h-12 w-12'
  const imgSize = variant === 'output' ? 56 : 40

  return (
    <div
      className={`group relative ${sizeClass} shrink-0 border border-zinc-500/70 bg-[#8B8B8B] shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.35),inset_-2px_-2px_0_0_rgba(255,255,255,0.45)] dark:border-zinc-700 dark:bg-[#3F3F3F] dark:shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.55),inset_-2px_-2px_0_0_rgba(255,255,255,0.12)]`}
    >
      {item && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={item.src}
            alt={itemName}
            title={itemName}
            width={imgSize}
            height={imgSize}
            className=""
            style={{
              ...pixelated,
              width: `${imgSize}px`,
              height: `${imgSize}px`,
            }}
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
