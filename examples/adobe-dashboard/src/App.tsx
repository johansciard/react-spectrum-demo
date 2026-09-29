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

import {useState} from 'react';
import {BarChart3, CircleUser, LayoutDashboard, Lock, Settings} from 'lucide-react';
import type {Selection} from 'react-aria-components/ListBox';
import {Button} from './components/Button';
import {Text} from './components/Content';
import {ListBox, ListBoxItem} from './components/ListBox';
import {Menu, MenuItem, MenuTrigger} from './components/Menu';
import {MyToastRegion} from './components/Toast';
import {type PageId} from './data';
import Overview from './views/Overview';
import Reports from './views/Reports';
import SettingsView from './views/Settings';

function selectedPage(keys: Selection): PageId {
  if (keys === 'all') {
    return 'overview';
  }
  const key = keys.values().next().value;
  if (key === 'reports' || key === 'settings') {
    return key;
  }
  return 'overview';
}

export default function App() {
  const [page, setPage] = useState<PageId>('overview');

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Adobe internal dashboard</h1>
        <MenuTrigger>
          <Button variant="quiet" aria-label="User menu">
            <CircleUser />
          </Button>
          <Menu aria-label="Account">
            <MenuItem id="profile">Profile</MenuItem>
            <MenuItem id="preferences">Preferences</MenuItem>
            <MenuItem id="sign-out">Logout</MenuItem>
          </Menu>
        </MenuTrigger>
      </header>
      <div className="app-body">
        <nav className="app-sidebar">
          <ListBox
            className="react-aria-ListBox sidebar-nav"
            aria-label="Main navigation"
            selectionMode="single"
            selectionBehavior="replace"
            disallowEmptySelection
            selectedKeys={new Set([page])}
            onSelectionChange={keys => setPage(selectedPage(keys))}>
            <ListBoxItem id="overview" textValue="Overview">
              <LayoutDashboard />
              <Text slot="label">Overview</Text>
            </ListBoxItem>
            <ListBoxItem id="reports" textValue="Reports">
              <BarChart3 />
              <Text slot="label">Reports</Text>
            </ListBoxItem>
            <ListBoxItem id="settings" textValue="Settings">
              <Settings />
              <Text slot="label">Settings</Text>
            </ListBoxItem>
            <ListBoxItem id="admin" textValue="Admin (no access)" isDisabled>
              <Lock />
              <Text slot="label">Admin (no access)</Text>
            </ListBoxItem>
          </ListBox>
        </nav>
        <main className="app-main">
          {page === 'overview' && <Overview />}
          {page === 'reports' && <Reports />}
          {page === 'settings' && <SettingsView />}
        </main>
      </div>
      <MyToastRegion />
    </div>
  );
}
