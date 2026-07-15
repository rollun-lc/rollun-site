import * as migration_20260705_141430_initial from './20260705_141430_initial';
import * as migration_20260706_064817_site_settings from './20260706_064817_site_settings';
import * as migration_20260706_072820_media from './20260706_072820_media';
import * as migration_20260706_080705_page_content_globals from './20260706_080705_page_content_globals';
import * as migration_20260706_090618_products_brands_shops_roles from './20260706_090618_products_brands_shops_roles';
import * as migration_20260715_120000_design_refresh from './20260715_120000_design_refresh';

export const migrations = [
  {
    up: migration_20260705_141430_initial.up,
    down: migration_20260705_141430_initial.down,
    name: '20260705_141430_initial',
  },
  {
    up: migration_20260706_064817_site_settings.up,
    down: migration_20260706_064817_site_settings.down,
    name: '20260706_064817_site_settings',
  },
  {
    up: migration_20260706_072820_media.up,
    down: migration_20260706_072820_media.down,
    name: '20260706_072820_media',
  },
  {
    up: migration_20260706_080705_page_content_globals.up,
    down: migration_20260706_080705_page_content_globals.down,
    name: '20260706_080705_page_content_globals',
  },
  {
    up: migration_20260706_090618_products_brands_shops_roles.up,
    down: migration_20260706_090618_products_brands_shops_roles.down,
    name: '20260706_090618_products_brands_shops_roles'
  },
  {
    up: migration_20260715_120000_design_refresh.up,
    down: migration_20260715_120000_design_refresh.down,
    name: '20260715_120000_design_refresh',
  },
];
