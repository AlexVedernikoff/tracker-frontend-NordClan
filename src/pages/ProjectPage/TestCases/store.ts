import { observable, action, computed } from 'mobx'
import { Props } from './types'

export class Store {
  @observable isOpen = false

  constructor(props: Props) {
  }
}
