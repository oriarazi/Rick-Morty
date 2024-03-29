import { useEffect, useRef, useState } from "react";

const useInfiniteScroll = <T extends HTMLElement>(
  cb: () => unknown,
  isObserving: boolean,
  options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] => {
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(true);
  // NOTE: dummyTrigger is in order to re-observe the element after cb has been don
  // without it if the element is still in viewport after cb, it wont re-run cb
  const [dummyTrigger, setDummyTrigger] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    // NOTE: We went for mechanism which each observerCallback should run once per page,
    // So we need to force this and avoid running cb more than once per observer
    let didCallbackTriggered = false;

    if (!("IntersectionObserver" in window)) {
      // TODO: Fallback for unsupported browsers
      setIsBrowserCompatible(false);
      return;
    }

    if (!isObserving) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry?.isIntersecting && !didCallbackTriggered) {
        didCallbackTriggered = true;
        await cb();
        // As mentioned above, for re-observing the element
        setDummyTrigger((prev) => !prev);
      }
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [cb, options, dummyTrigger, setDummyTrigger, isObserving]);

  return [elementRef, isBrowserCompatible];
};

export default useInfiniteScroll;
