export const stackedChartService = {
  createStackedChartData
}


function createStackedChartData(jsondata) {

  const chartCategoryData = [{
    'category': 'Drug Age',
    'good': calcNum(jsondata['categories'][0].drugAge.good, jsondata['categories'][0].drugAge.count),
    'some': calcNum(jsondata['categories'][0].drugAge.some, jsondata['categories'][0].drugAge.count),
    'not': calcNum(jsondata['categories'][0].drugAge.not, jsondata['categories'][0].drugAge.count),
    'over': calcNum(jsondata['categories'][0].drugAge.over, jsondata['categories'][0].drugAge.count)
  },
  {
    'category': 'Drug Dose',
    'good': calcNum(jsondata['categories'][1].drugDose.good, jsondata['categories'][1].drugDose.count),
    'some': calcNum(jsondata['categories'][1].drugDose.some, jsondata['categories'][1].drugDose.count),
    'not': calcNum(jsondata['categories'][1].drugDose.not, jsondata['categories'][1].drugDose.count),
    'over': calcNum(jsondata['categories'][1].drugDose.over, jsondata['categories'][1].drugDose.count)
  },
  {
    'category': 'Drug Interaction',
    'good': calcNum(jsondata['categories'][2].drugInteraction.good, jsondata['categories'][2].drugInteraction.count),
    'some': calcNum(jsondata['categories'][2].drugInteraction.some, jsondata['categories'][2].drugInteraction.count),
    'not': calcNum(jsondata['categories'][2].drugInteraction.not, jsondata['categories'][2].drugInteraction.count),
    'over': calcNum(jsondata['categories'][2].drugInteraction.over, jsondata['categories'][2].drugInteraction.count)
  },
  {
    'category': 'Drug Allergy',
    'good': calcNum(jsondata['categories'][3].drugAllergy.good, jsondata['categories'][3].drugAllergy.count),
    'some': calcNum(jsondata['categories'][3].drugAllergy.some, jsondata['categories'][3].drugAllergy.count),
    'not': calcNum(jsondata['categories'][3].drugAllergy.not, jsondata['categories'][3].drugAllergy.count),
    'over': calcNum(jsondata['categories'][3].drugAllergy.over, jsondata['categories'][3].drugAllergy.count)
  },
  {
    'category': 'Drug Duplication',
    'good': calcNum(jsondata['categories'][4].drugDuplication.good, jsondata['categories'][4].drugDuplication.count),
    'some': calcNum(jsondata['categories'][4].drugDuplication.some, jsondata['categories'][4].drugDuplication.count),
    'not': calcNum(jsondata['categories'][4].drugDuplication.not, jsondata['categories'][4].drugDuplication.count),
    'over': calcNum(jsondata['categories'][4].drugDuplication.over, jsondata['categories'][4].drugDuplication.count)
  },
  {
    'category': 'Drug Disease',
    'good': calcNum(jsondata['categories'][5].drugDisease.good, jsondata['categories'][5].drugDisease.count),
    'some': calcNum(jsondata['categories'][5].drugDisease.some, jsondata['categories'][5].drugDisease.count),
    'not': calcNum(jsondata['categories'][5].drugDisease.not, jsondata['categories'][5].drugDisease.count),
    'over': calcNum(jsondata['categories'][5].drugDisease.over, jsondata['categories'][5].drugDisease.count)
  },
  {
    'category': 'Drug Omissions',
    'good': calcNum(jsondata['categories'][6].drugOmissions.good, jsondata['categories'][6].drugOmissions.count),
    'some': calcNum(jsondata['categories'][6].drugOmissions.some, jsondata['categories'][6].drugOmissions.count),
    'not': calcNum(jsondata['categories'][6].drugOmissions.not, jsondata['categories'][6].drugOmissions.count),
    'over': calcNum(jsondata['categories'][6].drugOmissions.over, jsondata['categories'][6].drugOmissions.count)
  },
  {
    'category': 'Theraputic Duplication',
    'good': calcNum(jsondata['categories'][7].theraputicDuplication.good, jsondata['categories'][7].theraputicDuplication.count),
    'some': calcNum(jsondata['categories'][7].theraputicDuplication.some, jsondata['categories'][7].theraputicDuplication.count),
    'not': calcNum(jsondata['categories'][7].theraputicDuplication.not, jsondata['categories'][7].theraputicDuplication.count),
    'over': calcNum(jsondata['categories'][7].theraputicDuplication.over, jsondata['categories'][7].theraputicDuplication.count)
  },
  {
    'category': 'Drug Lab',
    'good': calcNum(jsondata['categories'][8].drugLab.good, jsondata['categories'][8].drugLab.count),
    'some': calcNum(jsondata['categories'][8].drugLab.some, jsondata['categories'][8].drugLab.count),
    'not': calcNum(jsondata['categories'][8].drugLab.not, jsondata['categories'][8].drugLab.count),
    'over': calcNum(jsondata['categories'][8].drugLab.over, jsondata['categories'][8].drugLab.count)
  },
  {
    'category': 'Drug Brand',
    'good': calcNum(jsondata['categories'][9].drugBrand.good, jsondata['categories'][9].drugBrand.count),
    'some': calcNum(jsondata['categories'][9].drugBrand.some, jsondata['categories'][9].drugBrand.count),
    'not': calcNum(jsondata['categories'][9].drugBrand.not, jsondata['categories'][9].drugBrand.count),
    'over': calcNum(jsondata['categories'][9].drugBrand.over, jsondata['categories'][9].drugBrand.count)
  },
  {
    'category': 'Drug Route',
    'good': calcNum(jsondata['categories'][10].drugRoute.good, jsondata['categories'][10].drugRoute.count),
    'some': calcNum(jsondata['categories'][10].drugRoute.some, jsondata['categories'][10].drugRoute.count),
    'not': calcNum(jsondata['categories'][10].drugRoute.not, jsondata['categories'][10].drugRoute.count),
    'over': calcNum(jsondata['categories'][10].drugRoute.over, jsondata['categories'][10].drugRoute.count)
  },
  {
    'category': 'Drug Overdose',
    'good': calcNum(jsondata['categories'][11].drugOverdose.good, jsondata['categories'][11].drugOverdose.count),
    'some': calcNum(jsondata['categories'][11].drugOverdose.some, jsondata['categories'][11].drugOverdose.count),
    'not': calcNum(jsondata['categories'][11].drugOverdose.not, jsondata['categories'][11].drugOverdose.count),
    'over': calcNum(jsondata['categories'][11].drugOverdose.over, jsondata['categories'][11].drugOverdose.count)
  },
  {
    'category': 'Drug Frequency',
    'good': calcNum(jsondata['categories'][12].drugFrequency.good, jsondata['categories'][12].drugFrequency.count),
    'some': calcNum(jsondata['categories'][12].drugFrequency.some, jsondata['categories'][12].drugFrequency.count),
    'not': calcNum(jsondata['categories'][12].drugFrequency.not, jsondata['categories'][12].drugFrequency.count),
    'over': calcNum(jsondata['categories'][12].drugFrequency.over, jsondata['categories'][12].drugFrequency.count)
  }]

  return chartCategoryData

}

function calcNum(num, total) {
  return total !== 0 ? parseInt(((num / total) * 100)) : 0
}
