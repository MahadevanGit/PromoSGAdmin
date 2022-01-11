import { CdkHeaderCellDef } from '@angular/cdk/table';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatMenuListItem } from 'src/app/shared/models/common';


// MyNote: @Injectable for use this component method in side another component
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'menu-icon-dd',
  templateUrl: './menu-icon-dd.component.html',
  styleUrls: ['./menu-icon-dd.component.scss']
})
export class MenuIconDdComponent implements OnInit {

  @Input('menuListItems') menuListItems: MatMenuListItem[];
  @Input('defaultSelection') defaultSelection: MatMenuListItem;
  @Output() onSelect = new EventEmitter<any>();

  currentMenuText: string;
  currentMenuIcon: string;
  constructor() { }

  ngOnInit(): void {
    this.clickMenuItem(this.defaultSelection ? this.defaultSelection : null);
  }

  public changeView(menuListItem: MatMenuListItem) {
    this.clickMenuItem(menuListItem);
    this.onMenuSelectionChange(menuListItem);
  }


  public clickMenuItem(menuItem: MatMenuListItem) {
    this.onMenuSelectionChange(menuItem);
    if (menuItem) {
      this.currentMenuText = menuItem.menuLinkText;
      this.currentMenuIcon = menuItem.menuIcon;
      this.onChange(menuItem.menuLinkKey);
    }
    else {
      this.currentMenuText = 'Please select the menu items';
      this.currentMenuIcon = 'arrow_left';
    }
  }

  onMenuSelectionChange(menuItem: MatMenuListItem) {
    this.menuListItems && menuItem && this.menuListItems.forEach((m) => {
      if (m.menuLinkText == menuItem.menuLinkText)
        m.selected = true;
      else
        m.selected = false;
    })
  }

  public getSelectedMenu(data): void {
    this.onSelect.emit(data);
  }

  onChange(menuLinkKey) {
    this.getSelectedMenu(menuLinkKey);
  }

}
