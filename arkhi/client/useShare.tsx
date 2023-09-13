import { useSyncExternalStore } from "react";

// type ShareListener = () => void;

/**
 * Manages state across islands, and updates islands on state change.
 */
export class Share<T> {
	private value: T;
	private listener: Array<() => void> = [];

	constructor(initialValue: T) {
		this.value = initialValue;
		this.getSnapshot = this.getSnapshot.bind(this);
		this.subscribe = this.subscribe.bind(this);
	}

	set data(newData: T) {
		this.value = newData;
		this.emit();
	}

	public subscribe(onStoreChange: () => void) {
		this.listener.push(onStoreChange);
		return () => {
			this.unsubscribe(onStoreChange);
		};
	}
	private unsubscribe(onStoreChange: () => void) {
		this.listener = this.listener.filter((item) => item !== onStoreChange);
	}

	public getSnapshot() {
		return this.value;
	}

	private emit() {
		this.listener.forEach((item) => item());
	}
}

/**
 * Returns a stateful value shared across islands, and a function to update it.
 * @param initialState initial state value
 */
export function useShare<T>(store: Share<T>) {
	const share = useSyncExternalStore(
		store.subscribe,
		() => store.getSnapshot(),
		() => store.getSnapshot()
	);
	return share;
}
