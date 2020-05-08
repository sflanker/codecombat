CocoModel = require 'models/CocoModel'
utils = require 'core/utils'

class BlandClass extends CocoModel
  @className: 'Bland'
  @schema: {
    type: 'object'
    additionalProperties: false
    properties:
      number: {type: 'number'}
      object: {type: 'object'}
      string: {type: 'string'}
      _id: {type: 'string'}
  }
  urlRoot: '/db/bland'

describe 'CocoModel', ->
  describe 'setProjection', ->
    it 'takes an array of properties to project and adds them as a query parameter', ->
      b = new BlandClass({})
      b.setProjection ['number', 'object']
      b.fetch()
      request = jasmine.Ajax.requests.mostRecent()
      expect(decodeURIComponent(request.url).indexOf('project=number,object')).toBeGreaterThan(-1)

    it 'can update its projection', ->
      baseURL = '/db/bland/test?filter-creator=Mojambo&project=number,object&ignore-evil=false'
      unprojectedURL = baseURL.replace /&project=number,object/, ''
      b = new BlandClass({})
      b.setURL baseURL
      expect(b.getURL()).toBe baseURL
      b.setProjection ['number', 'object']
      expect(b.getURL()).toBe baseURL
      b.setProjection ['number']
      expect(b.getURL()).toBe baseURL.replace /,object/, ''
      b.setProjection []
      expect(b.getURL()).toBe unprojectedURL
      b.setProjection null
      expect(b.getURL()).toBe unprojectedURL
      b.setProjection ['object', 'number']
      expect(b.getURL()).toBe unprojectedURL + '&project=object,number'

  describe 'save', ->
    it 'saves to db/<urlRoot>', ->
      b = new BlandClass({})
      res = b.save()
      request = jasmine.Ajax.requests.mostRecent()
      expect(res).toBeDefined()
      expect(request.url).toBe(b.urlRoot)
      expect(request.method).toBe('POST')

    it 'does not save if the data is invalid based on the schema', ->
      b = new BlandClass({number: 'NaN'})
      res = b.save()
      expect(res).toBe(false)
      request = jasmine.Ajax.requests.mostRecent()
      expect(request).toBeUndefined()

    it 'uses PUT when _id is included', ->
      b = new BlandClass({_id: 'test'})
      b.save()
      request = jasmine.Ajax.requests.mostRecent()
      expect(request.method).toBe('PUT')

  describe 'patch', ->
    it 'PATCHes only properties that have changed', ->
      b = new BlandClass({_id: 'test', number: 1})
      b.loaded = true
      b.set('string', 'string')
      b.patch()
      request = jasmine.Ajax.requests.mostRecent()
      params = JSON.parse request.params
      expect(params.string).toBeDefined()
      expect(params.number).toBeUndefined()

    it 'collates all changes made over several sets', ->
      b = new BlandClass({_id: 'test', number: 1})
      b.loaded = true
      b.set('string', 'string')
      b.set('object', {4: 5})
      b.patch()
      request = jasmine.Ajax.requests.mostRecent()
      params = JSON.parse request.params
      expect(params.string).toBeDefined()
      expect(params.object).toBeDefined()
      expect(params.number).toBeUndefined()

    it 'does not include data from previous patches', ->
      b = new BlandClass({_id: 'test', number: 1})
      b.loaded = true
      b.set('object', {1: 2})
      b.patch()
      request = jasmine.Ajax.requests.mostRecent()
      attrs = JSON.stringify(b.attributes) # server responds with all
      request.respondWith({status: 200, responseText: attrs})

      b.set('number', 3)
      b.patch()
      request = jasmine.Ajax.requests.mostRecent()
      params = JSON.parse request.params
      expect(params.object).toBeUndefined()

    it 'does nothing when there\'s nothing to patch', ->
      b = new BlandClass({_id: 'test', number: 1})
      b.loaded = true
      b.set('number', 1)
      b.patch()
      request = jasmine.Ajax.requests.mostRecent()
      expect(request).toBeUndefined()

  describe 'updateI18NCoverage', ->
    class FlexibleClass extends CocoModel
      @className: 'Flexible'
      @schema: {
        type: 'object'
        properties: {
          name: { type: 'string' }
          description: { type: 'string' }
          innerObject: {
            type: 'object'
            properties: {
              name: { type: 'string' }
              i18n: { type: 'object', format: 'i18n', props: ['name']}
            }
          }
          i18n: { type: 'object', format: 'i18n', props: ['description', 'name', 'prop1']}
        }
      }

    it 'only includes languages for which all objects include a translation', ->
      m = new FlexibleClass({
        i18n: { es: { name: '+', description: '+' }, fr: { name: '+', description: '+' } }
        name: 'Name'
        description: 'Description'
        innerObject: {
          i18n: { es: { name: '+' }, de: { name: '+' }, fr: {} }
          name: 'Name'
        }
      })

      m.updateI18NCoverage()
      expect(_.isEqual(m.get('i18nCoverage'), ['es'])).toBe(true)

    it 'ignores objects for which there is nothing to translate', ->
      m = new FlexibleClass()
      m.set({
        name: 'Name'
        i18n: {
          '-': {'-':'-'}
          'es': {name: 'Name in Spanish'}
        }
        innerObject: {
          i18n: { '-': {'-':'-'} }
        }
      })
      m.updateI18NCoverage()
      expect(_.isEqual(m.get('i18nCoverage'), ['es'])).toBe(true)
