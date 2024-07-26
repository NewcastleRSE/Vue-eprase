
// July 2024 - we can have multiple alerts and advisories in any of the categories
// selected_type is now a comma-separated list of alert|advisory
// intervention_type is a comma-separated list of the category codes, same length as above

export function mitigationDataByCategory(cats, data) {

  console.group('mitigationDataByCategory()')
  console.debug('Categories', cats, 'data', data)

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
  }

  data.forEach(elt => {
    if (elt.outcome == 'intervention') {
      categoryData['totals'].totalInterventions++
    }
    const interventionTypeCategoryCodes = elt.intervention_type.split(',')
    const interventionSelectedTypes = elt.selected_type.split(',')

    interventionTypeCategoryCodes.forEach((itcc, idx) => {
      if (interventionSelectedTypes[idx] == 'advisory') {
        categoryData['totals'].totalAdvisory++
      } else if (interventionSelectedTypes[idx] == 'alert') {
        categoryData['totals'].totalAlerts++
      }
    })
    
    if (elt.mitigation == 'Null') {
      categoryData['totals'].totalNulls++
    } else if (elt.mitigation == 'Good Mitigation/Pass'){
      categoryData['categories'][elt.categoryCode]['good']++
      categoryData['totals'].totalGood++
    } else if (elt.mitigation == 'Some Mitigation'){
      categoryData['categories'][elt.categoryCode]['some']++
      categoryData['totals'].totalSome++
    } else if (elt.mitigation == 'No Mitigation/Fail'){
      categoryData['categories'][elt.categoryCode]['not']++
      categoryData['totals'].totalNot++
    } else if (elt.mitigation == 'Over Mitigation'){
      categoryData['categories'][elt.categoryCode]['over']++
      categoryData['totals'].totalOver++
    }
    if (elt.mitigation != 'Null') {
      categoryData['categories'][elt.categoryCode]['count']++
    }
  })

  console.debug('Mitigation data by category', categoryData)
  console.groupEnd()

  return categoryData;
}

// Original method where category is taken from the indicator
// export function mitigationDataByCategory(cats, data) {

//   console.group('mitigationDataByCategory()')
//   console.debug('Categories', cats, 'data', data)

//   const categoryData = {
//     'totals': Object.fromEntries([
//       'totalGood',
//       'totalSome',
//       'totalNot',
//       'totalOver',
//       'totalNulls',
//       'totalAlerts',
//       'totalAdvisory',
//       'totalInterventions'].map(e => [e, 0])
//     ),
//     'categories': Object.fromEntries(cats.map(c => c.categoryCode).map(cc => [cc, {'good': 0, 'some': 0, 'not': 0, 'over': 0, 'count': 0 }]))
//   }

//   data.forEach(elt => {
//     if (elt.outcome == 'intervention') {
//       categoryData['totals'].totalInterventions++
//     }
//     if (elt.selected_type == 'alert') {
//       categoryData['totals'].totalAlerts++
//     } else if (elt.selected_type == 'advisory') {
//       categoryData['totals'].totalAdvisory++
//     }
//     if (elt.mitigation == 'Null') {
//       categoryData['totals'].totalNulls++
//     } else if (elt.mitigation == 'Good Mitigation/Pass'){
//       categoryData['categories'][elt.categoryCode]['good']++
//       categoryData['totals'].totalGood++
//     } else if (elt.mitigation == 'Some Mitigation'){
//       categoryData['categories'][elt.categoryCode]['some']++
//       categoryData['totals'].totalSome++
//     } else if (elt.mitigation == 'No Mitigation/Fail'){
//       categoryData['categories'][elt.categoryCode]['not']++
//       categoryData['totals'].totalNot++
//     } else if (elt.mitigation == 'Over Mitigation'){
//       categoryData['categories'][elt.categoryCode]['over']++
//       categoryData['totals'].totalOver++
//     }
//     if (elt.mitigation != 'Null') {
//       categoryData['categories'][elt.categoryCode]['count']++
//     }
//   })

//   console.debug('Mitigation data by category', categoryData)
//   console.groupEnd()

//   return categoryData;
// }
