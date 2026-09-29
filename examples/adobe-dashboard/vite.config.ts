/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {defineConfig} from 'vite';
import fs from 'fs';
import path from 'path';
import type {Plugin} from 'vite';
import react from '@vitejs/plugin-react';

// Handles ../intl/*.json and ../intl/<feature>/*.json imports.
function intlJsonPlugin(): Plugin {
  return {
    name: 'intl-json-loader',
    async resolveId(source, importer) {
      if (importer && /\/intl\/.*\*.json$/.test(source)) {
        const dir = path.dirname(importer);
        const intlDir = path.resolve(dir, source.replace('*.json', ''));
        return `virtual:intl-messages:${intlDir}`;
      }
      return null;
    },
    async load(id) {
      if (id.startsWith('virtual:intl-messages:')) {
        const intlDir = id.replace('virtual:intl-messages:', '');
        try {
          const files = fs.readdirSync(intlDir).filter(f => f.endsWith('.json'));
          const messages: Record<string, Record<string, string>> = {};

          for (const file of files) {
            const locale = path.basename(file, '.json');
            const content = fs.readFileSync(path.join(intlDir, file), 'utf-8');
            messages[locale] = JSON.parse(content);
          }

          return `export default ${JSON.stringify(messages)};`;
        } catch {
          return 'export default {};';
        }
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [react(), intlJsonPlugin()],
  resolve: {
    conditions: ['source']
  }
});
