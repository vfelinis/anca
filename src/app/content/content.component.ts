import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent implements OnInit {

  private url: UrlSegment;
  private subscription: Subscription;
  constructor(private activateRoute: ActivatedRoute){       
      this.subscription = activateRoute.url.subscribe(urls => this.url = urls[0]);
  }

  ngOnInit() {
  }
  
  ngOnDestroy(){
      this.subscription.unsubscribe();
  }

}
