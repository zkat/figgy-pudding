
declare function figgyPudding<
  S extends figgyPudding.Specs = {},
  O extends figgyPudding.Options = {}
>(specs?: S, opts?: O): figgyPudding.PuddingFactory<S, O>

declare module figgyPudding {
  type Flatten<T extends [any, ...any[]]> = T extends [infer H] ? H : {} 

  interface Options {
    other?(key: string): boolean
  }

  type OtherOpt = Required<Pick<Options, 'other'>>

  type Specs = {
    [K in string]: string | Spec
  }
  interface Spec {
    default?: any
  }

  type SpecWithDefault = Required<Pick<Spec, 'default'>>
  type WidenPrimitive<T> =
    T extends string ? string :
    T extends number ? number :
    T extends boolean ? boolean :
    T
  type SpecDefault<S> = S extends {default(): infer R} ? WidenPrimitive<R> : S extends {default: infer D} ? D : unknown

  interface MapLike<K, V> {
    get(key: K): V | undefined
  }

  type AvailableKeys<S, O> = O extends OtherOpt ? string : keyof S

  type Proxy<S, O> = {
    [K in keyof S]: SpecDefault<S[K]>
  } & (O extends {other(key: string): boolean} ? {
    [key: string]: unknown
  } : {})

  type ProxyFiggyPudding<S, O, P = {}> = Readonly<Proxy<S, O>> & FiggyPudding<S, O>

  type PuddingFactory<S, O> = <T extends any[]>(...providers: T) => ProxyFiggyPudding<S, O, P>

  interface FiggyPuddingConstructor {
    new <S extends Specs, O extends Options>(
      specs: S, opts: O, providers: any[]
    ): FiggyPudding<S, O>
  }

  interface FiggyPudding<S, O> {
    readonly __isFiggyPudding: true
    readonly [Symbol.toStringTag]: 'FiggyPudding'

    get<K extends AvailableKeys<S, O>>(key: K): K extends keyof S ? SpecDefault<S[K]> : unknown
    concat<P extends any[]>(...providers: ): ProxyFiggyPudding<S, O, P>
    concat(...providers: any[]): ProxyFiggyPudding<S, O>
    toJSON(): {
      [K in AvailableKeys<S, O>]: K extends keyof S ? SpecDefault<S[K]> : unknown
    }
    forEach<This = this>(
      fn: (this: This, value: unknown, key: AvailableKeys<S, O>, opts: this) => void,
      thisArg?: This
    ): void
    entries(matcher: (key: string) => boolean): IterableIterator<[string, unknown]>
    entries(): IterableIterator<[AvailableKeys<S, O>, unknown]>
    [Symbol.iterator](): IterableIterator<[AvailableKeys<S, O>, unknown]>
    keys(): IterableIterator<AvailableKeys<S, O>>
    values(): IterableIterator<unknown>
  }
}

export = figgyPudding
