import { useEffect, useRef } from "react";

/**
 * Spawns an interval that invokes given callback until the caller component is unmounted
 * @param callback
 * @param delay
 */
export function useInterval(callback: () => void, delay: number) {
  const storedCallback = useRef<() => void>();
  useEffect(() => {
    storedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (storedCallback && storedCallback.current) {
        storedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
}

/**
 * Hook used for debugging re-renders
 * @param props
 */
export function useTraceUpdate(props: any, prefix?: string) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        // @ts-ignore
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      // tslint:disable-next-line
      console.log(
        `${prefix ? `${prefix} >> ` : ""}Changed props:`,
        changedProps
      );
    }
    prev.current = props;
  });
}
