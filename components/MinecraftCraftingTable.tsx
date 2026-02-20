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

const ITEMS: Record<ItemKey, { src: string; name: Record<Locale, string> }> = {
  flint: {
    src: '/static/images/minecraft/flint.png',
    name: {
      zh: '燧石',
      en: 'Flint',
    },
  },
  stick: {
    src: '/static/images/minecraft/stick.png',
    name: {
      zh: '木棍',
      en: 'Stick',
    },
  },
  yellowWool: {
    src: '/static/images/minecraft/yellow_wool.png',
    name: {
      zh: '黄羊毛',
      en: 'Yellow Wool',
    },
  },
  lightBlueWool: {
    src: '/static/images/minecraft/light_blue_wool.png',
    name: {
      zh: '蓝羊毛',
      en: 'Light Blue Wool',
    },
  },
  pinkWool: {
    src: '/static/images/minecraft/pink_wool.png',
    name: {
      zh: '粉羊毛',
      en: 'Pink Wool',
    },
  },
  usagiWeapon: {
    src: '/static/images/minecraft/usagi_weapon.png',
    name: {
      zh: '乌萨奇的讨伐棒',
      en: "Usagi's Weapon",
    },
  },
  hachiwareWeapon: {
    src: '/static/images/minecraft/hachiware_weapon.png',
    name: {
      zh: '小八的讨伐棒',
      en: "Hachiware's Weapon",
    },
  },
  chiikawaWeapon: {
    src: '/static/images/minecraft/chiikawa_weapon.png',
    name: {
      zh: '吉伊的讨伐棒',
      en: "Chiikawa's Weapon",
    },
  },
}

const RECIPES: Recipe[] = [
  {
    id: 'usagi-recipe',
    name: {
      zh: '乌萨奇的讨伐棒',
      en: "Usagi's Weapon",
    },
    grid: [null, null, 'yellowWool', 'flint', 'stick', 'flint', 'yellowWool', null, null],
    output: 'usagiWeapon',
  },
  {
    id: 'hachiware-recipe',
    name: {
      zh: '小八的讨伐棒',
      en: "Hachiware's Weapon",
    },
    grid: [null, 'lightBlueWool', null, null, 'stick', 'lightBlueWool', 'stick', null, null],
    output: 'hachiwareWeapon',
  },
  {
    id: 'chiikawa-recipe',
    name: {
      zh: '吉伊的讨伐棒',
      en: "Chiikawa's Weapon",
    },
    grid: [null, 'pinkWool', null, null, 'stick', 'pinkWool', 'stick', null, null],
    output: 'chiikawaWeapon',
  },
]

const GRID_START_X = 45
const GRID_START_Y = 33
const SLOT_STEP = 36
const ITEM_SIZE = 32

const OUTPUT_ITEM_X = 232
const OUTPUT_ITEM_Y = 69

const itemImageStyle = { imageRendering: 'pixelated' as const }

type PositionedItemProps = {
  locale: Locale
  itemKey: ItemKey
  left: number
  top: number
}

const getGridPosition = (index: number) => {
  const row = Math.floor(index / 3)
  const col = index % 3

  return {
    left: GRID_START_X + col * SLOT_STEP,
    top: GRID_START_Y + row * SLOT_STEP,
  }
}

const PositionedItem = ({ locale, itemKey, left, top }: PositionedItemProps) => {
  const item = ITEMS[itemKey]
  const itemName = item.name[locale]

  return (
    <div
      className="group absolute"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${ITEM_SIZE}px`,
        height: `${ITEM_SIZE}px`,
      }}
    >
      <Image
        src={item.src}
        alt={itemName}
        title={itemName}
        width={ITEM_SIZE}
        height={ITEM_SIZE}
        className="h-full w-full"
        style={{
          ...itemImageStyle,
          width: `${ITEM_SIZE}px`,
          height: `${ITEM_SIZE}px`,
        }}
      />
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-zinc-900/90 px-1.5 py-0.5 text-[10px] leading-none font-medium whitespace-nowrap text-white opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100 dark:bg-zinc-100/90 dark:text-zinc-900">
        {itemName}
      </span>
    </div>
  )
}

type MinecraftCraftingTableProps = {
  lang?: Locale
}

const MinecraftCraftingTable = ({ lang = 'zh' }: MinecraftCraftingTableProps) => {
  return (
    <div className="not-prose my-6 space-y-4">
      {RECIPES.map((recipe) => (
        <div
          key={recipe.id}
          className="overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100/80 p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80"
        >
          <p className="mb-2 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {recipe.name[lang]}
          </p>
          <div className="relative mx-auto aspect-[2/1] w-full max-w-[320px] overflow-hidden rounded-md border border-zinc-400/70 bg-zinc-300/60">
            <Image
              src="/static/images/minecraft/crafting_table.jpg"
              alt={
                lang === 'zh'
                  ? `${recipe.name[lang]}合成台背景`
                  : `${recipe.name[lang]} crafting table`
              }
              width={320}
              height={160}
              className="h-full w-full object-cover"
              style={itemImageStyle}
            />
            <div className="absolute inset-0">
              {recipe.grid.map((material, index) => {
                if (!material) {
                  return null
                }
                const position = getGridPosition(index)

                return (
                  <PositionedItem
                    key={`${recipe.id}-slot-${index}`}
                    locale={lang}
                    itemKey={material}
                    left={position.left}
                    top={position.top}
                  />
                )
              })}
              <PositionedItem
                key={`${recipe.id}-output`}
                locale={lang}
                itemKey={recipe.output}
                left={OUTPUT_ITEM_X}
                top={OUTPUT_ITEM_Y}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MinecraftCraftingTable
