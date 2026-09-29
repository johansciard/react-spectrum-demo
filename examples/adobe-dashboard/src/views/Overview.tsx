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

import {useMemo, useState} from 'react';
import type {SortDescriptor} from 'react-aria-components/Table';
import {SearchField} from '../components/SearchField';
import {Cell, Column, Row, Table, TableBody, TableHeader} from '../components/Table';
import {overviewStats, type UsageRow, usageRows} from '../data';

function compareRows(a: UsageRow, b: UsageRow, column: keyof UsageRow) {
  const left = a[column];
  const right = b[column];
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  return String(left).localeCompare(String(right), 'en', {numeric: true});
}

export default function Overview() {
  const [query, setQuery] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'app',
    direction: 'ascending'
  });

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? usageRows.filter(
          row =>
            row.app.toLowerCase().includes(needle) || row.team.toLowerCase().includes(needle)
        )
      : usageRows.slice();

    const column = (sortDescriptor.column ?? 'app') as keyof UsageRow;
    filtered.sort((a, b) => compareRows(a, b, column));
    if (sortDescriptor.direction === 'descending') {
      filtered.reverse();
    }
    return filtered;
  }, [query, sortDescriptor]);

  return (
    <section className="page">
      <h2>Overview</h2>
      <p className="page-lede">Creative Cloud usage across Adobe teams this month.</p>
      <ul className="stat-grid">
        {overviewStats.map(stat => (
          <li key={stat.id} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </li>
        ))}
      </ul>
      <div className="table-toolbar">
        <SearchField
          label="Search"
          placeholder="Filter by app or team"
          value={query}
          onChange={setQuery}
        />
      </div>
      <Table
        aria-label="Creative Cloud usage"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}>
        <TableHeader>
          <Column id="app" isRowHeader allowsSorting>
            App
          </Column>
          <Column id="team" allowsSorting>
            Team
          </Column>
          <Column id="seats" allowsSorting>
            Seats
          </Column>
          <Column id="hours" allowsSorting>
            Hours
          </Column>
          <Column id="lastUsed" allowsSorting>
            Last used
          </Column>
        </TableHeader>
        <TableBody items={rows} renderEmptyState={() => 'No apps match this search.'}>
          {row => (
            <Row>
              <Cell>{row.app}</Cell>
              <Cell>{row.team}</Cell>
              <Cell>{row.seats}</Cell>
              <Cell>{row.hours.toLocaleString('en-US')}</Cell>
              <Cell>{row.lastUsed}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
