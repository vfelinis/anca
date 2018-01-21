import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Page } from '../../../store/Page';
import { PageService } from '../../../services/page/page.service';

@Component({
  selector: 'app-page-creation',
  templateUrl: './page-creation.component.html',
  styleUrls: ['./page-creation.component.less']
})
export class PageCreationComponent implements OnInit {
  public createForm: FormGroup;
  public pageName: FormControl;
  public pageUrl: FormControl;
  public pageOrderIndex: FormControl;
  public pageActive: FormControl;
  constructor(
    private dialogRef: MatDialogRef<PageCreationComponent>,
    private pageService: PageService
  ) {
    this.pageName = new FormControl('', [Validators.required]);
    this.pageUrl = new FormControl('', [Validators.pattern('[a-z0-9]+'), Validators.required]);
    this.pageOrderIndex = new FormControl(1, [Validators.required]);
    this.pageActive = new FormControl(false);
    this.createForm = new FormGroup({
      pageName: this.pageName,
      pageUrl: this.pageUrl,
      pageOrderIndex: this.pageOrderIndex,
      pageActive: this.pageActive
    });
  }

  ngOnInit() {
  }

  getPageNameMessage() {
    return this.pageName.hasError('required') ? 'You must enter a value' : '';
  }

  getPageUrlMessage() {
    return this.pageUrl.hasError('pattern') || this.pageUrl.hasError('required')
            ? 'You must enter lowercase letters or numbers'
            : '';
  }

  getPageOrderIndexMessage() {
    return this.pageOrderIndex.hasError('required') ? 'You must enter a value' : '';
  }

  submit() {
    if (this.createForm.status === 'VALID') {
      const page: Page = {
        id: 0,
        name: this.pageName.value,
        url: this.pageUrl.value,
        orderIndex: Math.round(this.pageOrderIndex.value),
        active: this.pageActive.value,
        dateCreated: new Date().toISOString()
      };
      this.pageService.create(page);
      this.dialogRef.close();
    }
  }
}
