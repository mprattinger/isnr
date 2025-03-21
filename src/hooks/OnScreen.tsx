import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// export const useOnScreen = (ref: RefObject<HTMLElement>) => {
//   const [isIntersecting, setIntersecting] = useState(false);

//   const observer = useMemo(
//     () =>
//       new IntersectionObserver(([entry]) =>
//         setIntersecting(entry.isIntersecting)
//       ),
//     [ref]
//   );

//   useEffect(() => {
//     observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   return isIntersecting;
// };

// export function useVisibility<Element extends HTMLElement>() {
//   const [isVisible, setIsVisible] = useState(false);
//   const currentElement = useRef<Element>(null);

//   const observer = useMemo(
//     () =>
//       new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting)),
//     [currentElement]
//   );

//   useEffect(() => {
//     if (!currentElement.current) return;

//     observer.observe(currentElement.current);
//     return () => observer.disconnect();
//   }, []);

//   return { isVisible, currentElement };
// }

export function useVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const [refElement, setRefElement] = useState<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setRefElement(node);
    }
  }, []);

  useEffect(() => {
    if (refElement && !isVisible) {
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setIsVisible(true)
      );
      observer.observe(refElement);

      return () => {
        observer.disconnect();
      };
    }
  }, [isVisible, refElement]);

  return { isVisible, ref: setRef };
}
