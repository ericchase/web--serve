/*
Search
 */

// Categories
fetch('/categories').then(res => res.json()).then(res => res.forEach(c => document.querySelector('#category').innerHTML += `<option value="${c}">${c[0]}${c.slice(1).replace(/_/g, ' ').toLowerCase()}</option>`))

// Android versions
const androidVersions = [
  '1.0', '1.1', '1.5', '1.6',
  '2.0', '2.0.1', '2.1', '2.2', '2.2.1', '2.2.2', '2.2.3', '2.3', '2.3.1', '2.3.2', '2.3.3', '2.3.4', '2.3.5', '2.3.6', '2.3.7',
  '3.0', '3.1', '3.2', '3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.2.5', '3.2.6',
  '4.0', '4.0.1', '4.0.2', '4.0.3', '4.0.4', '4.1', '4.1.1', '4.1.2', '4.2', '4.2.1', '4.2.2', '4.3', '4.3.1', '4.4', '4.4.1', '4.4.2', '4.4.3', '4.4.4',
  '5.0', '5.0.1', '5.0.2', '5.1', '5.1.1',
  '6.0', '6.0.1',
  '7.0', '7.1', '7.1.1', '7.1.2',
  '8.0', '8.1',
  '9.0',
  '10.0',
  '11.0'
]

androidVersions.forEach(v => document.querySelector('#minAndroidVersion').innerHTML += `<option value="${v}">${v}</option>`)

/**
 * Search request
 * @param query
 * @param callback
 */
let lastQuery = '_'
const search = (query, callback) => {
  if (query.name === lastQuery) { query.number = 120 }
  fetch('/search', {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(query)
  }).then(res => res.json()).then(res => {
    if (res.error) return callback()
    if (res.length === 0 && query.number !== 120) return search({ ...query, number: 120 }, callback)
    const r = []
    for (let i = 0; i < res.length; i++) {
      const _c = []
      for (let j = 0; j < query.conditions.length; j++) {
        _c.push(query.conditions[j](res[i]))
      }
      if (_c.every(c => c === true) || _c.length === 0) {
        r.push(res[i])
      }
      for (const key in res[i]) {
        if (res[i].hasOwnProperty(key)) {
          if (['size', 'version', 'androidVersion'].indexOf(key) !== -1 && res[i][key].search(/var[iy]/i) !== -1) {
            res[i][key] = '-'
          }
          if (['offersIAP', 'adSupported'].indexOf(key) !== -1) {
            res[i][key] = res[i][key].toString().replace('true', 'yes').replace('false', 'no')
          }
        }
      }
    }
    if (r.length === 0 && query.number !== 120) return search({ ...query, number: 120 }, callback)
    lastQuery = query.name
    callback(r)
  }).catch(() => callback())
}

/*
Conditions checking functions
 */
const _c = {
  maxPrice: (app, n) => app.price <= n,
  adFree: app => !app.adSupported,
  inAppFree: app => !app.offersIAP,
  category: (app, n) => app.genreId === n || app.genreId.split('_')[0] === n,
  minInstalls: (app, n) => app.minInstalls >= n,
  minScore: (app, n) => typeof app.score === 'number' && app.score.toFixed(1) >= n,
  maxSize: (app, n) => parseFloat(app.size) <= n,
  maxUpdatedDays: (app, n) => Math.floor((Date.now() - new Date(app.updated)) / 86400000) <= n,
  minAndroidVersion: (app, n) => androidVersions.includes(app.androidVersion) && androidVersions.indexOf(app.androidVersion) <= androidVersions.indexOf(n)
}

// Global search settings
let Query_Conditions, Query_Price, Query_Number
// Default search text display (for reset)
const Query_Text = [...document.querySelectorAll('.search__settings span')].map(el => el.textContent)
const Query_Set = [...document.querySelectorAll('.search__setting')].map(el => el.classList.contains('search__setting--set'))

const resetSettings = () => {
  // Reset search settings
  Query_Conditions = [_c.adFree, _c.inAppFree]
  Query_Price = 'free'
  Query_Number = Math.floor(Query_Conditions.length * 12.5) || 25
  document.querySelector('.search__settings').reset()
  // Reset default text display
  document.querySelectorAll('.search__settings span').forEach((el, index) => el.textContent = Query_Text[index])
  document.querySelectorAll('.search__setting').forEach((el, index) => {
    if (Query_Set[index]) {
      el.classList.add('search__setting--set')
    } else {
      el.classList.remove('search__setting--set')
    }
  })
}

// Init default query settings
resetSettings()

document.querySelector('.resetSettings').onclick = resetSettings

// Reset arrow sort symbols in results table
const resetSorting = () => document.querySelectorAll('.output__header th').forEach(el => el.classList.remove('output__header--sortUp', 'output__header--sortDown'))

