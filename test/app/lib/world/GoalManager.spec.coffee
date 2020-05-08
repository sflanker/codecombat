describe('GoalManager', ->
  GoalManager = require 'lib/world/GoalManager'
  killGoal = {name: 'Kill Guy', killThangs: ['Guy1', 'Guy2'], id: 'killguy'}
  saveGoal = {name: 'Save Guy', saveThangs: ['Guy1', 'Guy2'], id: 'saveguy'}
  getToLocGoal = {name: 'Go there', getToLocation: {target: 'Frying Pan', who: 'Potato'}, id: 'id'}
  keepFromLocGoal = {name: 'Go there', keepFromLocation: {target: 'Frying Pan', who: 'Potato'}, id: 'id'}
  leaveMapGoal = {name: 'Go away', leaveOffSide: {who: 'Yall'}, id: 'id'}
  stayMapGoal =  {name: 'Stay here', keepFromLeavingOffSide: {who: 'Yall'}, id: 'id'}
  getItemGoal = {name: 'Mine', getItem: {who: 'Grabby', itemID: 'Sandwich'}, id: 'id'}
  keepItemGoal = {name: 'Not Yours', keepFromGettingItem: {who: 'Grabby', itemID: 'Sandwich'}, id: 'id'}

  it('handles kill goal', ->
    gm = new GoalManager()
    gm.setGoals([killGoal])
    gm.worldGenerationWillBegin()
    gm.submitWorldGenerationEvent('world:thang-died', {thang: {id: 'Guy1'}}, 10)
    gm.worldGenerationEnded()
    goalStates = gm.getGoalStates()
    expect(goalStates.killguy.status).toBe('incomplete')
    expect(goalStates.killguy.killed.Guy1).toBe(true)
    expect(goalStates.killguy.killed.Guy2).toBe(false)
    expect(goalStates.killguy.keyFrame).toBe(0)

    gm.submitWorldGenerationEvent('world:thang-died', {thang: {id: 'Guy2'}}, 20)
    goalStates = gm.getGoalStates()
    expect(goalStates.killguy.status).toBe('success')
    expect(goalStates.killguy.killed.Guy1).toBe(true)
    expect(goalStates.killguy.killed.Guy2).toBe(true)
    expect(goalStates.killguy.keyFrame).toBe(20)
  )

  it('handles save goal', ->
    gm = new GoalManager()
    gm.setGoals([saveGoal])
    gm.worldGenerationWillBegin()
    gm.submitWorldGenerationEvent('world:thang-died', {thang: {id: 'Guy1'}}, 10)
    gm.worldGenerationEnded()
    goalStates = gm.getGoalStates()
    expect(goalStates.saveguy.status).toBe('failure')
    expect(goalStates.saveguy.killed.Guy1).toBe(true)
    expect(goalStates.saveguy.killed.Guy2).toBe(false)
    expect(goalStates.saveguy.keyFrame).toBe(10)

    gm = new GoalManager()
    gm.setGoals([saveGoal])
    gm.worldGenerationWillBegin()
    gm.worldGenerationEnded()
    goalStates = gm.getGoalStates()
    expect(goalStates.saveguy.status).toBe('success')
    expect(goalStates.saveguy.killed.Guy1).toBe(false)
    expect(goalStates.saveguy.killed.Guy2).toBe(false)
    expect(goalStates.saveguy.keyFrame).toBe('end')
  )
)
