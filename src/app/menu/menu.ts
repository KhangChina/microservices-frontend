import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'dashboard'
  },
  {
    id: 'product',
    title: 'Product',
    translate: 'MENU.PRODUCT',
    type: 'item',
    icon: 'package',
    url: 'product'
  },
]
