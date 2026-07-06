import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'
import { AboutContent } from './src/globals/AboutContent'
import { BrandsContent } from './src/globals/BrandsContent'
import { CatalogContent } from './src/globals/CatalogContent'
import { ContactContent } from './src/globals/ContactContent'
import { HomeContent } from './src/globals/HomeContent'
import { ShopsContent } from './src/globals/ShopsContent'
import { SiteSettings } from './src/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET
if (!PAYLOAD_SECRET) {
  throw new Error('Missing required environment variable: PAYLOAD_SECRET')
}

const DATABASE_URI = process.env.DATABASE_URI
if (!DATABASE_URI) {
  throw new Error('Missing required environment variable: DATABASE_URI')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  globals: [
    SiteSettings,
    HomeContent,
    AboutContent,
    CatalogContent,
    BrandsContent,
    ShopsContent,
    ContactContent,
  ],
  editor: lexicalEditor(),
  // Required by Payload 3.x for upload image processing (imageSizes / focalPoint).
  sharp,
  secret: PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, 'src/migrations'),
    pool: {
      connectionString: DATABASE_URI,
    },
  }),
})
