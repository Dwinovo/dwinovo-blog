import Image from './Image'

type MaterialKey = 'flint' | 'stick' | 'yellowWool' | 'lightBlueWool' | 'pinkWool'

type Recipe = {
  name: string
  grid: Array<MaterialKey | null>
}

const MATERIALS: Record<MaterialKey, { src: string; alt: string }> = {
  flint: {
    src: '/static/images/minecraft/flint.png',
    alt: '燧石',
  },
  stick: {
    src: '/static/images/minecraft/stick.png',
    alt: '木棍',
  },
  yellowWool: {
    src: '/static/images/minecraft/yellow_wool.png',
    alt: '黄羊毛',
  },
  lightBlueWool: {
    src: '/static/images/minecraft/light_blue_wool.png',
    alt: '蓝羊毛',
  },
  pinkWool: {
    src: '/static/images/minecraft/pink_wool.png',
    alt: '粉羊毛',
  },
}

const RECIPES: Recipe[] = [
  {
    name: '黄羊毛配方',
    grid: [null, null, 'yellowWool', 'flint', 'stick', 'flint', 'yellowWool', null, null],
  },
  {
    name: '蓝羊毛配方',
    grid: [null, 'lightBlueWool', null, null, 'stick', 'lightBlueWool', 'stick', null, null],
  },
  {
    name: '粉羊毛配方',
    grid: [null, 'pinkWool', null, null, 'stick', 'pinkWool', 'stick', null, null],
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
  src: string
  name: string
  left: number
  top: number
}

const PositionedItem = ({ src, name, left, top }: PositionedItemProps) => {
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
        src={src}
        alt={name}
        title={name}
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
        {name}
      </span>
    </div>
  )
}

const MinecraftCraftingTable = () => {
  return (
    <div className="not-prose my-6 space-y-4">
      {RECIPES.map((recipe) => (
        <div
          key={recipe.name}
          className="overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100/80 p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80"
        >
          <p className="mb-2 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {recipe.name}
          </p>
          <div className="relative mx-auto aspect-[2/1] w-full max-w-[320px] overflow-hidden rounded-md border border-zinc-400/70 bg-zinc-300/60">
            <Image
              src="/static/images/minecraft/crafting_table.jpg"
              alt={`${recipe.name}合成台背景`}
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

                const row = Math.floor(index / 3)
                const col = index % 3
                const { src, alt } = MATERIALS[material]

                return (
                  <PositionedItem
                    key={`${recipe.name}-${index}-${material}`}
                    src={src}
                    name={alt}
                    left={GRID_START_X + col * SLOT_STEP}
                    top={GRID_START_Y + row * SLOT_STEP}
                  />
                )
              })}
              <PositionedItem
                key={`${recipe.name}-output-stick`}
                src={MATERIALS.stick.src}
                name="木棍（产物占位）"
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
