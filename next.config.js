const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  distDir: 'dist',
  basePath: process.env.BASE_PATH || '',
  images: {
    unoptimized: true,
  },
}

module.exports = withNextra(config)
