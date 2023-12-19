export interface SheetRow {}

export class SheetInfo {
  rows: SheetRow[] = [];

  constructor() {}

  addRow(row: SheetRow) {
    this.rows.push(row);
  }

  getRows() {
    return this.rows;
  }

  getRow(index: number) {
    return this.rows[index];
  }
}
