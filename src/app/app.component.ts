import { Component } from '@angular/core';
import { ApiService } from './api.service';
import _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'corona statastics';






  constructor(private patientApi: ApiService, ) { }

}
