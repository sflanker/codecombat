mongoose = require 'mongoose'
plugins = require '../plugins/plugins'

ArticleSchema = new mongoose.Schema(body: String, {strict: false})

ArticleSchema.index(
  {
    index: 1
    _fts: 'text'
    _ftsx: 1
  },
  {
    name: 'search index'
    sparse: true
    weights: {body: 1, name: 1}
    default_language: 'english'
    'language_override': 'searchLanguage'
    'textIndexVersion': 2
  })
ArticleSchema.index(
  {
    original: 1
    'version.major': -1
    'version.minor': -1
  },
  {
    name: 'version index'
    unique: true
  })
ArticleSchema.index({slug: 1}, {name: 'slug index', sparse: true, unique: true})

ArticleSchema.plugin(plugins.NamedPlugin)
ArticleSchema.plugin(plugins.VersionedPlugin)
ArticleSchema.plugin(plugins.SearchablePlugin, {searchable: ['body', 'name']})
ArticleSchema.plugin(plugins.PatchablePlugin)

module.exports = mongoose.model('article', ArticleSchema)
