import { useEffect, useState } from "react";

type ShareListener = () => void;

/**
 * Manages state across islands, and updates islands on state change.
 */
class Share<T> {
	private value: T;
	private listener: ShareListener[] = [];

	constructor(initialValue: T) {
		this.value = initialValue;
	}

	public getter(): T {
		return this.value;
	}

	public setter(value: T) {
		this.value = value;
		this.broadcast();
	}

	public subscribe(listener: ShareListener) {
		this.listener.push(listener);
	}
	public unsubscribe(listener: ShareListener) {
		this.listener = this.listener.filter((item) => item != listener);
	}

	private broadcast() {
		this.listener.forEach((handler) => handler());
	}
}

/**
 * Returns a stateful value shared across islands, and a function to update it.
 * @param initialState initial state value
 */
export function useShare<T>(initialState: T) {
	const [state, setState] = useState(initialState);
	const shareStore = new Share(initialState);

	useEffect(() => {
		const listener = () => setState(shareStore.getter());
		shareStore.subscribe(listener);
		return () => shareStore.unsubscribe(listener);
	}, []);

	const setter = (value: T) => shareStore.setter(value);

	return [state, setter];
}
