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
import type {Key} from 'react-aria-components/Select';
import {Button} from '../components/Button';
import {Dialog, DialogTrigger, Heading} from '../components/Dialog';
import {Form} from '../components/Form';
import {Modal} from '../components/Modal';
import {Select, SelectItem} from '../components/Select';
import {Cell, Column, Row, Table, TableBody, TableHeader} from '../components/Table';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '../components/Tabs';
import {TextField} from '../components/TextField';
import {
  adoptionByRange,
  type DateRangeId,
  dateRanges,
  designTeamReports,
  type TeamReportRow,
  videoTeamReports
} from '../data';

function isDateRangeId(value: Key | null): value is DateRangeId {
  return value === '7d' || value === '30d' || value === '90d' || value === 'ytd';
}

function TeamTable({
  caption,
  rows
}: {
  caption: string;
  rows: TeamReportRow[];
}) {
  return (
    <Table aria-label={caption}>
      <TableHeader>
        <Column id="team" isRowHeader>
          Team
        </Column>
        <Column id="app">App</Column>
        <Column id="adoption">Adoption</Column>
        <Column id="hours">Hours</Column>
      </TableHeader>
      <TableBody items={rows}>
        {row => (
          <Row>
            <Cell>{row.team}</Cell>
            <Cell>{row.app}</Cell>
            <Cell>{row.adoption}</Cell>
            <Cell>{row.hours.toLocaleString('en-US')}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

export default function Reports() {
  const [range, setRange] = useState<DateRangeId>('30d');
  const adoption = adoptionByRange[range];

  return (
    <section className="page">
      <div className="page-toolbar">
        <div>
          <h2>Reports</h2>
          <p className="page-lede">License adoption and usage by team.</p>
        </div>
        <div className="page-toolbar-actions">
          <Select
            label="Date range"
            value={range}
            onChange={value => {
              if (isDateRangeId(value)) {
                setRange(value);
              }
            }}>
            {dateRanges.map(item => (
              <SelectItem key={item.id} id={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <DialogTrigger>
            <Button>Export report</Button>
            <Modal>
              <Dialog>
                {({close}) => (
                  <Form
                    onSubmit={event => {
                      event.preventDefault();
                      close();
                    }}>
                    <Heading slot="title">Export report</Heading>
                    <TextField
                      label="File name"
                      defaultValue="creative-cloud-report.csv"
                      isRequired
                    />
                    <div className="dialog-actions">
                      <Button variant="secondary" type="button" onPress={close}>
                        Cancel
                      </Button>
                      <Button type="submit">Export</Button>
                    </div>
                  </Form>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>
        </div>
      </div>
      <Tabs>
        <TabList aria-label="Report type">
          <Tab id="adoption">Adoption</Tab>
          <Tab id="by-team">By team</Tab>
        </TabList>
        <TabPanels>
          <TabPanel id="adoption">
            <ul className="stat-grid">
              <li className="stat-card">
                <p className="stat-label">Active users</p>
                <p className="stat-value">{adoption.activeUsers}</p>
              </li>
              <li className="stat-card">
                <p className="stat-label">License utilization</p>
                <p className="stat-value">{adoption.licenseUtilization}</p>
              </li>
              <li className="stat-card">
                <p className="stat-label">New seats</p>
                <p className="stat-value">{adoption.newSeats}</p>
              </li>
            </ul>
          </TabPanel>
          <TabPanel id="by-team">
            <Tabs>
              <TabList aria-label="Team category">
                <Tab id="design">Design</Tab>
                <Tab id="video">Video</Tab>
              </TabList>
              <TabPanels>
                <TabPanel id="design">
                  <TeamTable caption="Design team usage" rows={designTeamReports} />
                </TabPanel>
                <TabPanel id="video">
                  <TeamTable caption="Video team usage" rows={videoTeamReports} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>
  );
}
