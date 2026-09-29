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

export type PageId = 'overview' | 'reports' | 'settings';

export interface UsageRow {
  id: number;
  app: string;
  team: string;
  seats: number;
  hours: number;
  lastUsed: string;
}

export const usageRows: UsageRow[] = [
  {id: 1, app: 'Photoshop', team: 'Brand', seats: 42, hours: 1284, lastUsed: '2026-09-28'},
  {id: 2, app: 'Illustrator', team: 'Brand', seats: 38, hours: 902, lastUsed: '2026-09-27'},
  {id: 3, app: 'InDesign', team: 'Publishing', seats: 21, hours: 640, lastUsed: '2026-09-26'},
  {id: 4, app: 'Premiere Pro', team: 'Video', seats: 29, hours: 1510, lastUsed: '2026-09-28'},
  {id: 5, app: 'After Effects', team: 'Video', seats: 18, hours: 876, lastUsed: '2026-09-25'},
  {id: 6, app: 'Adobe XD', team: 'Product', seats: 14, hours: 320, lastUsed: '2026-09-20'},
  {id: 7, app: 'Acrobat', team: 'Legal', seats: 56, hours: 410, lastUsed: '2026-09-28'},
  {id: 8, app: 'Lightroom', team: 'Brand', seats: 12, hours: 198, lastUsed: '2026-09-22'}
];

export const overviewStats = [
  {
    id: 'seats',
    label: 'Active seats',
    value: String(usageRows.reduce((sum, row) => sum + row.seats, 0))
  },
  {
    id: 'hours',
    label: 'Hours this month',
    value: usageRows.reduce((sum, row) => sum + row.hours, 0).toLocaleString('en-US')
  },
  {id: 'apps', label: 'Apps in use', value: String(usageRows.length)},
  {
    id: 'teams',
    label: 'Teams',
    value: String(new Set(usageRows.map(row => row.team)).size)
  }
];

export const dateRanges = [
  {id: '7d', name: 'Last 7 days'},
  {id: '30d', name: 'Last 30 days'},
  {id: '90d', name: 'Last 90 days'},
  {id: 'ytd', name: 'Year to date'}
] as const;

export type DateRangeId = (typeof dateRanges)[number]['id'];

export const adoptionByRange: Record<
  DateRangeId,
  {activeUsers: number; licenseUtilization: string; newSeats: number}
> = {
  '7d': {activeUsers: 182, licenseUtilization: '71%', newSeats: 6},
  '30d': {activeUsers: 214, licenseUtilization: '78%', newSeats: 19},
  '90d': {activeUsers: 241, licenseUtilization: '84%', newSeats: 31},
  ytd: {activeUsers: 256, licenseUtilization: '89%', newSeats: 47}
};

export interface TeamReportRow {
  id: string;
  team: string;
  app: string;
  adoption: string;
  hours: number;
}

export const designTeamReports: TeamReportRow[] = [
  {id: 'brand-ps', team: 'Brand', app: 'Photoshop', adoption: '92%', hours: 1284},
  {id: 'brand-ai', team: 'Brand', app: 'Illustrator', adoption: '88%', hours: 902},
  {id: 'pub-id', team: 'Publishing', app: 'InDesign', adoption: '74%', hours: 640}
];

export const videoTeamReports: TeamReportRow[] = [
  {id: 'video-pr', team: 'Video', app: 'Premiere Pro', adoption: '81%', hours: 1510},
  {id: 'video-ae', team: 'Video', app: 'After Effects', adoption: '69%', hours: 876}
];
