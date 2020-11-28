import {Store} from "../domain/Store";
import {StoreFn} from "./storeFn";

export function StoreMerge(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.merge(key, value);
  });
}
