import * as React from "react"
import * as Popover from '@radix-ui/react-popover';
import './Multi.css'

function Multi() {
  return (
    <div>
      <Popover.Root>
    <Popover.Trigger className="PopoverTrigger">More info</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className="PopoverContent" sideOffset={5}>
        Some more info…
        <Popover.Arrow className="PopoverArrow" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
    </div>
  )
}

export default Multi