const searchInput = document.querySelector('.search__input')
const searchButton = document.querySelector('.search__submit')

searchButton.onclick = () => {
  // Time search
  const startTime = Date.now()
  const outputMessage = document.querySelector('.output__message')
  // Query settings
  const query = { name: searchInput.value, number: Query_Number, price: Query_Price, conditions: Query_Conditions }
  // Let user know that I'm searching
  outputMessage.innerHTML = '<div class="spinner" data-uk-spinner="ratio: 0.75"></div></div>Searching<span class="loading-dots"></span>'
  // Reset and hide previous search elements
  resetSorting()
  document.querySelectorAll('.output__tabs, .output__tables').forEach(el => el.style.display = 'none')
  document.querySelector('.output__data').innerHTML = ''
  document.querySelector('.output2__header').innerHTML = '<tr><th>Permissions \\ Apps</th></tr>'
  document.querySelector('.output2__data').innerHTML = ''
  // Send query
  search(query, res => {
    if (typeof res === 'undefined') {
      return outputMessage.textContent = 'Oops! Something went wrong.'
    }
    if (res.length === 0) {
      return outputMessage.textContent = 'No result.'
    }
    // Calculate elapsed time
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)
    /*
		Show results
		 */
    // Message
    outputMessage.textContent = `Results : ${res.length} items (${(res.length / query.number * 100).toFixed(2)}% of ${query.number} apps), elapsed time : ${elapsedTime}s`
    const displayedPermissions = []
    res.forEach(app => {
      // Show all permissions
      if (Array.isArray(app.permissions)) {
        app.permissions.forEach(permission => {
          const p = permission.permission
          if (displayedPermissions.indexOf(p) === -1) {
            displayedPermissions.push(p)
            document.querySelector('.output2__data').innerHTML += `<tr class="output2__permission"><th class="output2__permission__name">${p}</th></tr>`
          }
        })
      }
      document.querySelector('.output2__header tr').innerHTML += `<th class="output2__app">${app.title}</th>`
      // Show apps details
      document.querySelector('.output__data').innerHTML += `<tr class="output__item" data-link="${app.url}"><td class="output__data__name" data-uk-tooltip="title: ${app.developer}; delay: 500; pos: right"><img class="output__icon" src="${app.icon}" alt="${app.title}">${app.title} <span class="output__data__index">${app.index}</span></td><td class="output__data__description">${app.summary}</td><td class="output__data__category">${app.genreId[0]}${app.genreId.slice(1).replace(/_/g, ' ').toLowerCase()}</td><td class="output__data__installs">${app.minInstalls ? app.minInstalls.toLocaleString('en-US') : 'N/A'}</td><td class="output__data__score" data-uk-tooltip="title: ${app.ratings} ratings; delay: 500; pos: right">${app.score ? app.score.toFixed(1) : 'N/A'}</td><td class="output__data__size">${app.size ? (app.size.endsWith('k') ? `0.${app.size.slice(0, -1)}M` : app.size) : 'N/A'}</td><td class="output__data__version">${app.version}</td><td class="output__data__last-update" data-date=${app.updated}">${app.updated ? new Date(app.updated).toDateString() : 'N/A'}</td><td class="output__data__price">${app.priceText}</td><td class="output__data__ads">${app.adSupported}</td><td class="output__data__IAP">${app.offersIAP}</td><td class="output__data__android-version">${app.androidVersion}</td><td class="output__data__permissions">${Array.isArray(app.permissions) ? app.permissions.length : 'N/A'}</td></tr>`
    })
    res.forEach(app => {
      // Show permissions per app
      if (Array.isArray(app.permissions)) {
        for (let i = 0; i < displayedPermissions.length; i++) {
          document.querySelectorAll('.output2__permission')[i].innerHTML += `<td>${app.permissions.map(p => p.permission).indexOf(displayedPermissions[i]) !== -1 ? '•' : ''}</td>`
        }
      }
    })
    // Display tables
    document.querySelectorAll('.output__tabs, .output__tables').forEach(el => { el.style.display = ''; return el.style.display })
    // Open link on click
    document.querySelectorAll('.output__item').forEach(el => {
      let d = false
      el.onclick = () => {
        if (window.getSelection().toString().length > 0) return
        setTimeout(() => {
          if (!d) window.open(el.getAttribute('data-link'))
        }, 200)
      }
      el.ondblclick = () => d = true
    })
  })
}

searchInput.onkeydown = e => {
  if (e.key !== 'Enter') return
  searchButton.click()
  document.activeElement.blur()
  window.scroll({ behavior: 'smooth', top: document.querySelector('.output').offsetTop })
}

searchInput.focus()

