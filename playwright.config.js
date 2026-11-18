import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',

  use: {
    baseURL: 'http://127.0.0.1:5173/real-estate/',
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5']
      }
    }
  ],

  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173/real-estate/',
    reuseExistingServer: false
  }
})
