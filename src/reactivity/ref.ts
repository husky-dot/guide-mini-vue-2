import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefTmpl {
  private _value: any
  public dep
  private _rawValue: any;
  constructor (value) {
    this._rawValue = value;
    this._value = convert(value)
    this.dep = new Set()
  }
  get value () {
    trackRefValue(this);
    return this._value
  }
  set value (newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value =  convert(newValue)
      triggerEffects(this.dep)
    }

  }
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}


function convert(value) {
  return isObject(value) ? reactive(value) : value;
}


export function ref(value) {
  return new RefTmpl(value)
}