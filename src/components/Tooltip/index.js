import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export default function Tooltip(props) {
  const {
    title,
    children,
    side,
    offset = 4,
    color = 'white',
    contentClass = '',
    ...other
  } = props
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={`z-[999] p-1 rounded-lg ${contentClass}`}
            style={{ backgroundColor: color }}
            side={side}
            sideOffset={offset}
          >
            <TooltipPrimitive.Arrow fill={color} />
            {title}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
