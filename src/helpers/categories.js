export function countCategories(cats, data){

  const categoryData = {
    'totals': Object.fromEntries([
        'totalGood',
        'totalSome',
        'totalNot',
        'totalOver',
        'totalNulls',
        'totalAlerts',
        'totalAdvisory',
        'totalInterventions'].map(e => [e, 0])
    ),
    'categories': Object.fromEntries(cats.map(c => c.categoryCode).map(cc => [cc, {'good': 0, 'some': 0, 'not': 0, 'over': 0, 'count': 0 }]))
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
          categoryData['totals'].totalInterventions++;
        }
        selected_type = data[index].selected_type;
        if(selected_type === 'alert' || selected_type === 'both'){
          categoryData['totals'].totalAlerts++;
        }
        else if(selected_type === 'advisory'){
           categoryData['totals'].totalAdvisory++;
        }
        if(mitigation === 'Null'){
          categoryData['totals'].totalNulls++;
        }
        else {
          switch(name){
            case "Drug Age":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][0].drugAge.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][0].drugAge.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][0].drugAge.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][0].drugAge.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][0].drugAge.count++;
              }

              break;
            case "Drug Dose":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][1].drugDose.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][1].drugDose.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][1].drugDose.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][1].drugDose.over++;
                categoryData['totals'].totalOver++;
              }
              if(mitigation !== 'Null'){
                categoryData['categories'][1].drugDose.count++;
              }

              break;
            case "Drug Interaction":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][2].drugInteraction.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][2].drugInteraction.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][2].drugInteraction.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][2].drugInteraction.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][2].drugInteraction.count++;
              }

              break;
            case "Drug Allergy":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][3].drugAllergy.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][3].drugAllergy.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][3].drugAllergy.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][3].drugAllergy.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][3].drugAllergy.count++;
              }
              break;
            case "Drug Duplication":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][4].drugDuplication.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][4].drugDuplication.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][4].drugDuplication.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][4].drugDuplication.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][4].drugDuplication.count++;
              }
              break;
            case "Drug Disease":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][5].drugDisease.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][5].drugDisease.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][5].drugDisease.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][5].drugDisease.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][5].drugDisease.count++;
              }
              break;
            case "Drug Omissions":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][6].drugOmissions.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][6].drugOmissions.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][6].drugOmissions.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][6].drugOmissions.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][6].drugOmissions.count++;
              }
              break;
            case "Theraputic Duplication":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][7].theraputicDuplication.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][7].theraputicDuplication.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][7].theraputicDuplication.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][7].theraputicDuplication.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][7].theraputicDuplication.count++;
              }
              break;
            case "Drug Lab":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][8].drugLab.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][8].drugLab.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][8].drugLab.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][8].drugLab.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][8].drugLab.count++;
              }
              break;
            case "Drug Brand":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][9].drugBrand.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][9].drugBrand.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][9].drugBrand.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][9].drugBrand.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][9].drugBrand.count++;
              }
              break;
            case "Drug Route":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][10].drugRoute.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][10].drugRoute.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][10].drugRoute.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][10].drugRoute.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][10].drugRoute.count++;
              }
              break;
            case "Drug Overdose":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][11].drugOverdose.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][11].drugOverdose.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][11].drugOverdose.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][11].drugOverdose.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][11].drugOverdose.count++;
              }
              break;
            case "Drug Frequency":
              if(mitigation === 'Good Mitigation/Pass'){
                categoryData['categories'][12].drugFrequency.good++;
                categoryData['totals'].totalGood++;
              }
              else if (mitigation === 'Some Mitigation'){
                categoryData['categories'][12].drugFrequency.some++;
                categoryData['totals'].totalSome++;
              }
              else if (mitigation === 'No Mitigation/Fail'){
                categoryData['categories'][12].drugFrequency.not++;
                categoryData['totals'].totalNot++;
              }
              else if (mitigation === 'Over Mitigation'){
                categoryData['categories'][12].drugFrequency.over++;
                categoryData['totals'].totalOver++;
              }

              if(mitigation !== 'Null'){
                categoryData['categories'][12].drugFrequency.count++;
              }
              break;
          }
        }
      }
    }

   return categoryData;
  }

