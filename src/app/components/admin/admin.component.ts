import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  navLinks: any[];
  constructor() {
    this.navLinks = [
      { label: 'Configuration', link: 'configuration' },
      { label: 'Pages', link: 'pages' },
      { label: 'Localization', link: 'localization' }
    ];
  }

  ngOnInit() {
  }
}
