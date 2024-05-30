import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';

import logo from './icons/logo.vue';
import gms from './icons/gms.vue';
import ship from './icons/ship.vue';
import test from './icons/testItem.vue';

const svgs: any = {
  logo,
  gms,
  ship,
  test,
};

const ccIcons: IconSet = {
  component: (props: IconProps) =>
    h(props.tag, [
      h(svgs[props.icon as string], {
        class: 'v-icon__svg',
      }),
    ]),
};

export default ccIcons;