const inputs = document.querySelectorAll('.search__settings input, .search__settings select')
inputs.forEach(el => el.oninput = () => {
  /*
	Set query conditions from user input
	 */
  const filter = el.id
  Query_Conditions = []
  inputs.forEach(el => {
    if ([el.min, 'on', ''].indexOf(el.value) === -1 || el.checked) {
      const filter = el.id
      switch (filter) {
        case 'category':
        case 'minAndroidVersion':
          Query_Conditions.push(app => _c[filter](app, el.value))
          break
        case 'maxPrice':
        case 'minScore':
        case 'maxSize':
        case 'maxUpdatedDays':
          Query_Conditions.push(app => _c[filter](app, parseFloat(el.value)))
          break
        case 'adFree':
        case 'inAppFree':
          Query_Conditions.push(_c[filter])
          break
        case 'minInstalls':
          const range = [0, 1, 1000, 10000, 100000, 1000000, 10000000]
          Query_Conditions.push(app => _c[filter](app, range[parseInt(el.value)]))
          break
      }
      el.parentElement.classList.add('search__setting--set')
    } else {
      el.parentElement.classList.remove('search__setting--set')
    }
  })
  /*
	Display proper conditions text from user input
	 */
  Query_Number = Math.floor(Query_Conditions.length * 12.5) || 25
  if (el.type === 'range') {
    const text = document.querySelector(`.${filter}-text`)
    let
      suffix = ''
    let minText = 'min'
    let maxText = '∞'
    if (filter === 'maxSize') suffix = 'M'
    if (filter === 'maxPrice') {
      minText = 'free'
      suffix = '$'
    }
    if (filter === 'maxPrice') {
      if (el.value === '0') { Query_Price = 'free' } else { Query_Price = 'all' }
    }
    if (filter === 'minInstalls') { maxText = '10M+' }
    if (el.value === el.min) { text.textContent = minText } else if (el.value === el.max) { text.textContent = maxText } else {
      if (filter === 'minInstalls') {
        const range = ['0', '1', '1k', '10k', '100k', '1M', '10M']
        return text.textContent = range[parseInt(el.value)]
      }
      text.textContent = `${el.value}${suffix}`
    }
  }
})

/*
Sort
 */

document.querySelectorAll('.output__header th').forEach(el => el.onclick = () => {
  // App description and version cannot be sorted
  if (['output__header__description', 'output__header__version'].indexOf(el.className) !== -1) return
  // Reset and re-sort
  resetSorting()
  const
    items = [...document.querySelectorAll('.output__item')]
  let
    sortedItems = items.slice(0)
  let getItem = item => item.querySelector(`.output__data__${el.className.split('__').slice(-1)[0]}`).textContent
  if (el.className === 'output__header__last-update') {
    // Use UNIX timestamp instead of interpreted date string
    getItem = item => item.querySelector(`.output__data__${el.className.split('__').slice(-1)[0]}`).getAttribute('data-date')
  }
  switch (el.className) {
    // Different comparison function for each data type
    case 'output__header__name':
    case 'output__header__category':
      sortedItems.sort((a, b) => getItem(a) < getItem(b) ? -1 : 1)
      break
    case 'output__header__installs':
      sortedItems.sort((a, b) => parseInt(getItem(a).replace(/,/g, '')) - parseInt(getItem(b).replace(/,/g, '')))
      break
    case 'output__header__score':
    case 'output__header__permissions':
      sortedItems.sort((a, b) => getItem(a) - getItem(b))
      break
    case 'output__header__android-version':
      sortedItems.sort((a, b) => androidVersions.indexOf(getItem(a)) < androidVersions.indexOf(getItem(b)) ? -1 : 1)
      break
    case 'output__header__size':
      sortedItems.sort((a, b) => getItem(a).slice(0, -1) - getItem(b).slice(0, -1))
      break
    case 'output__header__last-update':
      sortedItems.sort((a, b) => parseInt(getItem(a)) - parseInt(getItem(b)))
      break
    case 'output__header__price':
      sortedItems = [].concat(items.filter(el => getItem(el) === 'Free'),
        items.filter(el => getItem(el) !== 'Free').sort((a, b) => [getItem(a), getItem(b)].sort()[0] === getItem(a) ? -1 : 1))
      break
    case 'output__header__ads':
    case 'output__header__IAP':
      sortedItems.sort(a => getItem(a) === 'yes' ? 1 : -1)
      break
  }
  // Display proper sort symbol
  if (JSON.stringify(items.map(item => getItem(item))) === JSON.stringify(sortedItems.map(item => getItem(item)))) {
    sortedItems.reverse()
    el.classList.add('output__header--sortUp')
  } else {
    el.classList.add('output__header--sortDown')
  }
  // Hide all items
  items.forEach(item => item.parentNode.removeChild(item))
  // Unhide all items in proper sort order
  for (const item of sortedItems) {
    document.querySelector('.output__data').appendChild(item)
  }
})
