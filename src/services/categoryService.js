export const categoryService = {
  countCategories
}

function countCategories(data){

  const dataToReturn = {
    "totals":
      {
        "totalGood": 0,
        "totalSome": 0,
        "totalNot": 0,
        "totalOver": 0,
        "totalAlerts": 0,
        "totalNulls": 0,
        "totalInterventions": 0
      },
    "categories": [
      {
        "drugAge":{
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugDose": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugInteraction": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugAllergy":{
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugDuplication": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugDisease": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugOmissions": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "theraputicDuplication": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugLab": {
           "good": 0,
           "some": 0,
           "not": 0,
           "over": 0,
           "count": 0
        }
      },
      {
        "drugBrand": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugRoute": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugOverdose": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      },
      {
        "drugFrequency": {
          "good": 0,
          "some": 0,
          "not": 0,
          "over": 0,
          "count": 0
        }
      }
    ]
  };

  let name = '';
  let mitigation = '';
  let outcome = '';
  let selected_type = '';

  for(let index in data){
      if(data.hasOwnProperty(index)){
        name = data[index].categoryName;
        mitigation = data[index].mitigation;
        outcome = data[index].outcome;

        if(outcome === 'intervention'){
          dataToReturn['totals'].totalInterventions++;
        }
        selected_type = data[index].selected_type;
        if(selected_type === 'alert'){
          dataToReturn['totals'].totalAlerts++;
        }
        if(mitigation === 'Null'){
          dataToReturn['totals'].totalNulls++;
        }
        else {
          switch(name){
            case "Drug Age":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][0].drugAge.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][0].drugAge.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][0].drugAge.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][0].drugAge.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][0].drugAge.count++;
              }

              break;
            case "Drug Dose":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][1].drugDose.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][1].drugDose.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][1].drugDose.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][1].drugDose.over++;
                dataToReturn['totals'].totalOver++;
              }
              if(mitigation !== 'Null'){
                dataToReturn['categories'][1].drugDose.count++;
              }

              break;
            case "Drug Interaction":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][2].drugInteraction.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][2].drugInteraction.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][2].drugInteraction.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][2].drugInteraction.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][2].drugInteraction.count++;
              }

              break;
            case "Drug Allergy":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][3].drugAllergy.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][3].drugAllergy.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][3].drugAllergy.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][3].drugAllergy.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][3].drugAllergy.count++;
              }
              break;
            case "Drug Duplication":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][4].drugDuplication.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][4].drugDuplication.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][4].drugDuplication.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][4].drugDuplication.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][4].drugDuplication.count++;
              }
              break;
            case "Drug Disease":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][5].drugDisease.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][5].drugDisease.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][5].drugDisease.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][5].drugDisease.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][5].drugDisease.count++;
              }
              break;
            case "Drug Omissions":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][6].drugOmissions.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][6].drugOmissions.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][6].drugOmissions.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][6].drugOmissions.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][6].drugOmissions.count++;
              }
              break;
            case "Theraputic Duplication":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][7].theraputicDuplication.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][7].theraputicDuplication.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][7].theraputicDuplication.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][7].theraputicDuplication.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][7].theraputicDuplication.count++;
              }
              break;
            case "Drug Lab":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][8].drugLab.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][8].drugLab.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][8].drugLab.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][8].drugLab.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][8].drugLab.count++;
              }
              break;
            case "Drug Brand":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][9].drugBrand.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][9].drugBrand.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][9].drugBrand.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][9].drugBrand.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][9].drugBrand.count++;
              }
              break;
            case "Drug Route":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][10].drugRoute.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][10].drugRoute.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][10].drugRoute.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][10].drugRoute.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][10].drugRoute.count++;
              }
              break;
            case "Drug Overdose":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][11].drugOverdose.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][11].drugOverdose.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][11].drugOverdose.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][11].drugOverdose.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][11].drugOverdose.count++;
              }
              break;
            case "Drug Frequency":
              if(mitigation === 'Good Mitigation/Pass'){
                dataToReturn['categories'][12].drugFrequency.good++;
                dataToReturn['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                dataToReturn['categories'][12].drugFrequency.some++;
                dataToReturn['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                dataToReturn['categories'][12].drugFrequency.not++;
                dataToReturn['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                dataToReturn['categories'][12].drugFrequency.over++;
                dataToReturn['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                dataToReturn['categories'][12].drugFrequency.count++;
              }
              break;
          }
        }
      }
    }

   return dataToReturn;
  }

