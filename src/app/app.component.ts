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
  view2: any[] = [500, 300];

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

  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company', sortable: false }];


  barchart = false;


  // data goes here
  public single = [];

  public multi = [

  ];

  clonePatientsAllData;
  clonePatientsData;
  barholding;

  ngOnInit() {
    this.barholding = 'state';

    this.change = false;
    this.patientApi.GeAllPatients().subscribe(data => {

      this.patientsAllData = data;

      this.patientsData = this.patientsAllData.filter(
        patients => patients['Date Announced'] !== null);

      this.clonePatientsData = _.clone(this.patientsData);

      console.log(this.patientsData.length);

      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Deceased');

      this.allState = _.countBy(this.patientsData, "Detected State");
      // this.allstatus = _.countBy(this.patientsAllData, "Current Status");

      const deathlegth = this.patientsRecoveredData.length;

      this.singlepie.push(
        {
          "name": "Recovered",
          "value": deathlegth
        }
      );

      this.singlepie.push(
        {
          "name": "Hospitalized",
          "value": this.patientHptlData.length
        }
      );
      this.singlepie.push(
        {
          "name": "Deceased",
          "value": this.patientDeathData.length
        }
      );



      const dat = _.filter(this.patientsData, ['Current Status', 'Recovered']);
      console.log(dat);

      console.log(this.allState);
      for (let [key, value] of Object.entries(this.allState)) {
        // console.log(`${key}: ${value}`);
        this.single.push({
          "name": key,
          "value": value
        });
      }

      for (let [key, value] of Object.entries(this.allState)) {

        // this.allstatus = _.countBy(this.patientsAllData, "Current Status");
        const alldat = _.filter(this.patientsAllData, _.matches({ 'Detected State': `${key}` }));

        const allMale = _.filter(alldat, _.matches({ 'Gender': "M" }));
        const allFemale = _.filter(alldat, _.matches({ 'Gender': "F" }));
        const allnull = _.filter(alldat, _.matches({ 'Gender': null }));
        // const alldat = _.filter(this.patientsAllData, _.matches({
        //   'Detected State': `${key}`
        //    'Current Status': 'Recovered' }));

        //  console.log(alldat);

        this.multi.push({
          "name": `${key}`,
          "series": [
            {
              "name": "Male",
              "value": allMale.length,
            },
            {
              "name": "Female",
              "value": allFemale.length,
            },
            {
              "name": "Null",
              "value": allnull.length,
            }
          ]
        });

      }



      this.change = true;


      const datfind = _.find(this.patientsData, { 'Current Status': 'Hospitalized' });
      console.log(datfind);



      const alldat = _.filter(this.patientsAllData, _.matches({ 'Current Status': 'Recovered', 'Detected State': 'Kerala' }));
      console.log(alldat);

    });

    this.rows = this.allState;

  }

  colorFun(x: any): string {
    console.log('colorFun: x:', x);
    //Not working because x is the name and not the value
    // return x < 1.5 ? 'red' : (x < 1.7 ? 'yellow' : 'green');
    // return x.value < 1.5 ? 'red' : (x.value < 1.7 ? 'yellow' : 'green');
    return 'green';
  }
  // onclick



  onChartClickTrigger(search, data) {

    console.log(this.barholding, 'this.barholding');
    if (this.barholding === 'city') {
      this.barholding = 'state';
      this.onReset();
    }

    if (this.barholding === 'state') {
      if (data ) {

        this.patientsData = this.clonePatientsData.filter(
          patients => patients['Detected State'] === search);
          console.log('inside data');
      } else {
        this.patientsData = this.patientsAllData.filter(
          patients => patients['Detected State'] === search);
          console.log('no data');
      }



      console.log(this.patientsData.length);

      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Deceased');


      // this.allState = _.countBy(this.patientsAllData, "Detected State");
      // this.allstatus = _.countBy(this.patientsAllData, "Current Status");



      this.allState = _.countBy(this.patientsData, "Detected District");
      this.allstatus = _.countBy(this.patientsData, "Current Status");
      // this.allReported = _.countBy(this.patientsAllData, "reportedOn");

      this.barholding = "district";


      for (let [key, value] of Object.entries(this.allState)) {

        console.log(key, value);
        // this.allstatus = _.countBy(this.patientsAllData, "Current Status");
        const alldat = _.filter(this.patientsAllData, _.matches({ 'Detected District': `${key}` }));

        const allMale = _.filter(alldat, _.matches({ 'Gender': "M" }));
        const allFemale = _.filter(alldat, _.matches({ 'Gender': "F" }));
        const allnull = _.filter(alldat, _.matches({ 'Gender': null }));
        // const alldat = _.filter(this.patientsAllData, _.matches({
        //   'Detected State': `${key}`
        //    'Current Status': 'Recovered' }));

        //  console.log(alldat);

        this.multi.push({
          "name": `${key}`,
          "series": [
            {
              "name": "Male",
              "value": allMale.length,
            },
            {
              "name": "Female",
              "value": allFemale.length,
            },
            {
              "name": "Null",
              "value": allnull.length,
            }
          ]
        });

      }


    } else if (this.barholding === 'district') {

      this.patientsAllData = this.patientsAllData.filter(
        patients => (patients['Detected District'] === search));

      this.patientsData = this.patientsAllData.filter(
        patients => patients['Date Announced'] !== null);

      console.log(this.patientsData.length);
      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Deceased');

      this.allState = _.countBy(this.patientsAllData, "Detected City");
      this.allstatus = _.countBy(this.patientsAllData, "Current Status");



      for (let [key, value] of Object.entries(this.allState)) {

        console.log(key, value);
        // this.allstatus = _.countBy(this.patientsAllData, "Current Status");
        const alldat = _.filter(this.patientsAllData, _.matches({ 'Detected City': `${key}` }));

        const allMale = _.filter(alldat, _.matches({ 'Gender': "M" }));
        const allFemale = _.filter(alldat, _.matches({ 'Gender': "F" }));
        const allnull = _.filter(alldat, _.matches({ 'Gender': null }));
        // const alldat = _.filter(this.patientsAllData, _.matches({
        //   'Detected State': `${key}`
        //    'Current Status': 'Recovered' }));

        //  console.log(alldat);

        this.multi.push({
          "name": `${key}`,
          "series": [
            {
              "name": "Male",
              "value": allMale.length,
            },
            {
              "name": "Female",
              "value": allFemale.length,
            },
            {
              "name": "Null",
              "value": allnull.length,
            }
          ]
        });

      }

      this.barholding = "city";
    }
    this.barchart = true;

  }

  onReset() {
    this.change = false;
    this.multi = [];

    this.patientApi.GeAllPatients().subscribe(data => {

      // this.patientsAllData = data["data"]["rawPatientData"];
      // console.log(this.patientsAllData);
      this.patientsAllData = data;

      console.log('this.patientsAllData', this.patientsAllData.length);

      this.patientsData = this.patientsAllData.filter(
        patients => patients['Date Announced'] !== null);

      this.clonePatientsData = _.clone(this.patientsData);

      console.log(this.patientsData.length);
      this.patientsRecoveredData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Recovered');

      this.patientHptlData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Hospitalized');

      this.patientDeathData = this.patientsData.filter(
        recovered => recovered['Current Status'] === 'Deceased');


      this.allState = _.countBy(this.patientsData, "Detected State");
      this.allstatus = _.countBy(this.patientsData, "Current Status");



      for (let [key, value] of Object.entries(this.allState)) {

        // this.allstatus = _.countBy(this.patientsAllData, "Current Status");
        const alldat = _.filter(this.patientsAllData, _.matches({ 'Detected State': `${key}` }));

        const allMale = _.filter(alldat, _.matches({ 'Gender': "M" }));
        const allFemale = _.filter(alldat, _.matches({ 'Gender': "F" }));
        const allnull = _.filter(alldat, _.matches({ 'Gender': null }));
        // const alldat = _.filter(this.patientsAllData, _.matches({
        //   'Detected State': `${key}`
        //    'Current Status': 'Recovered' }));

        //  console.log(alldat);

        this.multi.push({
          "name": `${key}`,
          "series": [
            {
              "name": "Male",
              "value": allMale.length,
            },
            {
              "name": "Female",
              "value": allFemale.length,
            },
            {
              "name": "Null",
              "value": allnull.length,
            }
          ]
        });

      }

      this.change = true;
      this.barholding = "state";

    });
  }






  onDivClick(state) {

    console.log("DIV is clicked!", state);
    this.stateData = this.patientsData.filter(
      statedata => statedata['Detected State'] === state);
    console.log(this.stateData);
    this.state_status = _.countBy(this.stateData, "Current Status");

  }








  onSelect(e) {
    console.log(e, 'onclick');
    this.multi = [];

    this.onChartClickTrigger(e.series, '');
  }

  onTreeSelect(e) {
    console.log(e, 'onclick', e.name);
    this.multi = [];
    this.barholding = "state";
    this.onChartClickTrigger(e.name, this.clonePatientsData);
    this.barchart = false;

  }

  show(e) {
    console.log(e);
    this.multi = [];
    this.barholding = "state";
    this.onChartClickTrigger(e, this.clonePatientsData);
    this.barchart = true;
  }

  constructor(private patientApi: ApiService, ) { }

}
