


import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import _ from 'lodash';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'corona statastics';

  patientsData;
  patientsAllData;
  patientsRecoveredData;
  patientHptlData;
  patientDeathData;

  keys;
  stateData;
  // states=[ "Kerala", "Delhi", "Telangana", "Rajasthan", "Haryana", "Uttar Pradesh", "Ladakh", "Tamil Nadu", "Jammu and Kashmir", "Karnataka", "Maharashtra", "Punjab", "Andhra Pradesh", "Uttarakhand", "Odisha", "Puducherry", "West Bengal", "Chandigarh", "Chhattisgarh", "Gujarat", "Himachal Pradesh", "Madhya Pradesh" ]

  allState;
  allstatus;
  values;
  change;
  state_status;





  view: any[] = [600, 400];
  view2: any[] = [400, 300];

  singlepie = [

  ];

  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'States';
  showYAxisLabel = true;
  yAxisLabel = 'Count';
  timeline = true;

  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };

  // ngx table
  rows = [];
  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: 'name' }, { name: 'gender' }, { name: 'Company', sortable: false }];


  barchart = false;


  // data goes here
  public single = [];

  public multi = [

  ];

  clonePatientsAllData;
  clonePatientsData;
  barholding;
  alldateLine;

  data = [{ 'name': 'reportedcases', 'series': [] }, { 'name': 'recovered cases', 'series': [] }];
  linecartshow;

  ngOnInit() {
    this.barholding = 'state';
    this.linecartshow = false;


    this.change = false;
    this.patientApi.GeAllPatientscovid19().subscribe(data => {
      this.patientsAllData = data['data']['rawPatientData'];
      // this.patientsAllData = data;

      this.patientsData = this.patientsAllData.filter(
        patients => patients.reportedOn !== null);

      this.clonePatientsData = _.clone(this.patientsData);

      console.log(this.patientsData.length);

      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered.status === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered.status === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered.status === 'Deceased');

      this.allState = _.countBy(this.patientsData, 'state');
      // this.allstatus = _.countBy(this.patientsAllData, "status");

      const deathlegth = this.patientsRecoveredData.length;

      this.singlepie.push(
        {
          'name': 'Recovered',
          'value': deathlegth
        }
      );

      this.singlepie.push(
        {
          'name': 'Hospitalized',
          'value': this.patientHptlData.length
        }
      );
      this.singlepie.push(
        {
          'name': 'Deceased',
          'value': this.patientDeathData.length
        }
      );



      // const dat = _.filter(this.patientsData, ['status', 'Recovered']);
      // console.log(dat);

      console.log(this.allState);
      for (const [key, value] of Object.entries(this.allState)) {
        // console.log(`${key}: ${value}`);
        this.single.push({
          'name': key,
          'value': value
        });
      }

      for (const [key, value] of Object.entries(this.allState)) {

        // this.allstatus = _.countBy(this.patientsAllData, "status");
        const alldat = _.filter(this.patientsAllData, _.matches({ state: `${key}` }));

        const allMale = _.filter(alldat, _.matches({ gender: 'male' }));
        const allFemale = _.filter(alldat, _.matches({ gender: 'female' }));
        const allnull = _.filter(alldat, _.matches({ gender: null }));
        // const alldat = _.filter(this.patientsAllData, _.matches({
        //   'state': `${key}`
        //    'status': 'Recovered' }));

        //  console.log(alldat);

        this.multi.push({
          'name': `${key}`,
          'series': [
            {
              'name': 'Male',
              'value': allMale.length,
            },
            {
              'name': 'Female',
              'value': allFemale.length,
            },
            {
              'name': 'Null',
              'value': allnull.length,
            }
          ]
        });

      }





      // const datfind = _.find(this.patientsData, { 'status': 'Hospitalized' });
      // console.log(datfind);



      // const alldat = _.filter(this.patientsAllData, _.matches({ 'status': 'Recovered', 'state': 'Kerala' }));
      // console.log(alldat);

      // line chart start
      this.alldateLine = _.countBy(this.patientsData, 'reportedOn');
      console.log(this.alldateLine);


      for (const [key, value] of Object.entries(this.alldateLine)) {

        this.data[0].series.push( { 'name': key, 'value': value  } );
      }

      this.change = true;

      this.linecartshow = true;

    });

    this.rows = this.allState;
  }

  colorFun(x: any): string {
    console.log('colorFun: x:', x);
    // Not working because x is the name and not the value
    // return x < 1.5 ? 'red' : (x < 1.7 ? 'yellow' : 'green');
    // return x.value < 1.5 ? 'red' : (x.value < 1.7 ? 'yellow' : 'green');
    return 'green';
  }
  // onclick



  onChartClickTrigger(search, data) {
    this.linecartshow = false;

    console.log(this.barholding, 'this.barholding');
    if (this.barholding === 'city') {
      this.barholding = 'state';
      this.onReset();
    }

    if (this.barholding === 'state') {
      if (data) {
        this.patientsData = data.filter(
          patients => patients.state === search);
        console.log('inside data');
      } else {
        this.patientsData = this.patientsAllData.filter(
          patients => patients.state === search);
        console.log('no data');
      }

      console.log(this.patientsData.length);

      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered.status === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered.status === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered.status === 'Deceased');


      // this.allState = _.countBy(this.patientsAllData, "state);
      // this.allstatus = _.countBy(this.patientsAllData, "status");



      this.allState = _.countBy(this.patientsData, 'district');
      this.allstatus = _.countBy(this.patientsData, 'status');
      // this.allReported = _.countBy(this.patientsAllData, "reportedOn");

      this.barholding = 'district';


      for (const [key, value] of Object.entries(this.allState)) {

        console.log(key, value);
        // this.allstatus = _.countBy(this.patientsAllData, "status");
        const alldat = _.filter(this.patientsAllData, _.matches({ district: `${key}` }));

        const allMale = _.filter(alldat, _.matches({ gender: 'male' }));
        const allFemale = _.filter(alldat, _.matches({ gender: 'female' }));
        const allnull = _.filter(alldat, _.matches({ gender: null }));
        // const alldat = _.filter(this.patientsAllData, _.matches({
        //   'state': `${key}`
        //    'status': 'Recovered' }));

        //  console.log(alldat);

        this.multi.push({
          'name': `${key}`,
          'series': [
            {
              'name': 'Male',
              'value': allMale.length,
            },
            {
              'name': 'Female',
              'value': allFemale.length,
            },
            {
              'name': 'Null',
              'value': allnull.length,
            }
          ]
        });

      }
      // line chart start
      this.alldateLine = _.countBy(this.patientsData, 'reportedOn');

      for (const [key, value] of Object.entries(this.alldateLine)) {
        this.data[0].series.push(
          {
            'name': key,
            'value': value
          }
        );
      }
      console.log(this.alldateLine);
      this.linecartshow = true;

      console.log(this.linecartshow, 'linecartshow');
      // line chart end

    } else if (this.barholding === 'district') {

      this.patientsAllData = this.patientsAllData.filter(
        patients => (patients.district === search));

      this.patientsData = this.patientsAllData.filter(
        patients => patients.reportedOn !== null);

      console.log(this.patientsData.length);
      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered.status === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered.status === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered.status === 'Deceased');

      this.allState = _.countBy(this.patientsAllData, 'city');
      this.allstatus = _.countBy(this.patientsAllData, 'status');



      for (const [key, value] of Object.entries(this.allState)) {

        console.log(key, value);
        const alldat = _.filter(this.patientsAllData, _.matches({ city: `${key}` }));

        const allMale = _.filter(alldat, _.matches({ gender: 'male' }));
        const allFemale = _.filter(alldat, _.matches({ gender: 'female' }));
        const allnull = _.filter(alldat, _.matches({ gender: null }));

        this.multi.push({
          'name': `${key}`,
          'series': [
            { 'name': 'Male', 'value': allMale.length },
            { 'name': 'Female', 'value': allFemale.length },
            { 'name': 'Null', 'value': allnull.length, }
          ]
        });


        // this.multi = [...this.multi];
      }

      this.barholding = 'city';


      // line chart start
      this.linecartshow = false;
      this.alldateLine = _.countBy(this.patientsAllData, 'reportedOn');

      for (const [key, value] of Object.entries(this.alldateLine)) {
        this.data[0].series.push(
          {
            'name': key,
            'value': value
          }
        );
      }
      console.log(this.alldateLine);
      this.linecartshow = true;
      // line chart end

    }
    this.barchart = true;

  }

  onReset() {
    this.change = false;
    this.multi = [];
    this.data[0].series = [];
    this.patientApi.GeAllPatientscovid19().subscribe(data => {

      this.patientsAllData = data['data']['rawPatientData'];
      // console.log(this.patientsAllData);
      // this.patientsAllData = data;

      console.log('this.patientsAllData', this.patientsAllData.length);

      this.patientsData = this.patientsAllData.filter(
        patients => patients.reportedOn !== null);

      this.clonePatientsData = _.clone(this.patientsData);

      console.log(this.patientsData.length);
      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered.status === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered.status === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered.status === 'Deceased');


      this.allState = _.countBy(this.patientsData, 'state');
      this.allstatus = _.countBy(this.patientsData, 'status');



      for (const [key, value] of Object.entries(this.allState)) {

        const alldat = _.filter(this.patientsAllData, _.matches({ state: `${key}` }));

        const allMale = _.filter(alldat, _.matches({ gender: 'male' }));
        const allFemale = _.filter(alldat, _.matches({ gender: 'female' }));
        const allnull = _.filter(alldat, _.matches({ gender: null }));

        this.multi.push({
          'name': `${key}`,
          'series': [
            {
              'name': 'Male',
              'value': allMale.length,
            },
            {
              'name': 'Female',
              'value': allFemale.length,
            },
            {
              'name': 'Null',
              'value': allnull.length,
            }
          ]
        });

      }

      this.change = true;
      this.barholding = 'state';


      // line chart start
      this.linecartshow = false;
      this.alldateLine = _.countBy(this.patientsAllData, 'reportedOn');

      for (const [key, value] of Object.entries(this.alldateLine)) {
        this.data[0].series.push(
          {
            'name': key,
            'value': value
          }
        );
      }

      this.linecartshow = true;
      // line chart end

    });
  }










  onSelect(e) {
    console.log(e, 'onclick');
    this.multi = [];
    this.data[0].series = [];
    this.linecartshow = false;
    this.onChartClickTrigger(e.series, '');
  }

  onitemSelect(e){
    console.log(e, 'onclick');
    this.multi = [];
    this.data[0].series = [];
    this.linecartshow = false;
    this.onChartClickTrigger(e, '');
  }

  // onTreeSelect(e) {
  //   console.log(e, 'onclick', e.name);
  //   this.multi = [];
  //   this.data[0].series = [];
  //   this.barholding = "state";
  //   this.linecartshow = false;
  //   this.onChartClickTrigger(e.name, this.clonePatientsData);
  //   this.barchart = false;
  // }

  show(e) {
    console.log(e);
    this.multi = [];
    this.data[0].series = [];
    this.barholding = 'state';
    this.linecartshow = false;
    this.onChartClickTrigger(e, this.clonePatientsData);
    this.barchart = true;
  }

  constructor(private patientApi: ApiService, ) { }

}
