import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export default function Tooltip(props) {
  const {
    title,
    children,
    side,
    sideOffset = 2,
    color = 'white',
    ...other
  } = props
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="bg-secondary rounded-xl p-2 z-[999]"
            side={side}
            sideOffset={10}
          >
            <TooltipPrimitive.Arrow fill="#2980E8" />
            {title}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
