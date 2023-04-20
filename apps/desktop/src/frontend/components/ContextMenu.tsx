import React from 'react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from '@radix-ui/react-icons'

const RevealedContextMenu = () => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
  const [urlsChecked, setUrlsChecked] = React.useState(false)
  const [person, setPerson] = React.useState('pedro')

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className='block w-[300px] select-none rounded border-2 border-dashed border-white py-[45px] text-center text-[15px] text-white'>
        Right click here.
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className='min-w-[220px] overflow-hidden rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'
          alignOffset={5}
        >
          <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
            Back{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+[
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item
            className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            disabled
          >
            Foward{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+]
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
            Reload{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+R
            </div>
          </ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className='text-violet11 data-[state=open]:bg-violet4 data-[state=open]:text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 data-[highlighted]:data-[state=open]:bg-violet9 data-[highlighted]:data-[state=open]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
              More Tools
              <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
                <ChevronRightIcon />
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className='min-w-[220px] overflow-hidden rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'
                sideOffset={2}
                alignOffset={-5}
              >
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Save Page As…{' '}
                  <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
                    ⌘+S
                  </div>
                </ContextMenu.Item>
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Create Shortcut…
                </ContextMenu.Item>
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Name Window…
                </ContextMenu.Item>
                <ContextMenu.Separator className='bg-violet6 m-[5px] h-[1px]' />
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Developer Tools
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Separator className='bg-violet6 m-[5px] h-[1px]' />

          <ContextMenu.CheckboxItem
            className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Bookmarks{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+B
            </div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Full URLs
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className='bg-violet6 m-[5px] h-[1px]' />

          <ContextMenu.Label className='text-mauve11 pl-[25px] text-xs leading-[25px]'>
            People
          </ContextMenu.Label>
          <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
            <ContextMenu.RadioItem
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
              value='pedro'
            >
              <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              Pedro Duarte
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
              value='colm'
            >
              <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              Colm Tuite
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

export default RevealedContextMenu
