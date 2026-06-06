import {
  ComponentPropsWithoutRef,
  useContext,
  useState,
  useRef,
  ElementType,
} from "react";
import { TabindexContext } from "@components/treeview/TreeviewUtil";

import { TabindexRootProps } from "@components/treeview/TreeviewType";

//useTabiondex hook
export function useTabindex(id: string) {
  const { elements, getOrderedItems, setFocusableId, focusableId } =
    useContext(TabindexContext);

  return {
    getOrderedItems,
    isFocusable: focusableId === id,
    getProps: <T extends ElementType>(props: ComponentPropsWithoutRef<T>) => ({
      ...props,
      ref: (element: HTMLElement | null) => {
        if (element) {
          elements.current.set(id, element);
        } else {
          elements.current.delete(id);
        }
      },
      onMouseDown: (e: MouseEvent) => {
        props?.onMouseDown?.(e);
        if (e.target !== e.currentTarget) return;
        setFocusableId(id);
      },

      onFocus: (e: FocusEvent) => {
        props?.onFocus?.(e);
        if (e.target !== e.currentTarget) return;
        setFocusableId(id);
      },
      ["data-item"]: true,
      tabIndex: focusableId === id ? 0 : -1,
    }),
  };
}

// 루트
export const TabindexRoot = <T extends ElementType>({
  children,
  valueId,
  as,
  ...props
}: TabindexRootProps<T>) => {
  const Component = as ?? "div";
  const [focusableId, setFocusableId] = useState<string | null>(null);
  const [isShiftTabbing, setIsShiftTabbing] = useState(false);
  const elements = useRef(new Map<string, HTMLElement>());
  const ref = useRef<HTMLDivElement | null>(null);

  const getOrderedItems = () => {
    if (!ref.current) return [];
    const elementsFromDOM = Array.from(
      ref.current.querySelectorAll<HTMLElement>(
        ":where([data-item=true]):not(:where([aria-expanded=false] *))"
      )
    );

    return Array.from(elements.current)
      .filter(([_, element]) => elementsFromDOM.includes(element))
      .sort(
        (a, b) => elementsFromDOM.indexOf(a[1]) - elementsFromDOM.indexOf(b[1])
      )
      .map(([id, element]) => ({ id, element }));
  };

  const tabIndexValue = {
    elements,
    focusableId,
    getOrderedItems,
    setFocusableId,
    onShiftTab: () => {
      setIsShiftTabbing(true);
    },
  };

  return (
    <TabindexContext.Provider value={tabIndexValue}>
      <Component
        {...props}
        ref={ref}
        tabIndex={isShiftTabbing ? -1 : 0}
        data-root
        onFocus={(e) => {
          props?.onFocus?.(e);
          if (e.target !== e.currentTarget || isShiftTabbing) return;
          const orderedItems = getOrderedItems();
          if (orderedItems.length === 0) return;

          if (focusableId != null) {
            elements.current.get(focusableId)?.focus();
          } else if (valueId != null) {
            elements.current.get(valueId)?.focus();
          } else {
            orderedItems.at(0)?.element.focus();
          }
        }}
        onBlur={(e) => {
          props?.onBlur?.(e);
          setIsShiftTabbing(false);
        }}
      >
        {children}
      </Component>
    </TabindexContext.Provider>
  );
};
