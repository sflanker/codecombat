Patch = require './../models/Patch'
User = require '../models/User'
Handler = require '../commons/Handler'
schema = require '../../app/schemas/models/patch'
{handlers} = require '../commons/mapping'
mongoose = require 'mongoose'
log = require 'winston'
sendwithus = require '../sendwithus'
slack = require '../slack'

PatchHandler = class PatchHandler extends Handler
  modelClass: Patch
  editableProperties: []
  postEditableProperties: ['delta', 'target', 'commitMessage']
  jsonSchema: require '../../app/schemas/models/patch'

  makeNewInstance: (req) ->
    patch = super(req)
    patch.set 'creator', req.user._id
    patch.set 'created', new Date().toISOString()
    patch.set 'status', 'pending'
    patch

  get: (req, res) ->
    if req.query.view in ['pending']
      query = status: 'pending'
      q = Patch.find(query)
      q.exec (err, documents) =>
        return @sendDatabaseError(res, err) if err
        documents = (@formatEntity(req, doc) for doc in documents)
        @sendSuccess(res, documents)
    else
      super(arguments...)

  onPostSuccess: (req, doc) ->
    log.error 'Error sending patch created: could not find the loaded target on the patch object.' unless doc.targetLoaded
    return unless doc.targetLoaded
    docLink = "http://codecombat.com#{req.headers['x-current-path']}" # TODO: Priority low
    @sendPatchCreatedSlackMessage creator: req.user, patch: doc, target: doc.targetLoaded, docLink: docLink
    watchers = doc.targetLoaded.get('watchers') or []
    # Don't send these emails to the person who submitted the patch, or to Nick, George, or Scott.
    watchers = (w for w in watchers when not w.equals(req.user.get('_id')) and not (w + '' in ['512ef4805a67a8c507000001', '5162fab9c92b4c751e000274', '51538fdb812dd9af02000001']))
    return unless watchers?.length
    User.find({_id: {$in: watchers}}).select({email: 1, name: 1}).exec (err, watchers) =>
      for watcher in watchers
        @sendPatchCreatedEmail req.user, watcher, doc, doc.targetLoaded, docLink

  sendPatchCreatedEmail: (patchCreator, watcher, patch, target, docLink) ->
    return if not watcher.get('email')
    # return if watcher._id is patchCreator._id
    context =
      email_id: sendwithus.templates.patch_created
      recipient:
        address: watcher.get('email')
        name: watcher.get('name')
      email_data:
        doc_name: target.get('name') or '???'
        submitter_name: patchCreator.get('name') or '???'
        doc_link: docLink
        commit_message: patch.get('commitMessage')
    sendwithus.api.send context, (err, result) ->

  sendPatchCreatedSlackMessage: (options) ->
    message = "#{options.creator.get('name')} submitted a patch to #{options.target.get('name')}: #{options.patch.get('commitMessage')} #{options.docLink}"
    slack.sendSlackMessage message, ['artisans']

module.exports = new PatchHandler()
