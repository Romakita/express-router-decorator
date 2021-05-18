import {classOf, Enumerable, getEnumerableKeys, isClass, nameOf, NotEnumerable, Store, Type} from "@tsed/core";
import {IProvider, TokenProvider} from "../interfaces";
import {ProviderScope} from "./ProviderScope";
import {ProviderType} from "./ProviderType";

export class Provider<T = any> implements IProvider<T> {
  @Enumerable()
  public type: ProviderType | any = ProviderType.PROVIDER;

  @Enumerable()
  public injectable: boolean = true;

  @Enumerable()
  public instance: T;

  @Enumerable()
  public deps: TokenProvider[];

  @Enumerable()
  public imports: any[];

  @Enumerable()
  public useFactory: Function;

  @Enumerable()
  public useAsyncFactory: Function;

  @Enumerable()
  public useValue: any;

  @NotEnumerable()
  protected _provide: TokenProvider;

  @NotEnumerable()
  protected _useClass: Type<T>;

  @NotEnumerable()
  protected _instance: T;

  @NotEnumerable()
  private _store: Store;

  @NotEnumerable()
  private _tokenStore: Store;

  [key: string]: any;

  constructor(token: TokenProvider) {
    this.provide = token;
    this.useClass = token;
  }

  get token() {
    return this._provide;
  }

  get provide(): TokenProvider {
    return this._provide;
  }

  set provide(value: TokenProvider) {
    if (value) {
      this._provide = isClass(value) ? classOf(value) : value;
      this._tokenStore = this._store = Store.from(value);
    }
  }

  get useClass(): Type<T> {
    return this._useClass;
  }

  /**
   * Create a new store if the given value is a class. Otherwise the value is ignored.
   * @param value
   */
  @Enumerable()
  set useClass(value: Type<T>) {
    if (isClass(value)) {
      this._useClass = classOf(value);
      this._store = Store.from(value);
    }
  }

  get className() {
    return this.name;
  }

  get name() {
    return nameOf(this.provide);
  }

  public get store(): Store {
    return this._store;
  }

  /**
   * Get the scope of the provider.
   *
   * ::: tip Note
   * Async provider is always a SINGLETON
   * :::
   *
   * @returns {boolean}
   */
  get scope(): ProviderScope {
    if (this.isAsync()) {
      return ProviderScope.SINGLETON;
    }

    return this.get("scope");
  }

  /**
   * Change the scope value of the provider.
   * @param scope
   */
  @Enumerable()
  set scope(scope: ProviderScope) {
    this.store.set("scope", scope);
  }

  get configuration(): Partial<TsED.Configuration> {
    return this.get("configuration");
  }

  @Enumerable()
  set configuration(configuration: Partial<TsED.Configuration>) {
    this.store.set("configuration", configuration);
  }

  get(key: string) {
    return this.store.get(key) || this._tokenStore.get(key);
  }

  isAsync(): boolean {
    return !!this.useAsyncFactory;
  }

  clone(): Provider<any> {
    const provider = new (classOf(this))(this.token);

    getEnumerableKeys(this).forEach((key) => {
      if (this[key] !== undefined) {
        provider[key] = this[key];
      }
    });

    return provider;
  }

  toString() {
    return [
      "Token",
      this.name,
      this.useClass && nameOf(this.useClass),
      this.useFactory && "Factory",
      this.useValue && "Value",
      this.useAsyncFactory && "AsyncFactory"
    ]
      .filter(Boolean)
      .join(":");
  }
}
