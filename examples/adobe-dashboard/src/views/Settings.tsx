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
import {Button} from '../components/Button';
import {Checkbox} from '../components/Checkbox';
import {Form} from '../components/Form';
import {Radio, RadioGroup} from '../components/RadioGroup';
import {Switch} from '../components/Switch';
import {ListBox, ListBoxItem} from '../components/ListBox';
import {queue} from '../components/Toast';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [theme, setTheme] = useState('system');
  const [shareUsage, setShareUsage] = useState(false);

  return (
    <section className="page">
      <h2>Settings</h2>
      <p className="page-lede">Notification and privacy preferences for this dashboard.</p>
      <Form
        className="react-aria-Form settings-form"
        onSubmit={event => {
          event.preventDefault();
          setSaved(true);
          queue.add({
            title: 'Saved',
            description: 'Your dashboard preferences were updated.'
          });
        }}>
        <Switch isSelected={emailUpdates} onChange={setEmailUpdates}>
          Email product updates
        </Switch>
        <RadioGroup label="Theme" value={theme} onChange={setTheme}>
          <Radio value="system">System</Radio>
          <Radio value="light">Light</Radio>
          <Radio value="dark">Dark</Radio>
        </RadioGroup>
        <Checkbox isSelected={shareUsage} onChange={setShareUsage}>
          Share anonymous usage data
        </Checkbox>
        <Button type="submit">{saved ? 'Saved' : 'Save'}</Button>
      </Form>
      <div className="settings-form">
        <h3>Archived workspaces</h3>
        <p className="page-lede">Archived workspaces are read-only.</p>
        <ListBox
          aria-label="Archived workspaces"
          selectionMode="single"
          isDisabled>
          <ListBoxItem id="brand-2023" textValue="Brand 2023">
            Brand 2023
          </ListBoxItem>
          <ListBoxItem id="summit-2024" textValue="Summit 2024">
            Summit 2024
          </ListBoxItem>
          <ListBoxItem id="legacy-assets" textValue="Legacy Assets">
            Legacy Assets
          </ListBoxItem>
        </ListBox>
      </div>
    </section>
  );
}
