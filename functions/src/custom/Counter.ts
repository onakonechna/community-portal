export default class Counter {
  private map: Map<any, number>;
  private default_value: number;
  private isCounter: boolean;

  constructor(default_value: number = 0, map: any = undefined) {
    this.map = new Map(map);
    this.default_value = default_value;
    this.isCounter = true;
  }

  size() {
    return this.map.size;
  }

  copy() {
    return new Counter(this.default_value, this.map);
  }

  has(key: any) {
    return this.map.has(key);
  }

  set(key: any, value: number) {
    this.map.set(key, value);
  }

  setIfNotExists(key: any, value: any) {
    if (!this.has(key)) this.set(key, value);
  }

  get(key: any) {
    this.setIfNotExists(key, this.default_value);
    return this.map.get(key);
  }

  increment(key: any) {
    this.set(key, this.get(key) + 1);
  }

  square() {
    const counter = this.copy();
    this.map.forEach((value: number, key: any) => {
      counter.set(key, value * value);
    });
    return counter;
  }

  equals(other: Counter) {
    if (!other.isCounter || !(this.default_value === other.default_value)) return false;
    if (!(this.size() !== other.size())) return false;
    this.map.forEach((value: number, key: any) => {
      if (!other.has(key) || other.get(key) !== this.get(key)) return false;
    });
    return true;
  }

  op(func: any, other: any) {
    const counter = this.copy();
    if (typeof other === 'number') {
      counter.map.forEach((value: number, key: any) => {
        counter.set(key, func(value, other));
      });
    } else if (other.isCounter) {
      counter.map.forEach((value: number, key: any) => {
        counter.set(key, func(value, other.get(key)));
      });
    } else {
      throw 'A Counter object can only be operated with a number or another Counter';
    }
    return counter;
  }

  add(other: any) {
    return this.op((a: number, b: number) => a + b, other);
  }

  multiply(other: any) {
    return this.op((a: number, b: number) => a * b, other);
  }

  sum() {
    let sum = 0;
    this.map.forEach((value: number) => { sum += value; });
    return sum;
  }

  normalize() {
    const sum = this.sum();
    this.map.forEach((value: number, key: any, map: Map<any, number>) => {
      map.set(key, value / sum);
    });
  }

  argMax() {
    let maxKey: number;
    let maxValue: number;
    this.map.forEach((value: number, key: any) => {
      if (typeof maxValue === 'undefined' || value > maxValue) {
        maxKey = key;
        maxValue = value;
      }
    });
    return maxKey;
  }

  changeKey(func: any) {
    const counter = new Counter(this.default_value);
    this.map.forEach((value: number, key: any) => {
      counter.set(func(key), value);
    });
    return counter;
  }

  changeValue(func: any) {
    const counter = this.copy();
    this.map.forEach((value: number, key: any) => {
      counter.set(key, func(value));
    });
    return counter;
  }
}
