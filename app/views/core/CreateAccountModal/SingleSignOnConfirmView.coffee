require('app/styles/modal/create-account-modal/sso-confirm-view.sass')
CocoView = require 'views/core/CocoView'
BasicInfoView = require 'views/core/CreateAccountModal/BasicInfoView'
template = require 'templates/core/create-account-modal/single-sign-on-confirm-view'
forms = require 'core/forms'
User = require 'models/User'

module.exports = class SingleSignOnConfirmView extends BasicInfoView
  id: 'single-sign-on-confirm-view'
  template: template

  events: _.extend {}, BasicInfoView.prototype.events, {
    'click .back-button': 'onClickBackButton'
  }

  initialize: ({ @signupState } = {}) ->
    super(arguments...)

  afterRender: ->
    super()
    if @signupState.get('path') is 'student'
      # We will automatically try to assign a student the username that matches their email
      currentForm = @signupState.get('signupForm')
      emailObj = _.pick(@signupState.get('ssoAttrs') or {'email': ''}, 'email')
      newUserName = emailObj.email.substring(0, emailObj.email.lastIndexOf("@"))
      currentForm.name = newUserName
      @signupState.set {
        signupForm: currentForm
      }
      nameInput = @$('input[name="name"]')
      nameInput.val(newUserName)
      # We trigger the name change event here to make sure all the proper checking is done
      nameInput.trigger('change')
      @$('form').submit()

    if @signupState.get('path') is 'teacher'
      @$('form').submit()

  onClickBackButton: ->
    @signupState.set {
      ssoUsed: undefined
      ssoAttrs: undefined
    }
    @trigger 'nav-back'


  formSchema: ->
    type: 'object'
    properties:
      name: User.schema.properties.name
    required: []
