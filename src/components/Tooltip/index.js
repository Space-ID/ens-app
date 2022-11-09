import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export default function Tooltip(props) {
  const {
    title,
    children,
    side,
    offset = 4,
    color = 'white',
    contentClass = '',
    defaultOpen = false,
    onOpenChange,
    hideWhenClick = false,
    ...other
  } = props
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger
          onClick={(e) => {
            if (!hideWhenClick) e.preventDefault()
          }}
        >
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={`z-[999] p-1 rounded-lg ${contentClass}`}
            style={{ backgroundColor: color }}
            side={side}
            sideOffset={offset}
            onPointerDownOutside={(event) => {
              event.preventDefault()
            }}
            {...other}
          >
            <TooltipPrimitive.Arrow fill={color} />
            {title}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
