RootView = require 'views/core/RootView'
template = require 'templates/account/prepaid-view'
stripeHandler = require 'core/services/stripe'
{getPrepaidCodeAmount} = require '../../core/utils'
CocoCollection = require 'collections/CocoCollection'
Prepaid = require '../../models/Prepaid'
utils = require 'core/utils'
RedeemModal = require 'views/account/PrepaidRedeemModal'
forms = require 'core/forms'


module.exports = class PrepaidView extends RootView
  id: 'prepaid-view'
  template: template
  className: 'container-fluid'

  events:
    'change #users': 'onUsersChanged'
    'change #months': 'onMonthsChanged'
    'click #purchase-button': 'onPurchaseClicked'
    'click #redeem-button': 'onRedeemClicked'

  subscriptions:
    'stripe:received-token': 'onStripeReceivedToken'

  baseAmount: 9.99

  constructor: (options) ->
    super(options)
    @purchase =
      total: @baseAmount
      users: 3
      months: 3
    @updateTotal()

    @codes = new CocoCollection([], { url: '/db/user/'+me.id+'/prepaid_codes', model: Prepaid })
    @codes.on 'add', (code) =>
      @render?()
    @codes.on 'sync', (code) =>
      @render?()

    @supermodel.loadCollection(@codes, 'prepaid', {cache: false})
    @ppc = utils.getQueryVariable('_ppc') ? ''

  getRenderData: ->
    c = super()
    c.purchase = @purchase
    c.codes = @codes
    c.ppc = @ppc
    c

  afterRender: ->
    super()
    @$el.find("span[title]").tooltip()

  statusMessage: (message, type='alert') ->
    noty text: message, layout: 'topCenter', type: type, killer: false, timeout: 5000, dismissQueue: true, maxVisible: 3

  updateTotal: ->
    @purchase.total = getPrepaidCodeAmount(@baseAmount, @purchase.users, @purchase.months)
    @renderSelectors("#total", "#users", "#months")


  # Form Input Callbacks
  onUsersChanged: (e) ->
    newAmount = $(e.target).val()
    newAmount = 1 if newAmount < 1
    @purchase.users = newAmount
    el = $('#purchasepanel')
    if newAmount < 3 and @purchase.months < 3
      message = "Either Users or Months must be greater than 2"
      err = [message: message, property: 'users', formatted: true]
      forms.clearFormAlerts(el)
      forms.applyErrorsToForm(el, err)
    else
      forms.clearFormAlerts(el)

    @updateTotal()

  onMonthsChanged: (e) ->
    newAmount = $(e.target).val()
    newAmount = 1 if newAmount < 1
    @purchase.months = newAmount
    el = $('#purchasepanel')
    if newAmount < 3 and @purchase.users < 3
      message = "Either Users or Months must be greater than 2"
      err = [message: message, property: 'months', formatted: true]
      forms.clearFormAlerts(el)
      forms.applyErrorsToForm(el, err)
    else
      forms.clearFormAlerts(el)

    @updateTotal()

  onPurchaseClicked: (e) ->
    return unless $("#users").val() >= 3 or $("#months").val() >= 3
    @purchaseTimestamp = new Date().getTime()
    @stripeAmount = @purchase.total * 100
    @description = "Prepaid Code for " + @purchase.users + " users / " + @purchase.months + " months"

    stripeHandler.open
      amount: @stripeAmount
      description: @description
      bitcoin: true
      alipay: if me.get('chinaVersion') or (me.get('preferredLanguage') or 'en-US')[...2] is 'zh' then true else 'auto'

  onRedeemClicked: (e) ->
    @ppc = $('#ppc').val()

    unless @ppc
      @statusMessage "You must enter a code.", "error"
      return
    options =
      url: '/db/prepaid/-/code/'+ @ppc
      method: 'GET'

    options.success = (model, res, options) =>
      redeemModal = new RedeemModal ppc: model
      redeemModal.on 'confirm-redeem', @confirmRedeem
      @openModalView redeemModal

    options.error = (model, res, options) =>
      console.warn 'Error getting Prepaid Code'

    prepaid = new Prepaid()
    prepaid.fetch(options)
    # @supermodel.addRequestResource('get_prepaid', options, 0).load()


  confirmRedeem: =>

    options =
      url: '/db/subscription/-/subscribe_prepaid'
      method: 'POST'
      data: { ppc: @ppc }

    options.error = (model, res, options, foo) =>
      console.error 'FAILED redeeming prepaid code'
      msg = model.responseText ? ''
      @statusMessage "Error: Could not redeem prepaid code. #{msg}", "error"

    options.success = (model, res, options) =>
      console.log 'SUCCESS redeeming prepaid code'
      @statusMessage "Prepaid Code Redeemed!", "success"
      @supermodel.loadCollection(@codes, 'prepaid', {cache: false})
      @codes.fetch()

    @supermodel.addRequestResource('subscribe_prepaid', options, 0).load()


  onStripeReceivedToken: (e) ->
    # TODO: show that something is happening in the UI
    options =
      url: '/db/prepaid/-/purchase'
      method: 'POST'

    options.data =
      amount: @stripeAmount
      description: @description
      stripe:
        token: e.token.id
        timestamp: @purchaseTimestamp
      type: 'terminal_subscription'
      maxRedeemers: @purchase.users
      months: @purchase.months

    options.error = (model, response, options) =>
      console.error 'FAILED: Prepaid purchase', response
      console.error options
      @statusMessage "Error purchasing prepaid code", "error"
      # Not sure when this will happen. Stripe popup seems to give appropriate error messages.

    options.success = (model, response, options) =>
      console.log 'SUCCESS: Prepaid purchase', model.code
      @statusMessage "Successfully purchased Prepaid Code!", "success"
      @codes.add(model)

    @statusMessage "Finalizing purchase...", "information"
    @supermodel.addRequestResource('purchase_prepaid', options, 0).load()
