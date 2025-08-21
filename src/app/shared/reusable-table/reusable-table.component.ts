import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reusable-table',
  imports: [MatPaginatorModule, MatTableModule, MatButtonModule, CommonModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.css'
})
export class ReusableTableComponent {
  @Input() columns: { key: string; header: string; cell?: (element: any) => string }[] = [];
  @Input() dataSource: any[] = [];
  @Input() totalLength = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() pageIndex = 0;
  @Output() actionClick = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tableDataSource = new MatTableDataSource<any>();
  displayedColumnKeys: string[] = [];
  ngOnInit(): void {
    this.displayedColumnKeys = this.columns.map(col => col.key);
    this.tableDataSource.data = this.dataSource;
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnChanges(): void {
    
    this.tableDataSource = new MatTableDataSource(this.dataSource); 
  console.log('Data source changed:', this.dataSource); 

    this.tableDataSource.data = this.dataSource;
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onActionClick(row: any) {
    this.actionClick.emit(row);
  }
}


