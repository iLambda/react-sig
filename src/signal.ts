import { MutableRefObject, useLayoutEffect, useRef } from 'react';

type Handler<Argument> = 
    [Argument] extends [NonNullable<unknown>]
        ? (e: Argument) => void
        : () => void

type HandlerStore<Data extends object> = {
    [Signal in keyof Data]?: Set<Handler<Data[Signal]>> 
}

export type Signaller<Data extends object> = {
    /* Publish an event */
    publish: <const Signal extends keyof Data>(signal: Signal, event: Data[Signal]) => void
    
    /* Subscribe to an event */
    [subscribe]: <const Signal extends keyof Data>(signal: Signal, handler: Handler<Data[Signal]>) => void
    /* Unsubscribe to an event */
    [unsubscribe]: <const Signal extends keyof Data>(signal: Signal, handler: Handler<Data[Signal]>) => boolean
}

/* Unique symbol */
const subscribe : unique symbol = Symbol();
const unsubscribe : unique symbol = Symbol();

/**
 * Creates a new 
 */
export const createSignaller = <T>() => {
    throw 4;
};

export const useSignaller = <Data extends object>() : Signaller<Data> => {
    /* Create a ref for handlers */
    const handlers = useRef<HandlerStore<Data>>({});
    /* Return signaller */
    return {
        /* Publish an event */
        publish: <const Signal extends keyof Data>(signal: Signal, event: Data[Signal]) => {
            /* Call em */
            handlers.current[signal]?.forEach(handler => handler(event));
        },

        /* The subscribe function */
        [subscribe]: <const Signal extends keyof Data>(signal: Signal, handler: Handler<Data[Signal]>) => {
            /* If the set doesn't exist, create */
            handlers.current[signal] ??= new Set();
            /* Add to the list */
            handlers.current[signal]!.add(handler);
        },
        /* The unsubscribe function */
        [unsubscribe]: <const Signal extends keyof Data>(signal: Signal, handler: Handler<Data[Signal]>) : boolean => {
            /* Check if is there */
            return handlers.current[signal]?.delete(handler) ?? false;
        },
    };
}

export const useSignal = <Data extends object, const Signal extends keyof Data>(source: Signaller<Data>, signal: Signal, handler: Handler<Data[Signal]>) => {
    /* Use effect */
    useLayoutEffect(() => {
        /* Subscribe */
        source[subscribe](signal, handler);
        /* Unsubscribe */
        return () => void(source[unsubscribe](signal, handler));
    }, []);
}
