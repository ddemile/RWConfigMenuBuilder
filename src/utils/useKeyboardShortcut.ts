import { useCallback, useEffect } from 'react';

type OptionalConfig = Pick<
 KeyboardEvent,
 'altKey' | 'ctrlKey' | 'shiftKey'
>

interface ShortcutConfig extends Partial<OptionalConfig> {
 code: KeyboardEvent['code'];
 shortcutTarget?: HTMLElement;
}

type ShortcutAction = (e: KeyboardEvent) => void;

export default function useKeyboardShortcut(
 shortcutAction: ShortcutAction,
 config: ShortcutConfig
) {
 const targetElement = config.shortcutTarget || document;

 const eventHandler = useCallback((e: KeyboardEvent) => {
  const {code, ctrlKey, altKey, shiftKey} = e;
  if(config.code !== code) return;
  if(config.ctrlKey && !ctrlKey) return;
  if(config.shiftKey && !shiftKey) return;
  if(config.altKey && !altKey) return;

  shortcutAction(e);
 },[shortcutAction, config])

 useEffect(()=>{
  targetElement.addEventListener('keydown', eventHandler as any)
  return () => targetElement.removeEventListener(
    'keydown', 
    eventHandler as any
   )
 }, [targetElement, eventHandler])
}